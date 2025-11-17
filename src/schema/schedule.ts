import { z } from 'zod';

import { DayOfWeek } from '@/contact/schedule';
import { TIME_HH_MM } from '@/utils/time';

export const reasonSchema = z.object({
  rejectReason: z.string().min(1, '거절 사유는 필수입니다.').max(1000),
});

export type ReasonForm = z.infer<typeof reasonSchema>;

export const scheduleSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.string().optional(),
        dayOfWeek: z.nativeEnum(DayOfWeek),
        startTime: z
          .string()
          .regex(TIME_HH_MM, '올바른 시간 형식이 아닙니다. (HH:mm)'),
        endTime: z
          .string()
          .regex(TIME_HH_MM, '올바른 시간 형식이 아닙니다. (HH:mm)'),
      })
    )
    .min(1, '최소 1개 이상의 스케줄을 추가해야 합니다.')
    .refine(
      items =>
        items.every(
          item =>
            !item.startTime || !item.endTime || item.endTime > item.startTime
        ),
      {
        message: '종료 시간은 시작 시간보다 늦어야 합니다.',
        path: ['endTime'],
      }
    ),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
