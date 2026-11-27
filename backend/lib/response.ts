export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  requestId: string;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
  };
  requestId: string;
}

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function createSecurityHeaders(requestId: string): Headers {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Request-Id', requestId);
  return headers;
}

export function jsonSuccess<T>(data: T, requestId: string, status = 200): Response {
  const body: ApiSuccessBody<T> = {
    success: true,
    data,
    requestId,
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: createSecurityHeaders(requestId),
  });
}

export function jsonError(
  code: string,
  message: string,
  requestId: string,
  status = 400,
): Response {
  const body: ApiErrorBody = {
    success: false,
    error: {
      code,
      message,
    },
    requestId,
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: createSecurityHeaders(requestId),
  });
}
