import React from 'react';

import { colorMap, MentoringStatus, statusMap } from '@/contact/schedule';
import {
  PastReservationItem,
  ReservationMenteeItem,
} from '@/types/reservation';
import { formatMinutesToKorean } from '@/utils/formatDuration';

import Button from '../common/Button';

interface ReservationCardProp<
  T extends ReservationMenteeItem | PastReservationItem,
> {
  item: T;
  type: 'upcoming' | 'past';
  onClick: (reservationId: string) => void;
}

export default function ReservationCard<
  T extends ReservationMenteeItem | PastReservationItem,
>({ item, type, onClick }: ReservationCardProp<T>) {
  return (
    <li className="mt-8 flex items-center gap-8 rounded border border-[var(--border-color)] p-5">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2 text-sm">
          <em
            className={`rounded px-2 py-1 text-xs font-medium ${colorMap[item?.status as MentoringStatus]}`}
          >
            {statusMap[item?.status as MentoringStatus]}
          </em>
          <p className="font-medium">예정일시</p>
          <span className="font-medium">
            {item.date} {item.startTime} ~ {item.endTime}
          </span>
        </div>
        <p className="line-clamp-2 text-sm font-medium text-[var(--text-subtle)]">
          {item.sessionTitle}
        </p>
      </div>

      <div className="flex w-28 flex-col justify-center text-xs font-medium">
        <p className="mb-2 flex justify-between">
          <span>멘토명</span> {item.mentorName}
        </p>
        <p className="flex justify-between">
          <span>1회 멘토링</span> {formatMinutesToKorean(item.duration)}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-1">
        {type === 'upcoming' && (
          <Button type="button" size="sm" onClick={() => onClick(item.id)}>
            미팅참여
          </Button>
        )}
        {type === 'past' && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onClick(item.id)}
            disabled={(item as PastReservationItem).reviewWritten}
          >
            후기작성
          </Button>
        )}
      </div>
    </li>
  );
}
