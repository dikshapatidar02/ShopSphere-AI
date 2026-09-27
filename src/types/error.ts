export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'UNAVAILABLE'
  | 'PAYMENT_FAILURE'
  | 'PARSING_ERROR'
  | 'UNKNOWN';

export interface AppError {
  readonly code: AppErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly fieldErrors?: Record<string, string>;
  readonly timestamp: string;
}
