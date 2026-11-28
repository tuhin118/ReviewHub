import type { D1Client } from '../client';

export interface AdminPermissionRow {
  code: string;
  module_key: string;
}

export async function getUserPermissionCodes(
  db: D1Client,
  userId: string,
): Promise<string[]> {
  const rows = await db.queryAll<AdminPermissionRow>(
    `SELECT DISTINCT p.code, p.module_key
     FROM user_admin_roles uar
     INNER JOIN admin_role_permissions arp ON arp.role_id = uar.role_id
     INNER JOIN admin_permissions p ON p.id = arp.permission_id
     WHERE uar.user_id = ?`,
    [userId],
  );
  return rows.map((row) => row.code);
}

export async function getPhase1FoundationCounts(db: D1Client): Promise<{
  users: number;
  categories: number;
  listings: number;
  reviews: number;
  openTickets: number;
  activeBans: number;
  permissionsSeeded: number;
}> {
  const [usersRow, catsRow, listingsRow, reviewsRow, ticketsRow, bansRow, permsRow] =
    await Promise.all([
      db.queryFirst<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM users'),
      db.queryFirst<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM categories'),
      db.queryFirst<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM listings'),
      db.queryFirst<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM reviews'),
      db.queryFirst<{ cnt: number }>(
        "SELECT COUNT(*) AS cnt FROM support_tickets WHERE status IN ('Open', 'InProgress')",
      ),
      db.queryFirst<{ cnt: number }>(
        'SELECT COUNT(*) AS cnt FROM user_bans WHERE revoked_at IS NULL',
      ),
      db.queryFirst<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM admin_permissions'),
    ]);

  return {
    users: usersRow?.cnt ?? 0,
    categories: catsRow?.cnt ?? 0,
    listings: listingsRow?.cnt ?? 0,
    reviews: reviewsRow?.cnt ?? 0,
    openTickets: ticketsRow?.cnt ?? 0,
    activeBans: bansRow?.cnt ?? 0,
    permissionsSeeded: permsRow?.cnt ?? 0,
  };
}
