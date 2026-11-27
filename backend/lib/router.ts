import type { ApiRequestContext, Env, RouteHandler } from '../types/env';
import { MethodNotAllowedError, NotFoundError } from './errors';

interface RegisteredRoute {
  method: string;
  pattern: string;
  segments: string[];
  handler: RouteHandler;
}

export class ApiRouter {
  private readonly routes: RegisteredRoute[] = [];

  register(method: string, pattern: string, handler: RouteHandler): void {
    const normalized = pattern.replace(/\/+$/, '') || '/';
    const segments = normalized === '/' ? [] : normalized.slice(1).split('/');
    this.routes.push({
      method: method.toUpperCase(),
      pattern: normalized,
      segments,
      handler,
    });
  }

  get(pattern: string, handler: RouteHandler): void {
    this.register('GET', pattern, handler);
  }

  post(pattern: string, handler: RouteHandler): void {
    this.register('POST', pattern, handler);
  }

  patch(pattern: string, handler: RouteHandler): void {
    this.register('PATCH', pattern, handler);
  }

  delete(pattern: string, handler: RouteHandler): void {
    this.register('DELETE', pattern, handler);
  }

  async handle(request: Request, env: Env, requestId: string): Promise<Response> {
    const url = new URL(request.url);
    const normalizedPath = url.pathname.replace(/\/+$/, '') || '/';
    const pathSegments = normalizedPath === '/' ? [] : normalizedPath.slice(1).split('/');
    const method = request.method.toUpperCase();

    let pathMatched = false;

    for (const route of this.routes) {
      if (route.segments.length !== pathSegments.length) {
        continue;
      }

      const params: Record<string, string> = {};
      let isMatch = true;

      for (let i = 0; i < route.segments.length; i += 1) {
        const expected = route.segments[i];
        const actual = pathSegments[i];
        if (expected.startsWith(':')) {
          params[expected.slice(1)] = decodeURIComponent(actual);
        } else if (expected !== actual) {
          isMatch = false;
          break;
        }
      }

      if (!isMatch) continue;

      pathMatched = true;
      if (route.method === method) {
        const ctx: ApiRequestContext = {
          request,
          env,
          requestId,
          params,
          url,
        };
        return route.handler(ctx);
      }
    }

    if (pathMatched) {
      throw new MethodNotAllowedError(method);
    }

    throw new NotFoundError(`Endpoint ${normalizedPath} does not exist`);
  }
}
