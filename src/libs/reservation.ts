import {
  PastReservationItem,
  PaymentRequest,
  PaymentResponse,
  ReservationDaysResponse,
  ReservationDone,
  ReservationMenteeItem,
  ReservationMenteeResponse,
  ReservationRequests,
  ReservationResponse,
  ReservationTimeResponse,
} from '@/types/reservation';
import { fetcher } from '@/utils/fetcher';

export const getAvailableDays = (id: string) => {
  return fetcher<ReservationDaysResponse>(`reservation/available-days/${id}`, {
    method: 'GET',
  });
};

export const getAvailableTimes = (id: string, date: string) => {
  return fetcher<ReservationTimeResponse>(
    `reservation/available-times/${id}?date=${date}`,
    {
      method: 'GET',
    }
  );
};

export const createReservation = (
  data: ReservationRequests
): Promise<ReservationResponse> => {
  return fetcher<ReservationResponse>('reservation', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const createPayment = (
  data: PaymentRequest
): Promise<PaymentResponse> => {
  return fetcher<PaymentResponse>('payment/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getReservationComplete = async (
  orderId: string
): Promise<ReservationDone> => {
  return fetcher<ReservationDone>(`reservation/done/${orderId}`, {
    method: 'GET',
  });
};

export const getMyReservations = async (
  page: number
): Promise<ReservationMenteeResponse<ReservationMenteeItem>> => {
  return fetcher<ReservationMenteeResponse<ReservationMenteeItem>>(
    `reservation/my?page=${page}&limit=10`,
    {
      method: 'GET',
    }
  );
};

export const getPastReservations = async (
  page: number
): Promise<ReservationMenteeResponse<PastReservationItem>> => {
  return fetcher<ReservationMenteeResponse<PastReservationItem>>(
    `reservation/past?page=${page}&limit=10`,
    {
      method: 'GET',
    }
  );
};
