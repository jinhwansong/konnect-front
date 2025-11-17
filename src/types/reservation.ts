import { MentoringStatus } from '@/contact/schedule';

export type Slot = { startTime: string; endTime: string };

export interface ReservationTimeItem {
  startTime: string;
  endTime: string;
}

export interface ReservationTimeResponse {
  data: ReservationTimeItem[];
}

export interface ReservationDaysResponse {
  data: string[];
}

interface Reservation {
  date: string;
  question: string;
}

export interface ReservationRequest extends Reservation {
  timeSlot: Slot;
}
export interface ReservationRequests extends Reservation {
  sessionId: string;
}
export interface ReservationResponse {
  reservationId: string;
}

export interface PaymentRequest {
  paymentKey: string;
  orderId: string;
  price: number;
}

export interface PaymentResponse {
  message: string;
  receiptUrl: string;
}

export interface ReservationDone {
  reservationId: string;
  mentorName: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingUrl: string;
}

export interface ReservationMenteeItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: MentoringStatus.CONFIRMED | MentoringStatus.PROGRESS;
  sessionTitle: string;
  mentorName: string;
  roomId: string;
  duration: number;
  canEnter: 'waiting' | 'progress' | 'closed';
}
export interface PastReservationItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: MentoringStatus.COMPLETED;
  sessionTitle: string;
  mentorName: string;
  duration: number;
  reviewWritten: boolean;
}
export interface ReservationMenteeResponse<T> {
  data: T[];
  totalPage: number;
  message: string;
}
