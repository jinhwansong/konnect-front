import { PaymentMentor, PaymentMentee } from '@/types/payment';
import { MessageResponse } from '@/types/user';
import { fetcher } from '@/utils/fetcher';

import { getMenteeIncome, getMentorIncome, paymentRefunds } from '../payment';

// fetcher mock
jest.mock('@/utils/fetcher');
const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('payment-income APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMentorIncome', () => {
    it('should fetch mentor income with correct query params', async () => {
      const mockResponse: PaymentMentor = {
        items: [],
        totalPage: 0,
        message: '',
        totalIncome: '0',
        monthlyIncome: '0',
      };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await getMentorIncome(1);

      expect(mockFetcher).toHaveBeenCalledWith(
        'payment/mentor-income?page=1&limit=10',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMenteeIncome', () => {
    it('should fetch mentee income with correct query params', async () => {
      const mockResponse: PaymentMentee = {
        items: [],
        totalPage: 0,
        message: '',
      };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await getMenteeIncome(2);

      expect(mockFetcher).toHaveBeenCalledWith(
        'payment/mentee-income?page=2&limit=10',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('paymentRefunds', () => {
    it('should call refund API with correct payload', async () => {
      const mockResponse: MessageResponse = {
        message: '환불 성공',
      };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const paymentKey = 'test_payment_key';
      const result = await paymentRefunds(paymentKey);

      expect(mockFetcher).toHaveBeenCalledWith('payment/refund', {
        method: 'POST',
        body: JSON.stringify({ paymentKey }),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
