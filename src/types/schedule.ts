import { DayOfWeek } from '@/contact/schedule';

export interface ScheduleReservationsItem {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  menteeName: string;
  menteeEmail: string;
  menteePhone: string;
  roomId: string;
}
export interface ScheduleReservationsResponse {
  data: ScheduleReservationsItem[];
  totalPages: number;
}

export interface ScheduleReservationsDetailResponse
  extends ScheduleReservationsItem {
  rejectReason: string;
  question: string;
}

export interface ScheduleItem {
  id?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface ScheduleRequest {
  data: ScheduleItem[];
}
export interface ScheduleResponse {
  data: ScheduleItem[];
  message: string;
}

export interface Reason {
  rejectReason: string;
}

export interface ScheduleStatusRequest extends Reason {
  id: string;
}
