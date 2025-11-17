import { z } from 'zod';

import { TIME_HH_MM } from '@/utils/time';

export const reservationSchema = z.object({
  date: z.string().min(1, '날짜를 선택해 주세요'),
  timeSlot: z.object({
    startTime: z
      .string()
      .regex(TIME_HH_MM, '시작 시간 형식이 올바르지 않습니다. (HH:mm)'),
    endTime: z
      .string()
      .regex(TIME_HH_MM, '종료 시간 형식이 올바르지 않습니다. (HH:mm)'),
  }),
  question: z
    .string()
    .min(1, '멘토님에게 남길 메시지를 입력해주세요.')
    .max(500),
});

export type ReservationForm = z.infer<typeof reservationSchema>;
