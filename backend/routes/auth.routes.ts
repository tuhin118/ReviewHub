import { createDbClient } from '../db/client';
import {
  insertEmailVerificationToken,
  insertSession,
  insertUserAccount,
  revokeSessionById,
} from '../db/queries/auth.queries';
import { isAllowedEmailDomain, recordSecurityEvent } from '../db/queries/security.queries';
import { generateSecureToken, hashPassword, sha256Hex } from '../lib/crypto';
import { ValidationError } from '../lib/errors';
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
    const baseHandle = email.split('@')[0].replace(/[^a-z0-9_]/gi, '').slice(0, 16) || 'user';
    const username = `${baseHandle}_${crypto.randomUUID().slice(0, 6)}`;

    try {
      await insertUserAccount(db, {
        id: userId,
        name,
        username,
        email,
        passwordHash,
      });

      const rawVerifyToken = generateSecureToken(24);
      const verifyTokenHash = await sha256Hex(rawVerifyToken);
      await insertEmailVerificationToken(db, {
        id: crypto.randomUUID(),
        userId,
        email,
        tokenHash: verifyTokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });
    } catch {
      // Uniform non-enumerating acceptance or safe error without leaking account existence
      return jsonSuccess(
        {
          registered: true,
          emailVerificationPending: true,
          emailDispatchConfigured: false,
        },
        ctx.requestId,
        201,
      );
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
        emailDispatchConfigured: false,
      },
      ctx.requestId,
      201,
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
