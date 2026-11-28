import { safeRedactedJson } from '../../lib/redact';
import type { D1Client } from '../client';

export type SecuritySeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export async function recordSecurityEvent(
  db: D1Client,
  input: {
    eventType: string;
    severity?: SecuritySeverity;
    userId?: string | null;
    ipAddress?: string | null;
    endpoint?: string | null;
    details?: Record<string, unknown>;
  },
): Promise<void> {
  await db.execute(
    `INSERT INTO security_events (id, event_type, severity, user_id, ip_address, endpoint, details_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      input.eventType,
      input.severity ?? 'info',
      input.userId ?? null,
      input.ipAddress ?? null,
      input.endpoint ?? null,
      safeRedactedJson(input.details ?? {}),
    ],
  );
}

export async function recordAuditLog(
  db: D1Client,
  input: {
    actorUserId?: string | null;
    action: string;
    targetType: string;
    targetId?: string | null;
    metadata?: Record<string, unknown>;
    ipAddress?: string | null;
  },
): Promise<void> {
  await db.execute(
    `INSERT INTO audit_logs (id, actor_user_id, action, target_type, target_id, metadata_json, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      input.actorUserId ?? null,
      input.action,
      input.targetType,
      input.targetId ?? null,
      safeRedactedJson(input.metadata ?? {}),
      input.ipAddress ?? null,
    ],
  );
}

export async function isIpBlocked(db: D1Client, ipAddress: string): Promise<boolean> {
  const row = await db.queryFirst<{ id: string }>(
    `SELECT id
     FROM ip_bans
     WHERE ip_address = ?
       AND is_active = 1
       AND unblocked_at IS NULL
       AND (expires_at IS NULL OR expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     LIMIT 1`,
    [ipAddress],
  );
  return row !== null;
}

export async function hasActiveUserBan(
  db: D1Client,
  userId: string,
  banType: 'login' | 'posting',
): Promise<boolean> {
  const row = await db.queryFirst<{ id: string }>(
    `SELECT id
     FROM user_bans
     WHERE user_id = ?
       AND ban_type = ?
       AND revoked_at IS NULL
       AND (is_permanent = 1 OR (expires_at IS NOT NULL AND expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now')))
     LIMIT 1`,
    [userId, banType],
  );
  return row !== null;
}

export async function isAllowedEmailDomain(db: D1Client, email: string): Promise<boolean> {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  if (!domain) return false;
  const row = await db.queryFirst<{ id: number }>(
    `SELECT id FROM allowed_email_domains WHERE domain = ? AND is_active = 1 LIMIT 1`,
    [domain],
  );
  return row !== null;
}
