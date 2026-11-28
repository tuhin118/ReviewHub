import type { D1Client } from '../client';

export interface DbAuthUserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  is_publisher: number;
  email_verified: number;
  account_status: 'active' | 'disabled';
  failed_login_attempts: number;
  locked_until: string | null;
}

export interface DbSessionUserRow {
  session_id: string;
  user_id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_publisher: number;
  email_verified: number;
  account_status: 'active' | 'disabled';
}

export async function findUserForLogin(
  db: D1Client,
  email: string,
): Promise<DbAuthUserRow | null> {
  return db.queryFirst<DbAuthUserRow>(
    `SELECT id, name, username, email, password_hash, role, is_publisher,
            email_verified, account_status, failed_login_attempts, locked_until
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email],
  );
}

export async function updateFailedLoginState(
  db: D1Client,
  userId: string,
  nextAttempts: number,
  lockedUntilIso: string | null,
): Promise<void> {
  await db.execute(
    `UPDATE users
     SET failed_login_attempts = ?,
         locked_until = ?,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`,
    [nextAttempts, lockedUntilIso, userId],
  );
}

export async function clearFailedLoginState(db: D1Client, userId: string): Promise<void> {
  await db.execute(
    `UPDATE users
     SET failed_login_attempts = 0,
         locked_until = NULL,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`,
    [userId],
  );
}

export async function insertSession(
  db: D1Client,
  input: {
    id: string;
    userId: string;
    tokenHash: string;
    ipAddress: string | null;
    userAgentSummary: string | null;
    expiresAt: string;
  },
): Promise<void> {
  await db.execute(
    `INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent_summary, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.id,
      input.userId,
      input.tokenHash,
      input.ipAddress,
      input.userAgentSummary,
      input.expiresAt,
    ],
  );
}

export async function findActiveSessionUser(
  db: D1Client,
  tokenHash: string,
): Promise<DbSessionUserRow | null> {
  return db.queryFirst<DbSessionUserRow>(
    `SELECT s.id AS session_id,
            u.id AS user_id,
            u.name,
            u.username,
            u.email,
            u.role,
            u.is_publisher,
            u.email_verified,
            u.account_status
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?
       AND s.revoked_at IS NULL
       AND s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     LIMIT 1`,
    [tokenHash],
  );
}

export async function revokeSessionById(
  db: D1Client,
  sessionId: string,
  reason: string,
): Promise<void> {
  await db.execute(
    `UPDATE sessions
     SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
         revoke_reason = ?
     WHERE id = ? AND revoked_at IS NULL`,
    [reason, sessionId],
  );
}

export async function revokeAllSessionsForUser(
  db: D1Client,
  userId: string,
  reason: string,
): Promise<void> {
  await db.execute(
    `UPDATE sessions
     SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
         revoke_reason = ?
     WHERE user_id = ? AND revoked_at IS NULL`,
    [reason, userId],
  );
}

export async function insertUserAccount(
  db: D1Client,
  input: {
    id: string;
    name: string;
    username: string;
    email: string;
    passwordHash: string;
  },
): Promise<void> {
  await db.execute(
    `INSERT INTO users (id, name, username, email, password_hash, role, is_publisher, email_verified, account_status)
     VALUES (?, ?, ?, ?, ?, 'user', 0, 0, 'active')`,
    [input.id, input.name, input.username, input.email, input.passwordHash],
  );
}

export async function insertEmailVerificationToken(
  db: D1Client,
  input: {
    id: string;
    userId: string;
    email: string;
    tokenHash: string;
    expiresAt: string;
  },
): Promise<void> {
  await db.execute(
    `INSERT INTO email_verifications (id, user_id, email, token_hash, purpose, expires_at)
     VALUES (?, ?, ?, ?, 'register', ?)`,
    [input.id, input.userId, input.email, input.tokenHash, input.expiresAt],
  );
}
