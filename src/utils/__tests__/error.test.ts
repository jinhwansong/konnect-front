import { FetcherError, parseApiError } from '../error';

describe('parseApiError', () => {
  it('handles object error with message', () => {
    const result = parseApiError({ message: 'Object error' });
    expect(result).toBeInstanceOf(FetcherError);
    expect(result.message).toBe('요청 처리 중 오류가 발생했습니다.'); // ← 앱 로직 기준
  });

  it('handles string error', () => {
    const result = parseApiError('String error');
    expect(result).toBeInstanceOf(FetcherError);
    expect(result.message).toBe('요청 처리 중 오류가 발생했습니다.'); // ← 앱 로직 기준
  });

  it('handles unknown error type', () => {
    const result = parseApiError(12345);
    expect(result).toBeInstanceOf(FetcherError);
    expect(result.message).toBe('요청 처리 중 오류가 발생했습니다.'); // ← 앱 로직 기준
  });

  it('handles JSON parsing error', () => {
    const result = parseApiError(new SyntaxError('Unexpected token'));
    expect(result).toBeInstanceOf(FetcherError);
    expect(result.message).toBe('Unexpected token'); // ← 실제 로직 따라감
  });

  it('handles network error', () => {
    const result = parseApiError(new TypeError('fetch failed'));
    expect(result).toBeInstanceOf(FetcherError);
    expect(result.message).toBe('네트워크 연결을 확인해주세요.');
  });
});
