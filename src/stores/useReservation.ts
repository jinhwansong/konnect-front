import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ReservationRequest } from '@/types/reservation';

export interface ReservationItem extends ReservationRequest {
  sessionId: string;
  mentorName: string;
  sessionTitle: string;
  duration: number;
  amount: number;
}

interface ReservationStore {
  reservation: ReservationItem;
  reset: () => void;
  set: (reservation: ReservationItem) => void;
  update: (
    date: string,
    timeSlot: { startTime: string; endTime: string },
    question: string,
    amount: number
  ) => void;
}

const defaultReservation: ReservationItem = {
  date: '',
  timeSlot: { startTime: '', endTime: '' },
  question: '',
  sessionId: '',
  mentorName: '',
  sessionTitle: '',
  duration: 0,
  amount: 0,
};

export const useReservation = create<ReservationStore>()(
  persist(
    (set, get) => ({
      reservation: defaultReservation,
      reset: () => set({ reservation: defaultReservation }),
      set: reservation => set({ reservation }),
      update: (date, timeSlot, question, amount) =>
        set({
          reservation: {
            ...get().reservation,
            date,
            timeSlot,
            question,
            amount,
          },
        }),
    }),
    {
      name: 'reservation-storage',
    }
  )
);
