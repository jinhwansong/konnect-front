import { format } from 'date-fns';

import { ScheduleReservationsItem } from '@/types/schedule';

export enum MentoringStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  PROGRESS = 'progress',
}

export const statusMap: Record<MentoringStatus, string> = {
  [MentoringStatus.PENDING]: '대기 중',
  [MentoringStatus.CONFIRMED]: '수락',
  [MentoringStatus.CANCELLED]: '취소',
  [MentoringStatus.COMPLETED]: '완료',
  [MentoringStatus.PROGRESS]: '진행 중',
};

export const colorMap: Record<MentoringStatus, string> = {
  [MentoringStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [MentoringStatus.CONFIRMED]: 'bg-green-100 text-green-700',
  [MentoringStatus.CANCELLED]: 'bg-gray-200 text-gray-500',
  [MentoringStatus.COMPLETED]: 'bg-blue-100 text-blue-700',
  [MentoringStatus.PROGRESS]: 'bg-indigo-100 text-indigo-700',
};

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export const scheduleColumns = [
  {
    header: '제목',
    accessor: (row: ScheduleReservationsItem) => (
      <span className="line-clamp-1 text-[var(--text-bold)]">{row.title}</span>
    ),
    className: 'w-[250px]',
  },
  {
    header: '멘토링 날짜',
    accessor: (row: ScheduleReservationsItem) =>
      format(new Date(row.date), 'yyyy.MM.dd'),
    className: 'w-[110px]',
  },
  {
    header: '시간',
    accessor: (row: ScheduleReservationsItem) =>
      `${row.startTime} ~ ${row.endTime}`,
    className: 'w-[150px]',
  },
  {
    header: '상태',
    accessor: (row: ScheduleReservationsItem) => (
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
          colorMap[row.status as MentoringStatus] ?? 'bg-gray-100 text-gray-600'
        }`}
      >
        {statusMap[row.status as MentoringStatus] ?? row.status}
      </span>
    ),
    className: 'w-[100px]',
  },
  {
    header: '멘티 이름',
    accessor: (row: ScheduleReservationsItem) => (
      <span className="line-clamp-1">{row.menteeName}</span>
    ),
    className: 'w-[120px]',
  },
  {
    header: '신청일',
    accessor: (row: ScheduleReservationsItem) =>
      format(new Date(row.createdAt), 'yy.MM.dd'),
    className: 'w-[90px]',
  },
];

export const WEEK_OPTIONS = [
  { label: '월요일', value: DayOfWeek.MONDAY },
  { label: '화요일', value: DayOfWeek.TUESDAY },
  { label: '수요일', value: DayOfWeek.WEDNESDAY },
  { label: '목요일', value: DayOfWeek.THURSDAY },
  { label: '금요일', value: DayOfWeek.FRIDAY },
  { label: '토요일', value: DayOfWeek.SATURDAY },
  { label: '일요일', value: DayOfWeek.SUNDAY },
];

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return {
    label: `${hours}:${minutes}`,
    value: `${hours}:${minutes}`,
  };
});
