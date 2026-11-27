export type UserRole = 'guest' | 'user' | 'publisher' | 'admin';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  requestId: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface HealthCheckData {
  service: string;
  apiPrefix: string;
  status: string;
  environment: string;
  timestamp: string;
}

export interface DbHealthData {
  database: string;
  connected: boolean;
  timestamp: string;
}
