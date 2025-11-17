// Enhanced error types and parsing utilities

export interface ApiError {
  message: string;
  status: number;
  path?: string;
  code?: string;
}

export class FetcherError extends Error {
  public readonly status: number;
  public readonly path?: string;
  public readonly code?: string;

  constructor(message: string, status: number, path?: string, code?: string) {
    super(message);
    this.name = 'FetcherError';
    this.status = status;
    this.path = path;
    this.code = code;
  }
}

export function parseApiError(
  error: unknown,
  fallbackMessage = '요청 처리 중 오류가 발생했습니다.'
): FetcherError {
  // Network or fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new FetcherError('네트워크 연결을 확인해주세요.', 0);
  }

  // Our custom FetcherError
  if (error instanceof FetcherError) {
    return error;
  }

  // Standard Error with status
  if (error instanceof Error) {
    return new FetcherError(error.message || fallbackMessage, 0);
  }

  // Unknown error
  return new FetcherError(fallbackMessage, 0);
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}
