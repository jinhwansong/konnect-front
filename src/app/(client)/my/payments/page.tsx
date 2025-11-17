'use client';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useState } from 'react';

import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import {
  useGetMenteePayment,
  usePaymentRefund,
} from '@/hooks/query/usePayment';
import { useToastStore } from '@/stores/useToast';
import { PaymentMenteeItem } from '@/types/payment';
import { formatToKoreanWon } from '@/utils/formatPrice';
export default function PaymentPage() {
  const { show } = useToastStore();
  const [page, setPage] = useState(1);
  const { data: payment, isLoading } = useGetMenteePayment(page);
  const { mutate: paymentRefund } = usePaymentRefund();
  if (isLoading) return null;
  const statusLabel = (s: string) =>
    s === 'refunded' ? '결제취소' : s === 'success' ? '결제완료' : s;
  const statusClass = (s: string) =>
    s === 'refunded'
      ? 'bg-gray-200 text-gray-500'
      : 'bg-green-100 text-green-700';
  const handleRefund = (paymentKey: string) => {
    paymentRefund(paymentKey, {
      onSuccess: data => {
        show(data.message, 'success');
      },
    });
  };
  return (
    <section className="flex-1">
      <h4 className="mb-6 text-2xl font-bold text-[var(--text-bold)]">
        결제내역
      </h4>
      {payment?.items && payment?.items?.length > 0 ? (
        <>
          <ul>
            {payment?.items?.map((item: PaymentMenteeItem) => (
              <li key={item.id} className="mt-8">
                <em className="mb-2.5 block text-sm font-bold">
                  <span className="font-medium">주문날짜</span>{' '}
                  {format(new Date(item.createdAt), 'yyyy.MM.dd HH:mm')}
                </em>
                <div className="grid w-full grid-cols-[minmax(0,4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 rounded-xl border border-[var(--border-color)] p-5 break-keep">
                  <div>
                    <em className="mb-2.5 flex items-center gap-2.5 text-sm">
                      <span
                        className={[
                          'rounded-sm px-2 py-[5px] text-[12px] font-medium',
                          statusClass(item.status),
                        ].join(' ')}
                      >
                        {statusLabel(item.status)}
                      </span>
                      <p className="font-medium">
                        주문번호 <strong>{item.orderId}</strong>
                      </p>
                    </em>
                    <p className="line-clamp-2 font-semibold text-[var(--text-bold)]">
                      {item.programTitle}
                    </p>
                  </div>
                  <div className="flex w-full justify-between text-sm font-medium">
                    <p>금액</p>
                    <span className="text-[var(--text-bold)]">
                      {formatToKoreanWon(item.price)}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link
                      href={item.receiptUrl}
                      target="_blank"
                      className="h-9 w-[80px] rounded-md border border-[var(--border-color)] bg-transparent px-4 text-center text-sm leading-9 font-medium transition-colors duration-200 hover:bg-[var(--primary-sub01)] hover:text-white"
                    >
                      영수증
                    </Link>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRefund(item.paymentKey)}
                      disabled={item.status === 'refunded'}
                    >
                      환불{item.status === 'refunded' ? '완료' : '하기'}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={payment?.totalPage || 1}
            onChange={newPage => setPage(newPage)}
          />
        </>
      ) : (
        <p className="py-10 text-center">결제내역이 없습니다.</p>
      )}
    </section>
  );
}
