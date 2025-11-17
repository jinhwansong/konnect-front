'use client';
import { format } from 'date-fns';
import React, { useState } from 'react';

import FlexibleTable from '@/components/common/FlexibleTable';
import Pagination from '@/components/common/Pagination';
import { useGetMentorPayment } from '@/hooks/query/usePayment';
import { PaymentMentorItem } from '@/types/payment';
import { formatToKoreanWon } from '@/utils/formatPrice';

export default function EarningPage() {
  const [page, setPage] = useState(1);
  const { data: payment, isLoading } = useGetMentorPayment(page);
  if (isLoading) return null;
  const earningsColumns = [
    {
      header: '멘토링 제목',
      accessor: (row: PaymentMentorItem) => (
        <span className="line-clamp-1 text-[var(--text-bold)]">
          {row.programTitle}
        </span>
      ),
      className: 'w-auto',
    },
    {
      header: '멘티',
      accessor: (row: PaymentMentorItem) => (
        <span className="line-clamp-1">{row.menteeName}</span>
      ),
      className: 'w-[130px]',
    },
    {
      header: '결제일시',
      accessor: (row: PaymentMentorItem) =>
        format(new Date(row.createdAt), 'yyyy.MM.dd HH:mm'),
      className: 'w-[160px]',
    },
    {
      header: '결제 금액',
      accessor: (row: PaymentMentorItem) => (
        <span className="font-semibold text-[var(--text-bold)]">
          ₩ {Number(row.price).toLocaleString('ko-KR')}
        </span>
      ),
      className: 'w-[120px]  pr-4',
    },
  ];

  return (
    <section className="flex-1 bg-[var(--editor-bg)]">
      <h4 className="mb-6 text-2xl font-bold text-[var(--text-bold)]">
        내 수익
      </h4>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border-color)] p-5">
          <p className="mb-1 text-xs text-[var(--text-sub)]">이번 달 수익</p>
          <p className="text-2xl font-semibold text-[var(--text-bold)]">
            {formatToKoreanWon(Number(payment?.monthlyIncome))}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-color)] p-5">
          <p className="mb-1 text-xs text-[var(--text-sub)]">누적 수익</p>
          <p className="text-2xl font-semibold text-[var(--text-bold)]">
            {formatToKoreanWon(Number(payment?.totalIncome))}
          </p>
        </div>
      </div>
      <FlexibleTable
        data={payment?.items as PaymentMentorItem[]}
        columns={earningsColumns}
      />
      <Pagination
        page={page}
        totalPages={payment?.totalPage || 1}
        onChange={newPage => setPage(newPage)}
      />
    </section>
  );
}
