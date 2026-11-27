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

    return jsonSuccess(
      {
        database: 'cloudflare-d1',
        connected,
        timestamp: new Date().toISOString(),
      },
      ctx.requestId,
    );
  });
}
