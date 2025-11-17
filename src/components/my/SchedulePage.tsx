'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import FlexibleTable from '@/components/common/FlexibleTable';
import Pagination from '@/components/common/Pagination';
import { scheduleColumns } from '@/contact/schedule';
import { useGetScheduleReservations } from '@/hooks/query/useSchedule';
import { ScheduleReservationsItem } from '@/types/schedule';

export default function SchedulePage() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data: schedule, isLoading } = useGetScheduleReservations(page);
  if (isLoading) return null;

  return (
    <section className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-2xl font-bold text-[var(--text-bold)]">
          내가 받은 멘토링 예약
        </h4>
        <div className="flex items-center gap-2.5">
          <Link
            href="/my/schedule/regular"
            className="block rounded-md bg-[var(--primary-sub01)] px-4 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--primary)]"
          >
            정기스케줄 추가/확인
          </Link>
        </div>
      </div>
      <FlexibleTable
        data={schedule?.data as ScheduleReservationsItem[]}
        columns={scheduleColumns}
        onRowClick={row => router.push(`/my/schedule/${row.id}`)}
      />
      <Pagination
        page={page}
        totalPages={schedule?.totalPages || 1}
        onChange={newPage => setPage(newPage)}
      />
    </section>
  );
}
