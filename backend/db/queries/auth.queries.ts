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

export interface DbEmailVerificationRow {
  id: string;
  user_id: string;
  email: string;
  purpose: 'register' | 'change_email';
  attempts: number;
  expires_at: string;
  verified_at: string | null;
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

/**
 * Atomically increments failed_login_attempts inside SQLite so concurrent
 * requests cannot bypass the 5-attempt, 15-minute lock threshold.
 */
export async function recordFailedLoginAttemptAtomic(
  db: D1Client,
  userId: string,
): Promise<{ failed_login_attempts: number; locked_until: string | null } | null> {
  return db.queryFirst<{ failed_login_attempts: number; locked_until: string | null }>(
    `UPDATE users
     SET failed_login_attempts = CASE
           WHEN locked_until IS NOT NULL AND locked_until <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now') THEN 1
           ELSE failed_login_attempts + 1
         END,
         locked_until = CASE
           WHEN (
             CASE
               WHEN locked_until IS NOT NULL AND locked_until <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now') THEN 1
               ELSE failed_login_attempts + 1
             END
           ) >= 5 THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+15 minutes')
           ELSE NULL
         END,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?
       AND (locked_until IS NULL OR locked_until <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     RETURNING failed_login_attempts, locked_until`,
    [userId],
  );
}

/**
 * Clears failed attempts ONLY if the account is currently active and not locked.
 * Prevents a racing valid login from succeeding right after a concurrent 5th failure locked the account.
 */
export async function clearFailedLoginIfUnlocked(
  db: D1Client,
  userId: string,
): Promise<boolean> {
  const row = await db.queryFirst<{ id: string }>(
    `UPDATE users
     SET failed_login_attempts = 0,
         locked_until = NULL,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?
       AND account_status = 'active'
       AND (locked_until IS NULL OR locked_until <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     RETURNING id`,
    [userId],
  );
  return row !== null;
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

export async function registerUserAtomically(
  db: D1Client,
  input: {
    userId: string;
    name: string;
    username: string;
    email: string;
    passwordHash: string;
    verificationId: string;
    verificationTokenHash: string;
    verificationExpiresAt: string;
  },
): Promise<void> {
  await db.batch([
    db.prepare(
      `INSERT INTO users (id, name, username, email, password_hash, role, is_publisher, email_verified, account_status)
       VALUES (?, ?, ?, ?, ?, 'user', 0, 0, 'active')`,
      [input.userId, input.name, input.username, input.email, input.passwordHash],
    ),
    db.prepare(
      `INSERT INTO user_profiles (user_id) VALUES (?)`,
      [input.userId],
    ),
    db.prepare(
      `INSERT INTO notification_preferences (user_id) VALUES (?)`,
      [input.userId],
    ),
    db.prepare(
      `INSERT INTO email_verifications (id, user_id, email, token_hash, purpose, expires_at)
       VALUES (?, ?, ?, ?, 'register', ?)`,
      [
        input.verificationId,
        input.userId,
        input.email,
        input.verificationTokenHash,
        input.verificationExpiresAt,
      ],
    ),
  ]);
}

export async function findEmailVerificationByHash(
  db: D1Client,
  tokenHash: string,
): Promise<DbEmailVerificationRow | null> {
  return db.queryFirst<DbEmailVerificationRow>(
    `SELECT id, user_id, email, purpose, attempts, expires_at, verified_at
     FROM email_verifications
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash],
  );
}

export async function completeEmailVerificationAtomically(
  db: D1Client,
  verificationId: string,
  userId: string,
): Promise<boolean> {
  const results = await db.batch([
    db.prepare(
      `UPDATE email_verifications
       SET verified_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?
         AND verified_at IS NULL
         AND expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
      [verificationId],
    ),
    db.prepare(
      `UPDATE users
       SET email_verified = 1,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`,
      [userId],
    ),
  ]);

  return (results[0]?.meta?.changes ?? 0) === 1;
}

export async function claimBootstrapSlot(db: D1Client): Promise<boolean> {
  const row = await db.queryFirst<{ id: number }>(
    `UPDATE system_bootstrap
     SET is_completed = 1,
         completed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = 1 AND is_completed = 0
     RETURNING id`,
  );
  return row !== null;
}

export async function releaseBootstrapSlot(db: D1Client): Promise<void> {
  await db.execute(
    `UPDATE system_bootstrap
     SET is_completed = 0,
         bootstrapped_user_id = NULL,
         completed_at = NULL
     WHERE id = 1 AND bootstrapped_user_id IS NULL`,
  );
}

export async function createBootstrappedSuperAdminAtomically(
  db: D1Client,
  input: {
    userId: string;
    name: string;
    username: string;
    email: string;
    passwordHash: string;
  },
): Promise<void> {
  await db.batch([
    db.prepare(
      `INSERT INTO users (id, name, username, email, password_hash, role, is_publisher, email_verified, account_status)
       VALUES (?, ?, ?, ?, ?, 'admin', 0, 1, 'active')`,
      [input.userId, input.name, input.username, input.email, input.passwordHash],
    ),
    db.prepare(`INSERT INTO user_profiles (user_id) VALUES (?)`, [input.userId]),
    db.prepare(`INSERT INTO notification_preferences (user_id) VALUES (?)`, [input.userId]),
    db.prepare(
      `INSERT INTO user_admin_roles (user_id, role_id, assigned_by_admin_id)
       VALUES (?, 'role_super_admin', ?)`,
      [input.userId, input.userId],
    ),
    db.prepare(
      `UPDATE system_bootstrap SET bootstrapped_user_id = ? WHERE id = 1`,
      [input.userId],
    ),
  ]);
}
