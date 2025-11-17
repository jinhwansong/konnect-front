'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import { FiCheck } from 'react-icons/fi';

import { useGetReservationDone } from '@/hooks/query/useReservation';

export default function ReservationDoneDetail({
  orderId,
}: {
  orderId: string;
}) {
  const { data, isLoading } = useGetReservationDone(orderId);
  if (isLoading) return null;
  return (
    <div className="mx-auto max-w-lg bg-[var(--background)] px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-sub01)] text-white">
          <FiCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text-bold)]">
          결제가 완료되었어요
        </h1>

        <p className="mt-2 text-sm text-[var(--text-sub)]">
          화상 멘토링 링크는{' '}
          <span className="font-medium">세션 시작 10분 전</span>에<br />
          <span className="font-medium text-[var(--text-bold)]">
            마이페이지 &gt; 예약 내역
          </span>
          에서 확인하실 수 있어요.
        </p>
      </motion.div>
      <div className="mt-10 space-y-6">
        <div>
          <p className="text-sm">예약번호</p>
          <p className="mt-1 font-medium">{data?.reservationId}</p>
        </div>
        <div>
          <p className="text-sm">멘토</p>
          <p className="mt-1 font-medium">{data?.mentorName}</p>
        </div>
        <div>
          <p className="text-sm">일정</p>
          <p className="mt-1 font-medium">
            {data?.date} ({data?.startTime} ~ {data?.endTime})
          </p>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3">
        <Link
          href="/my/reservations/upcoming"
          className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-[var(--primary-sub01)] hover:text-white"
        >
          내 예약 확인
        </Link>
        <Link
          href="/"
          className="w-full rounded-xl bg-[var(--primary-sub01)] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
