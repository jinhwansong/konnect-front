'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { DayOfWeek, WEEK_OPTIONS } from '@/contact/schedule';
import { useDeleteSchedule, useGetSchedule } from '@/hooks/query/useSchedule';

import Modal from '../common/Modal';

export default function ScheduleRegular() {
  const { data, isLoading } = useGetSchedule();
  const { mutate: deleteSchedule } = useDeleteSchedule();
  const router = useRouter();
  if (isLoading) return null;
  const grouped = WEEK_OPTIONS.reduce(
    (acc, { value }) => {
      acc[value] =
        data?.data
          ?.filter(item => item.dayOfWeek === value)
          .map(item => ({
            start: item.startTime.slice(0, 5),
            end: item.endTime.slice(0, 5),
            id: item.id as string,
          })) ?? [];
      return acc;
    },
    {} as Record<DayOfWeek, { start: string; end: string; id: string }[]>
  );
  const handleDelete = (id: string) => {
    deleteSchedule(id);
  };
  return (
    <Modal onClose={() => router.back()}>
      <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
        정기스케줄
        <Link
          className="ml-4 text-sm font-light text-[var(--primary)]"
          href="/my/schedule/edit"
        >
          스케줄 추가
        </Link>
      </h4>
      <div>
        {WEEK_OPTIONS.map(({ label, value }) => (
          <div
            key={value}
            className="border-b border-[var(--border-color)] py-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text-bold)] lg:text-base">
                {label}
              </h3>
            </div>

            {grouped[value]?.length > 0 ? (
              <ul className="space-y-2">
                {grouped[value].map(({ start, end, id }) => (
                  <li
                    key={id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {start.slice(0, 5)} ~ {end.slice(0, 5)}
                    </span>
                    <button
                      className="text-xs hover:text-red-500"
                      onClick={() => handleDelete(id)}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">설정된 시간이 없습니다</p>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
