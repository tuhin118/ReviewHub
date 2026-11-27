import type { ApiResponse } from '../types/api';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;

  constructor(status: number, code: string, message: string, requestId?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

const API_BASE = '/api/v1';

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T; requestId: string }> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const headers = new Headers(init.headers);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${normalizedPath}`, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiClientError(
      0,
      'NETWORK_ERROR',
      'Unable to reach ReviewHub API. Please check your internet connection.',
    );
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError(
      response.status,
      'INVALID_RESPONSE',
      'Received an unexpected response from the server.',
    );
  }

  if (!response.ok || !payload.success) {
    const code = !payload.success ? payload.error.code : 'REQUEST_FAILED';
    const message = !payload.success
      ? payload.error.message
      : 'Request could not be completed.';
    throw new ApiClientError(response.status, code, message, payload.requestId);
  }

  return {
    data: payload.data,
    requestId: payload.requestId,
  };
}
