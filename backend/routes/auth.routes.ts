import { createDbClient } from '../db/client';
import {
  completeEmailVerificationAtomically,
  findEmailVerificationByHash,
  insertSession,
  registerUserAtomically,
  revokeSessionById,
} from '../db/queries/auth.queries';
import { isAllowedEmailDomain, recordSecurityEvent } from '../db/queries/security.queries';
import { generateSecureToken, hashPassword, sha256Hex } from '../lib/crypto';
import { ConflictError, ValidationError } from '../lib/errors';
import { createSecurityHeaders, jsonSuccess } from '../lib/response';
import type { ApiRouter } from '../lib/router';
import {
  normalizeEmail,
  parseJsonBody,
  validatePasswordInput,
} from '../lib/validation';
import {
  assertSameOriginMutation,
  authenticateCredentialsWithLockout,
  buildClearSessionCookieHeader,
  buildSessionCookieHeader,
  getClientIp,
  resolveOptionalUser,
  verifyTurnstileIfConfigured,
} from '../middleware/auth';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

interface LoginPayload {
  email?: unknown;
  password?: unknown;
  turnstileToken?: unknown;
}

interface RegisterPayload {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  turnstileToken?: unknown;
}

interface VerifyEmailPayload {
  token?: unknown;
}

export function registerAuthRoutes(router: ApiRouter): void {
  router.get('/api/v1/auth/session', async (ctx) => {
    const db = createDbClient(ctx.env.DB);
    const user = await resolveOptionalUser(ctx, db);

    if (!user) {
      return jsonSuccess({ authenticated: false, user: null }, ctx.requestId);
    }

    return jsonSuccess(
      {
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          isPublisher: user.isPublisher,
          emailVerified: user.emailVerified,
        },
      },
      ctx.requestId,
    );
  });

  router.post('/api/v1/auth/login', async (ctx) => {
    assertSameOriginMutation(ctx.request, ctx.url);
    const db = createDbClient(ctx.env.DB);
    const ip = getClientIp(ctx.request);
    const body = await parseJsonBody<LoginPayload>(ctx.request);

    await verifyTurnstileIfConfigured(ctx.env, body.turnstileToken, ip);

    const email = normalizeEmail(body.email);
    const password = validatePasswordInput(body.password);

    const user = await authenticateCredentialsWithLockout(
      db,
      ctx.env,
      email,
      password,
      ip,
      ctx.url.pathname,
    );

    const rawToken = generateSecureToken(32);
    const tokenHash = await sha256Hex(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

    await insertSession(db, {
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash,
      ipAddress: ip,
      userAgentSummary: (ctx.request.headers.get('User-Agent') ?? '').slice(0, 120) || null,
      expiresAt,
    });

    await recordSecurityEvent(db, {
      eventType: 'LOGIN_SUCCEEDED',
      severity: 'info',
      userId: user.id,
      ipAddress: ip,
      endpoint: ctx.url.pathname,
    });

    const headers = createSecurityHeaders(ctx.requestId);
    headers.append(
      'Set-Cookie',
      buildSessionCookieHeader(rawToken, SESSION_TTL_SECONDS, ctx.url),
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          authenticated: true,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            isPublisher: user.isPublisher,
          },
        },
        requestId: ctx.requestId,
      }),
      { status: 200, headers },
    );
  });

  router.post('/api/v1/auth/register', async (ctx) => {
    assertSameOriginMutation(ctx.request, ctx.url);
    const db = createDbClient(ctx.env.DB);
    const ip = getClientIp(ctx.request);
    const body = await parseJsonBody<RegisterPayload>(ctx.request);

    await verifyTurnstileIfConfigured(ctx.env, body.turnstileToken, ip);

    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80) {
      throw new ValidationError('Name must be between 2 and 80 characters');
    }

    const name = body.name.trim();
    const email = normalizeEmail(body.email);
    const password = validatePasswordInput(body.password);

    if (!(await isAllowedEmailDomain(db, email))) {
      throw new ValidationError('Registration with this email domain is not permitted');
    }

    const passwordHash = await hashPassword(password, ctx.env.PASSWORD_PEPPER);
    const userId = crypto.randomUUID();
    const baseHandle = email.split('@')[0].replace(/[^a-z0-9_]/gi, '').slice(0, 14) || 'user';
    const username = `${baseHandle}_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;

    const rawVerifyToken = generateSecureToken(24);
    const verifyTokenHash = await sha256Hex(rawVerifyToken);
    const verificationExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    try {
      await registerUserAtomically(db, {
        userId,
        name,
        username,
        email,
        passwordHash,
        verificationId: crypto.randomUUID(),
        verificationTokenHash: verifyTokenHash,
        verificationExpiresAt,
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        await recordSecurityEvent(db, {
          eventType: 'REGISTER_CONFLICT',
          severity: 'low',
          ipAddress: ip,
          endpoint: ctx.url.pathname,
        });
        throw new ConflictError(
          'Registration could not be completed with the provided details.',
        );
      }
      throw error;
    }

    await recordSecurityEvent(db, {
      eventType: 'USER_REGISTERED',
      severity: 'info',
      userId,
      ipAddress: ip,
      endpoint: ctx.url.pathname,
    });

    return jsonSuccess(
      {
        registered: true,
        emailVerificationPending: true,
        emailDeliveryAvailable: false,
        notice:
          'Account created. Verification email was not dispatched because no free email delivery provider is configured yet.',
      },
      ctx.requestId,
      201,
    );
  });

  router.post('/api/v1/auth/verify-email', async (ctx) => {
    assertSameOriginMutation(ctx.request, ctx.url);
    const db = createDbClient(ctx.env.DB);
    const ip = getClientIp(ctx.request);
    const body = await parseJsonBody<VerifyEmailPayload>(ctx.request);

    if (typeof body.token !== 'string' || body.token.trim().length < 16) {
      throw new ValidationError('Invalid or expired verification token');
    }

    const tokenHash = await sha256Hex(body.token.trim());
    const record = await findEmailVerificationByHash(db, tokenHash);

    if (
      !record ||
      record.verified_at !== null ||
      Date.parse(record.expires_at) <= Date.now()
    ) {
      await recordSecurityEvent(db, {
        eventType: 'EMAIL_VERIFICATION_FAILED',
        severity: 'low',
        ipAddress: ip,
        endpoint: ctx.url.pathname,
      });
      throw new ValidationError('Invalid or expired verification token');
    }

    const verified = await completeEmailVerificationAtomically(db, record.id, record.user_id);
    if (!verified) {
      throw new ValidationError('Invalid or expired verification token');
    }

    await recordSecurityEvent(db, {
      eventType: 'EMAIL_VERIFIED',
      severity: 'info',
      userId: record.user_id,
      ipAddress: ip,
      endpoint: ctx.url.pathname,
    });

    return jsonSuccess(
      {
        verified: true,
      },
      ctx.requestId,
    );
  });

  router.post('/api/v1/auth/logout', async (ctx) => {
    assertSameOriginMutation(ctx.request, ctx.url);
    const db = createDbClient(ctx.env.DB);
    const user = await resolveOptionalUser(ctx, db);

    if (user) {
      await revokeSessionById(db, user.sessionId, 'user_logout');
    }

    const headers = createSecurityHeaders(ctx.requestId);
    headers.append('Set-Cookie', buildClearSessionCookieHeader(ctx.url));

    return new Response(
      JSON.stringify({
        success: true,
        data: { loggedOut: true },
        requestId: ctx.requestId,
      }),
      { status: 200, headers },
    );
  });
}
