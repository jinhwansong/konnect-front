import { PaymentMentee, PaymentMentor } from '@/types/payment';
import { MessageResponse } from '@/types/user';
import { fetcher } from '@/utils/fetcher';

export const getMentorIncome = async (page: number): Promise<PaymentMentor> => {
  return fetcher<PaymentMentor>(`payment/mentor-income?page=${page}&limit=10`, {
    method: 'GET',
  });
};

export const getMenteeIncome = async (page: number): Promise<PaymentMentee> => {
  return fetcher<PaymentMentee>(`payment/mentee-income?page=${page}&limit=10`, {
    method: 'GET',
  });
};

export const paymentRefunds = async (
  paymentKey: string
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`payment/refund`, {
    method: 'POST',
    body: JSON.stringify({ paymentKey }),
  });
};
