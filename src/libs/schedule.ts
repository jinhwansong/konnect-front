import {
  ScheduleRequest,
  ScheduleReservationsDetailResponse,
  ScheduleReservationsResponse,
  ScheduleResponse,
  ScheduleStatusRequest,
} from '@/types/schedule';
import { MessageResponse } from '@/types/user';
import { fetcher } from '@/utils/fetcher';

export const fetchScheduleReservations = async (
  page: number
): Promise<ScheduleReservationsResponse> => {
  return fetcher<ScheduleReservationsResponse>(
    `schedule/reservations/?page=${page}&limit=10`,
    {
      method: 'GET',
    }
  );
};
export const fetchScheduleReservationDetail = async (
  id: string
): Promise<ScheduleReservationsDetailResponse> => {
  return fetcher<ScheduleReservationsDetailResponse>(
    `schedule/reservations/${id}`,
    {
      method: 'GET',
    }
  );
};

export const updateScheduleStatus = async (
  data: ScheduleStatusRequest
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`schedule/reservations/${data.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ rejectReason: data.rejectReason }),
  });
};

export const removeSchedule = async (id: string): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`schedule/${id}`, {
    method: 'DELETE',
  });
};

export const updateSchedule = async (
  data: ScheduleRequest
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`schedule`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const createSchedule = async (
  data: ScheduleRequest
): Promise<MessageResponse> => {
  return fetcher<MessageResponse>(`schedule`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const fetchSchedule = async (): Promise<ScheduleResponse> => {
  return fetcher<ScheduleResponse>(`schedule`, {
    method: 'GET',
  });
};
