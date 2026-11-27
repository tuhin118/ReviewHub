export interface Env {
  DB: D1Database;
  ENVIRONMENT?: string;
  APP_NAME?: string;
}

export interface ApiRequestContext {
  request: Request;
  env: Env;
  requestId: string;
  params: Record<string, string>;
  url: URL;
}

export type RouteHandler = (ctx: ApiRequestContext) => Promise<Response>;
