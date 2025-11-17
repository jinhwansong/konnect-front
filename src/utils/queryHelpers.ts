import { FetcherError } from './error';

export function createQueryWithErrorHandling<T>(
  queryFn: () => Promise<T>,
  handleError: (error: unknown, fallbackMessage?: string) => void,
  errorMessage?: string
) {
  return async () => {
    try {
      return await queryFn();
    } catch (error) {
      handleError(error, errorMessage);
      throw error;
    }
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof FetcherError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof FetcherError && error.status === 0;
}

export function isServerError(error: unknown): boolean {
  return error instanceof FetcherError && error.status >= 500;
}

export function isClientError(error: unknown): boolean {
  return (
    error instanceof FetcherError && error.status >= 400 && error.status < 500
  );
}
