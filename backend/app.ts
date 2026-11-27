import { AppError } from './lib/errors';
import { createRequestId, jsonError } from './lib/response';
import { ApiRouter } from './lib/router';
import { registerHealthRoutes } from './routes/health';
import type { Env } from './types/env';

function buildRouter(): ApiRouter {
  const router = new ApiRouter();
  registerHealthRoutes(router);
  return router;
}

const apiRouter = buildRouter();

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const requestId = createRequestId();

  try {
    return await apiRouter.handle(request, env, requestId);
  } catch (error) {
    if (error instanceof AppError) {
      return jsonError(error.code, error.message, requestId, error.status);
    }

    return jsonError(
      'INTERNAL_SERVER_ERROR',
      'An unexpected server error occurred',
      requestId,
      500,
    );
  }
}
