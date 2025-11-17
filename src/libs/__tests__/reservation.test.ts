import { fetcher } from '@/utils/fetcher';

import { createReservation } from '../reservation';

jest.mock('@/utils/fetcher');
const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('reservation', () => {
  const reservationData = {
    mentorId: 'mentor1',
    date: '2023-12-25',
    sessionId: '111',
    question: 'aa',
    timeSlot: { startTime: '09:00', endTime: '10:00' },
  };

  beforeEach(() => {
    mockFetcher.mockClear();
  });

  it('should create reservation', async () => {
    mockFetcher.mockResolvedValueOnce({ id: 'res1', ...reservationData });

    const result = await createReservation(reservationData);

    expect(mockFetcher).toHaveBeenCalledWith('reservation', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    expect(result).toMatchObject(reservationData);
  });
});
