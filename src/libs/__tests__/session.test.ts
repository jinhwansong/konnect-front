import { fetcher } from '@/utils/fetcher';

import {
  fetchSessions,
  fetchSessionDetail,
  createSession,
  updateSession,
  removeSession,
} from '../session';

jest.mock('@/utils/fetcher');
const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('session', () => {
  const mockSessions = [{ id: '1', title: 'Session 1' }];
  const mockSession = { id: '1', title: 'Session 1' };
  const sessionData = {
    title: 'New Session',
    description: 'Description',
    price: 1000,
    duration: 60,
    category: 'business',
  };

  beforeEach(() => {
    mockFetcher.mockClear();
  });

  it('fetchSessions uses default limit=10', async () => {
    mockFetcher.mockResolvedValueOnce(mockSessions);

    const result = await fetchSessions(2);
    expect(mockFetcher).toHaveBeenCalledWith('mentoring?page=2&limit=10', {
      method: 'GET',
    });
    expect(result).toEqual(mockSessions);
  });

  it('fetchSessionDetail', async () => {
    mockFetcher.mockResolvedValueOnce(mockSession);
    const result = await fetchSessionDetail('1');
    expect(mockFetcher).toHaveBeenCalledWith('mentoring/1', { method: 'GET' });
    expect(result).toEqual(mockSession);
  });

  it('createSession', async () => {
    mockFetcher.mockResolvedValueOnce(mockSession);
    const result = await createSession(sessionData);
    expect(mockFetcher).toHaveBeenCalledWith('mentoring', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
    expect(result).toEqual(mockSession);
  });

  it('updateSession', async () => {
    const updated = { ...sessionData, title: 'Updated' };
    mockFetcher.mockResolvedValueOnce(updated);
    const result = await updateSession('1', updated);
    expect(mockFetcher).toHaveBeenCalledWith('mentoring/1', {
      method: 'PATCH',
      body: JSON.stringify(updated),
    });
    expect(result).toEqual(updated);
  });

  it('removeSession', async () => {
    mockFetcher.mockResolvedValueOnce({ success: true });
    const result = await removeSession('1');
    expect(mockFetcher).toHaveBeenCalledWith('mentoring/1', {
      method: 'DELETE',
    });
    expect(result).toEqual({ success: true });
  });
});
