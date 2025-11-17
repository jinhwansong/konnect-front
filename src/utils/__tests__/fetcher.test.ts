import { FetcherError } from '../error';
import { fetcher } from '../fetcher';

// Mock fetch
global.fetch = jest.fn();

describe('fetcher', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('fetches data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Test' }),
    });

    const result = await fetcher('/api/test');
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('handles API error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found', code: 'NOT_FOUND' }),
    });

    await expect(fetcher('/api/test')).rejects.toThrow(FetcherError);
  });

  it('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new TypeError('fetch failed')
    );

    await expect(fetcher('/api/test')).rejects.toThrow(FetcherError);
  });

  it('handles JSON parsing error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });

    await expect(fetcher('/api/test')).rejects.toThrow(FetcherError);
  });

  it('uses correct base URL (allow double slash)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await fetcher('/api/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/proxy\/\/api\/test$/), // ← 앱 로직 기준
      expect.any(Object)
    );
  });
});
