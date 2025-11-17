import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { withQueryDefaults } from '@/hooks/query/options';
import {
  getMenteeIncome,
  getMentorIncome,
  paymentRefunds,
} from '@/libs/payment';
import { PaymentMentee, PaymentMentor } from '@/types/payment';

export const useGetMentorPayment = (page: number) => {
  const { data: session } = useSession();
  return useQuery<PaymentMentor>(
    withQueryDefaults({
      queryKey: ['payment-mentor', page],
      queryFn: () => getMentorIncome(page),
      enabled: !!session?.user,
    })
  );
};

export const useGetMenteePayment = (page: number) => {
  const { data: session } = useSession();
  return useQuery<PaymentMentee>(
    withQueryDefaults({
      queryKey: ['payment-mentee', page],
      queryFn: () => getMenteeIncome(page),
      enabled: !!session?.user,
    })
  );
};

export const usePaymentRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentKey: string) => paymentRefunds(paymentKey),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['payment-mentee'],
      });
      queryClient.invalidateQueries({ queryKey: ['payment-mentor'] });
      queryClient.invalidateQueries({
        queryKey: ['schedule-reservations-detail'],
      });
      queryClient.invalidateQueries({ queryKey: ['schedule-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-my'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-done'] });
    },
  });
};
