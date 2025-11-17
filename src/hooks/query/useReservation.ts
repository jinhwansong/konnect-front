import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { withQueryDefaults } from '@/hooks/query/options';
import {
  getMyReservations,
  getPastReservations,
  getAvailableDays,
  getReservationComplete,
  getAvailableTimes,
  createReservation,
} from '@/libs/reservation';
import {
  PastReservationItem,
  ReservationDaysResponse,
  ReservationDone,
  ReservationMenteeItem,
  ReservationMenteeResponse,
  ReservationRequests,
  ReservationTimeResponse,
} from '@/types/reservation';

export const useGetReservationsDays = (id: string) => {
  return useQuery<ReservationDaysResponse>(
    withQueryDefaults({
      queryKey: ['reservation-day', id],
      queryFn: () => getAvailableDays(id),
      enabled: !!id,
    })
  );
};

export const useGetReservationsTime = (id: string, date: string) => {
  return useQuery<ReservationTimeResponse>(
    withQueryDefaults({
      queryKey: ['reservation-time', id, date],
      queryFn: () => getAvailableTimes(id, date),
      enabled: !!id && !!date,
    })
  );
};

export const useGetReservationDone = (orderId: string) => {
  return useQuery<ReservationDone>(
    withQueryDefaults({
      queryKey: ['reservation-done', orderId],
      queryFn: () => getReservationComplete(orderId),
    })
  );
};
export const useGetMyReservations = <
  T extends ReservationMenteeItem | PastReservationItem,
>(
  type: 'upcoming' | 'past',
  page: number
) => {
  const { data: session } = useSession();
  return useQuery<ReservationMenteeResponse<T>>(
    withQueryDefaults({
      queryKey: ['reservation-my', page, type],
      queryFn: () =>
        type === 'upcoming'
          ? (getMyReservations(page) as Promise<ReservationMenteeResponse<T>>)
          : (getPastReservations(page) as Promise<
              ReservationMenteeResponse<T>
            >),
      enabled: !!session?.user,
    })
  );
};
export const usePostReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReservationRequests) => createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reservation-day'],
      });
      queryClient.invalidateQueries({ queryKey: ['reservation-time'] });
    },
  });
};
