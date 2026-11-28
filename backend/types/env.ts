export interface Env {
  DB: D1Database;
  ENVIRONMENT?: string;
  APP_NAME?: string;
  TURNSTILE_SECRET_KEY?: string;
  PASSWORD_PEPPER?: string;
  ADMIN_BOOTSTRAP_SECRET?: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isPublisher: boolean;
  emailVerified: boolean;
  sessionId: string;
  permissions: string[];
}

export interface ApiRequestContext {
  request: Request;
  env: Env;
  requestId: string;
  params: Record<string, string>;
  url: URL;
  user?: AuthenticatedUser;
}

export type RouteHandler = (ctx: ApiRequestContext) => Promise<Response>;
