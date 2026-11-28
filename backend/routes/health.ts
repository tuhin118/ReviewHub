import { createDbClient } from '../db/client';
import { jsonSuccess } from '../lib/response';
import type { ApiRouter } from '../lib/router';

export function registerHealthRoutes(router: ApiRouter): void {
  router.get('/api/v1/health', async (ctx) => {
    return jsonSuccess(
      {
        service: 'reviewhub-api',
        apiPrefix: '/api/v1',
        status: 'ok',
        environment: ctx.env.ENVIRONMENT ?? 'unknown',
        timestamp: new Date().toISOString(),
      },
      ctx.requestId,
    );
  });

  router.get('/api/v1/health/db', async (ctx) => {
    const db = createDbClient(ctx.env.DB);
    const connected = await db.healthCheck();

    let schemaReady = false;
    try {
      const bootstrapRow = await db.queryFirst<{ id: number }>(
        'SELECT id FROM system_bootstrap WHERE id = 1 LIMIT 1',
      );
      schemaReady = bootstrapRow !== null;
    } catch {
      schemaReady = false;
    }

    return jsonSuccess(
      {
        database: 'cloudflare-d1',
        connected,
        schemaReady,
        timestamp: new Date().toISOString(),
      },
      ctx.requestId,
    );
  });
}
