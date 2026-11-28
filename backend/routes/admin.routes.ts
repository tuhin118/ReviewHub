import { createDbClient } from '../db/client';
import { getPhase1FoundationCounts } from '../db/queries/admin.queries';
import { jsonSuccess } from '../lib/response';
import type { ApiRouter } from '../lib/router';
import { requireAdminPermission } from '../middleware/auth';

const ADMIN_MODULES_READINESS = [
  { id: 1, key: 'dashboard', permission: 'module.dashboard', status: 'foundation_ready' },
  { id: 2, key: 'user_management', permission: 'module.users', status: 'schema_ready' },
  { id: 3, key: 'publisher_management', permission: 'module.publishers', status: 'schema_ready' },
  { id: 4, key: 'apps_management', permission: 'module.apps', status: 'schema_ready' },
  { id: 5, key: 'website_management', permission: 'module.websites', status: 'schema_ready' },
  { id: 6, key: 'reviews_management', permission: 'module.reviews', status: 'schema_ready' },
  { id: 7, key: 'ratings_management', permission: 'module.ratings', status: 'schema_ready' },
  { id: 8, key: 'approval_center', permission: 'module.approvals', status: 'schema_ready' },
  { id: 9, key: 'ban_management', permission: 'module.bans', status: 'schema_ready' },
  { id: 10, key: 'security_center', permission: 'module.security', status: 'foundation_ready' },
  { id: 11, key: 'reports_analytics', permission: 'module.analytics', status: 'schema_ready' },
  { id: 12, key: 'audit_logs', permission: 'module.audit_logs', status: 'foundation_ready' },
  { id: 13, key: 'admin_settings', permission: 'module.settings', status: 'schema_ready' },
  { id: 14, key: 'support_center', permission: 'module.support', status: 'schema_ready' },
  { id: 15, key: 'content_categories', permission: 'module.content', status: 'schema_ready' },
  { id: 16, key: 'notification_center', permission: 'module.notifications', status: 'schema_ready' },
  { id: 17, key: 'system_maintenance', permission: 'module.maintenance', status: 'schema_ready' },
  { id: 18, key: 'backup_recovery', permission: 'module.backups', status: 'schema_ready' },
  { id: 19, key: 'role_permission_management', permission: 'module.rbac', status: 'foundation_ready' },
  { id: 20, key: 'global_search', permission: 'module.search', status: 'schema_ready' },
  { id: 21, key: 'admin_profile', permission: 'module.admin_profile', status: 'schema_ready' },
  { id: 22, key: 'email_domain_management', permission: 'module.email_domains', status: 'foundation_ready' },
] as const;

export function registerAdminRoutes(router: ApiRouter): void {
  router.get('/api/v1/admin/foundation-status', async (ctx) => {
    const db = createDbClient(ctx.env.DB);
    const admin = await requireAdminPermission(ctx, db, 'module.dashboard');
    const counts = await getPhase1FoundationCounts(db);

    return jsonSuccess(
      {
        adminId: admin.id,
        counts,
        modules: ADMIN_MODULES_READINESS,
      },
      ctx.requestId,
    );
  });
}
