import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { withQueryDefaults } from '@/hooks/query/options';
import {
  removeSchedule,
  fetchSchedule,
  fetchScheduleReservations,
  fetchScheduleReservationDetail,
  updateSchedule,
  updateScheduleStatus,
  createSchedule,
} from '@/libs/schedule';
import {
  ScheduleRequest,
  ScheduleReservationsDetailResponse,
  ScheduleReservationsResponse,
  ScheduleResponse,
} from '@/types/schedule';

export const useGetScheduleReservations = (page: number) => {
  const { data: session } = useSession();
  return useQuery<ScheduleReservationsResponse>(
    withQueryDefaults({
      queryKey: ['schedule-reservations', page],
      queryFn: () => fetchScheduleReservations(page),
      enabled: !!session?.user,
    })
  );
};

export const useGetScheduleReservationsDetail = (id: string) => {
  const { data: session } = useSession();
  return useQuery<ScheduleReservationsDetailResponse>(
    withQueryDefaults({
      queryKey: ['schedule-reservations-detail', id],
      queryFn: () => fetchScheduleReservationDetail(id),
      enabled: !!session?.user,
    })
  );
};

export const useScheduleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectReason }: { id: string; rejectReason: string }) =>
      updateScheduleStatus({ id, rejectReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['schedule-reservations-detail'],
      });
      queryClient.invalidateQueries({ queryKey: ['schedule-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-my'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-done'] });
      queryClient.invalidateQueries({
        queryKey: ['payment-mentee'],
      });
      queryClient.invalidateQueries({ queryKey: ['payment-mentor'] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
};

export const usePostSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScheduleRequest) => createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
};

export const usePatchSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScheduleRequest) => updateSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
};

export const useGetSchedule = () => {
  const { data: session } = useSession();
  return useQuery<ScheduleResponse>(
    withQueryDefaults({
      queryKey: ['schedule'],
      queryFn: () => fetchSchedule(),
      enabled: !!session?.user,
    })
  );
};
