import type { AppError, AppErrorCode } from '@/types';

export function createAppError(
  code: AppErrorCode,
  message: string,
  details?: Record<string, unknown>,
  fieldErrors?: Record<string, string>
): AppError {
  return {
    code,
    message,
    details,
    fieldErrors,
    timestamp: new Date().toISOString(),
  };
}

export function handleHttpError(status: number, statusText: string): AppError {
  if (status === 404) {
    return createAppError('NOT_FOUND', `Requested resource not found (HTTP 404)`);
  }
  if (status === 401) {
    return createAppError('UNAUTHORIZED', `Authentication required (HTTP 401)`);
  }
  if (status === 403) {
    return createAppError('FORBIDDEN', `Access forbidden (HTTP 403)`);
  }
  if (status >= 500) {
    return createAppError(
      'UNAVAILABLE',
      `External service unavailable (${statusText || status})`
    );
  }
  return createAppError('NETWORK_ERROR', `HTTP Request failed with status ${status}`);
}

export function handleNetworkError(error: unknown): AppError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return createAppError('NETWORK_ERROR', 'Request was cancelled');
  }
  if (error instanceof Error) {
    return createAppError('NETWORK_ERROR', error.message || 'Network request failed');
  }
  return createAppError('UNKNOWN', 'An unknown network error occurred');
}
