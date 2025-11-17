import { FetcherError } from './error';

export const fetcher = async <T>(path: string, init: RequestInit = {}) => {
  const isServer = typeof window === 'undefined';

  const BASE_URL = isServer ? process.env.NEXT_PUBLIC_AUTH_URL : '/api/proxy';

  try {
    const res = await fetch(`${BASE_URL}/${path}`, {
      ...init,
      headers: {
        ...(init.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...(init.headers || {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        data.message || data.data || data.error || '요청 실패';
      const errorCode = data.code || data.errorCode;

      throw new FetcherError(errorMessage, res.status, path, errorCode);
    }

    return data as T;
  } catch (error) {
    if (error instanceof FetcherError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new FetcherError('네트워크 연결을 확인해주세요.', 0, path);
    }

    if (error instanceof SyntaxError) {
      throw new FetcherError('서버 응답을 처리할 수 없습니다.', 0, path);
    }

    throw new FetcherError(
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.',
      0,
      path
    );
  }
};
