import { createDbClient } from '../db/client';
import { getPhase1FoundationCounts } from '../db/queries/admin.queries';
import {
  claimBootstrapSlot,
  createBootstrappedSuperAdminAtomically,
  releaseBootstrapSlot,
} from '../db/queries/auth.queries';
import { recordAuditLog, recordSecurityEvent } from '../db/queries/security.queries';
import { constantTimeStringDigestEqual, hashPassword } from '../lib/crypto';
import {
  ForbiddenError,
  ServiceUnavailableError,
  ValidationError,
} from '../lib/errors';
import { jsonSuccess } from '../lib/response';
import type { ApiRouter } from '../lib/router';
import {
  normalizeEmail,
  parseJsonBody,
  validatePasswordInput,
} from '../lib/validation';
import {
  assertSameOriginMutation,
  getClientIp,
  requireAdminPermission,
} from '../middleware/auth';

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

interface BootstrapPayload {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  bootstrapSecret?: unknown;
}

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

  router.post('/api/v1/admin/bootstrap', async (ctx) => {
    assertSameOriginMutation(ctx.request, ctx.url);

    if (!ctx.env.ADMIN_BOOTSTRAP_SECRET || ctx.env.ADMIN_BOOTSTRAP_SECRET.length < 24) {
      throw new ServiceUnavailableError('Admin bootstrap is not enabled');
    }

    const db = createDbClient(ctx.env.DB);
    const ip = getClientIp(ctx.request);
    const body = await parseJsonBody<BootstrapPayload>(ctx.request);

    const headerSecret = ctx.request.headers.get('X-Bootstrap-Secret');
    const providedSecret =
      typeof headerSecret === 'string' && headerSecret.length > 0
        ? headerSecret
        : typeof body.bootstrapSecret === 'string'
          ? body.bootstrapSecret
          : '';

    const secretMatches =
      providedSecret.length > 0 &&
      (await constantTimeStringDigestEqual(providedSecret, ctx.env.ADMIN_BOOTSTRAP_SECRET));

    if (!secretMatches) {
      await recordSecurityEvent(db, {
        eventType: 'ADMIN_BOOTSTRAP_DENIED',
        severity: 'high',
        ipAddress: ip,
        endpoint: ctx.url.pathname,
      });
      throw new ForbiddenError('Invalid bootstrap credentials');
    }

    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80) {
      throw new ValidationError('Valid admin name is required');
    }

    const name = body.name.trim();
    const email = normalizeEmail(body.email);
    const password = validatePasswordInput(body.password);

    // Atomically claim the single-use bootstrap slot before creating the admin
    const claimed = await claimBootstrapSlot(db);
    if (!claimed) {
      throw new ForbiddenError('Initial Super Admin bootstrap has already been completed');
    }

    const adminId = crypto.randomUUID();
    const username = `admin_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
    const passwordHash = await hashPassword(password, ctx.env.PASSWORD_PEPPER);

    try {
      await createBootstrappedSuperAdminAtomically(db, {
        userId: adminId,
        name,
        username,
        email,
        passwordHash,
      });
    } catch (error) {
      await releaseBootstrapSlot(db);
      throw error;
    }

    await recordAuditLog(db, {
      actorUserId: adminId,
      action: 'ADMIN_BOOTSTRAP_COMPLETED',
      targetType: 'system_bootstrap',
      targetId: adminId,
      ipAddress: ip,
      metadata: { role: 'role_super_admin' },
    });

    await recordSecurityEvent(db, {
      eventType: 'ADMIN_BOOTSTRAP_COMPLETED',
      severity: 'info',
      userId: adminId,
      ipAddress: ip,
      endpoint: ctx.url.pathname,
    });

    return jsonSuccess(
      {
        bootstrapped: true,
        adminId,
        assignedRole: 'super_admin',
        nextAction: 'Remove ADMIN_BOOTSTRAP_SECRET from Cloudflare environment secrets.',
      },
      ctx.requestId,
      201,
    );
  });
}
