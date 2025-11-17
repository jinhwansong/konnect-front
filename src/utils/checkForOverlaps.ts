import { DayOfWeek, WEEK_OPTIONS } from '@/contact/schedule';
import { ScheduleRequest } from '@/types/schedule';

export const findScheduleOverlaps = (entries: ScheduleRequest['data']) => {
  const overlaps: string[] = [];

  const sorted = entries
    .map(entry => ({
      ...entry,
      start: parseTimeToMinutes(entry.startTime),
      end: parseTimeToMinutes(entry.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i];
      const b = sorted[j];

      // 같은 요일일 때만 체크
      if (a.dayOfWeek !== b.dayOfWeek) continue;

      // 겹침 판별
      const isOverlap = !(a.end <= b.start || a.start >= b.end);

      if (isOverlap) {
        overlaps.push(
          `${getDayLabel(a.dayOfWeek)} ${a.startTime}~${a.endTime}`
        );
        break;
      }
    }
  }

  return overlaps;
};

export function getDayLabel(dayValue: DayOfWeek): string {
  return WEEK_OPTIONS.find(opt => opt.value === dayValue)?.label ?? '';
}

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
