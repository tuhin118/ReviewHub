import {
  clearFailedLoginState,
  findActiveSessionUser,
  findUserForLogin,
  revokeAllSessionsForUser,
  revokeSessionById,
  updateFailedLoginState,
} from '../db/queries/auth.queries';
import { getUserPermissionCodes } from '../db/queries/admin.queries';
import {
  hasActiveUserBan,
  isIpBlocked,
  recordSecurityEvent,
} from '../db/queries/security.queries';
import type { D1Client } from '../db/client';
import { sha256Hex, verifyPassword } from '../lib/crypto';
import {
  ForbiddenError,
  ServiceUnavailableError,
  UnauthorizedError,
  ValidationError,
} from '../lib/errors';
import type { ApiRequestContext, AuthenticatedUser, Env } from '../types/env';

const SESSION_COOKIE_NAME = 'rh_session';
const LOCK_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export function getClientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP')?.trim() || 'unknown';
}

export function extractSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const name = pair.slice(0, idx).trim();
    if (name === SESSION_COOKIE_NAME) {
      return decodeURIComponent(pair.slice(idx + 1).trim());
    }
  }
  return null;
}

export function buildSessionCookieHeader(
  rawToken: string,
  maxAgeSeconds: number,
  requestUrl: URL,
): string {
  const secureFlag = requestUrl.protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(rawToken)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

export function buildClearSessionCookieHeader(requestUrl: URL): string {
  const secureFlag = requestUrl.protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureFlag}`;
}

export function assertSameOriginMutation(request: Request, url: URL): void {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return;

  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) {
    throw new ForbiddenError('Cross-origin state-changing request rejected');
  }
}

export async function verifyTurnstileIfConfigured(
  env: Env,
  token: unknown,
  ipAddress: string,
): Promise<void> {
  if (!env.TURNSTILE_SECRET_KEY) {
    throw new ServiceUnavailableError('Security CAPTCHA provider is not configured');
  }
  if (typeof token !== 'string' || !token.trim()) {
    throw new ValidationError('CAPTCHA verification token is required');
  }

  const formBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token.trim(),
    remoteip: ipAddress,
  });

  const verifyResponse = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formBody,
    },
  );

  if (!verifyResponse.ok) {
    throw new ServiceUnavailableError('CAPTCHA verification service error');
  }

  const result = (await verifyResponse.json()) as { success?: boolean };
  if (!result.success) {
    throw new ValidationError('CAPTCHA verification failed');
  }
}

export async function resolveOptionalUser(
  ctx: ApiRequestContext,
  db: D1Client,
): Promise<AuthenticatedUser | undefined> {
  const ip = getClientIp(ctx.request);
  if (ip !== 'unknown' && (await isIpBlocked(db, ip))) {
    throw new ForbiddenError('Access restricted for this network address');
  }

  const rawToken = extractSessionCookie(ctx.request);
  if (!rawToken) return undefined;

  const tokenHash = await sha256Hex(rawToken);
  const row = await findActiveSessionUser(db, tokenHash);
  if (!row) return undefined;

  if (row.account_status !== 'active') {
    await revokeSessionById(db, row.session_id, 'account_disabled');
    return undefined;
  }

  if (await hasActiveUserBan(db, row.user_id, 'login')) {
    await revokeAllSessionsForUser(db, row.user_id, 'login_ban_enforced');
    return undefined;
  }

  const permissions =
    row.role === 'admin' ? await getUserPermissionCodes(db, row.user_id) : [];

  return {
    id: row.user_id,
    name: row.name,
    username: row.username,
    email: row.email,
    role: row.role,
    isPublisher: row.is_publisher === 1,
    emailVerified: row.email_verified === 1,
    sessionId: row.session_id,
    permissions,
  };
}

export async function requireAuthenticatedUser(
  ctx: ApiRequestContext,
  db: D1Client,
): Promise<AuthenticatedUser> {
  const user = await resolveOptionalUser(ctx, db);
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }
  ctx.user = user;
  return user;
}

export async function requireVerifiedPublisher(
  ctx: ApiRequestContext,
  db: D1Client,
): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser(ctx, db);
  if (!user.isPublisher && user.role !== 'admin') {
    throw new ForbiddenError('Verified Publisher permission required');
  }
  if (await hasActiveUserBan(db, user.id, 'posting')) {
    throw new ForbiddenError('Posting is restricted on this account');
  }
  return user;
}

export async function requireAdminPermission(
  ctx: ApiRequestContext,
  db: D1Client,
  permissionCode: string,
): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser(ctx, db);
  if (user.role !== 'admin') {
    throw new ForbiddenError('Administrator access required');
  }
  if (!user.permissions.includes(permissionCode)) {
    throw new ForbiddenError(`Missing required admin permission: ${permissionCode}`);
  }
  return user;
}

export async function authenticateCredentialsWithLockout(
  db: D1Client,
  env: Env,
  email: string,
  password: string,
  ipAddress: string,
  endpoint: string,
): Promise<{
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isPublisher: boolean;
}> {
  const genericErrorMessage = 'Invalid email or password.';
  const user = await findUserForLogin(db, email);

  if (!user) {
    await recordSecurityEvent(db, {
      eventType: 'LOGIN_FAILED_UNKNOWN',
      severity: 'low',
      ipAddress,
      endpoint,
      details: { reason: 'credentials_rejected' },
    });
    throw new UnauthorizedError(genericErrorMessage);
  }

  const nowMs = Date.now();
  const lockedUntilMs = user.locked_until ? Date.parse(user.locked_until) : 0;

  // Enforce 15-minute lock even if password is correct
  if (lockedUntilMs > nowMs) {
    await recordSecurityEvent(db, {
      eventType: 'LOGIN_ATTEMPT_DURING_LOCK',
      severity: 'medium',
      userId: user.id,
      ipAddress,
      endpoint,
      details: { locked: true },
    });
    throw new UnauthorizedError(genericErrorMessage);
  }

  // Reset counter once lock window has expired
  const activeAttempts = lockedUntilMs > 0 && lockedUntilMs <= nowMs ? 0 : user.failed_login_attempts;

  const passwordValid = await verifyPassword(password, user.password_hash, env.PASSWORD_PEPPER);

  if (!passwordValid) {
    const nextAttempts = activeAttempts + 1;
    const shouldLock = nextAttempts >= LOCK_THRESHOLD;
    const lockUntil = shouldLock ? new Date(nowMs + LOCK_DURATION_MS).toISOString() : null;

    await updateFailedLoginState(db, user.id, nextAttempts, lockUntil);
    await recordSecurityEvent(db, {
      eventType: shouldLock ? 'ACCOUNT_LOCKED_15M' : 'LOGIN_FAILED',
      severity: shouldLock ? 'high' : 'low',
      userId: user.id,
      ipAddress,
      endpoint,
      details: { failedAttempts: nextAttempts, locked: shouldLock },
    });

    throw new UnauthorizedError(genericErrorMessage);
  }

  if (user.account_status !== 'active' || (await hasActiveUserBan(db, user.id, 'login'))) {
    await recordSecurityEvent(db, {
      eventType: 'LOGIN_BLOCKED_ACCOUNT_STATUS',
      severity: 'medium',
      userId: user.id,
      ipAddress,
      endpoint,
      details: { blocked: true },
    });
    throw new UnauthorizedError(genericErrorMessage);
  }

  if (user.failed_login_attempts > 0 || user.locked_until !== null) {
    await clearFailedLoginState(db, user.id);
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    isPublisher: user.is_publisher === 1,
  };
}
