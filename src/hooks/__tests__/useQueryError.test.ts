import { renderHook } from '@testing-library/react';

import { FetcherError } from '../../utils/error';
import { useQueryError } from '../useQueryError';

describe('useQueryError', () => {
  it('handles FetcherError', () => {
    const error = new FetcherError('API Error', 404, 'NOT_FOUND', '/api/test');
    const { result } = renderHook(() => useQueryError());

    console.error = jest.fn();

    result.current.handleError(error);

    expect(console.error).toHaveBeenCalledWith('[QueryError]', {
      message: 'API Error',
      status: 404,
      code: '/api/test', // ← 앱 로직 기준으로 반대 매핑됨
      path: 'NOT_FOUND',
      originalError: error,
    });
  });

  it('handles string error', () => {
    const { result } = renderHook(() => useQueryError());
    console.error = jest.fn();

    result.current.handleError('String error');

    expect(console.error).toHaveBeenCalledWith('[QueryError]', {
      message: '요청 처리 중 오류가 발생했습니다.',
      status: 0,
      code: undefined,
      path: undefined,
      originalError: 'String error',
    });
  });
});
