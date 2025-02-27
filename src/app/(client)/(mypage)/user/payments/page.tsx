'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Pagenation from '@/app/_component/Pagenation';
import usePage from '@/hooks/usePage';
import { formatDate } from '@/util/formatDate';
import { formatNumber } from '@/util/formatNumber';
import { useToastStore } from '@/store/useToastStore';
import { IErr } from '@/type';
import style from './payment.module.scss';
import { getPayment, useRefund } from '@/app/_lib/useUser';

interface IPayment {
  id: number;
  orderId: string;
  paidAt: string;
  paymentKey: string;
  price: number;
  status: string;
  title: string;
  receiptUrl: string;
}
interface IPaymentResponse {
  items: IPayment[];
  message: string;
  totalPage: number;
}
export default function Paymentspage() {
  // 캐싱
  const queryClient = useQueryClient();
  // toast팝업
  const { showToast } = useToastStore((state) => state);
  const { onPrevPage, onNextPage, onPage, currentPage } = usePage();
  const { data } = useQuery<IPaymentResponse>({
    queryKey: ['payment', currentPage],
    queryFn: () => getPayment(currentPage),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  const refund = useRefund();
  const onRefund = useCallback(
    (paymentKey: string) => {
      refund.mutate(paymentKey, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['payment', currentPage],
          });
          showToast(data.message, 'success');
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      });
    },
    [refund, showToast, queryClient, currentPage]
  );
  return (
    <section className={style.payment_section}>
      <h4 className={style.payment_title}>결제/환불 내역</h4>
      {data && data?.totalPage > 0 ? (
        <>
          <ul className={style.payment}>
            {data?.items?.map((item: IPayment) => (
              <li className={style.payment_list} key={item.id}>
                <em>
                  <span>주문날짜</span> {formatDate(item.paidAt)}
                </em>
                <div className={style.payment_bottom}>
                  <div className={style.payment_left}>
                    <em>
                      <span
                        className={
                          item.status === 'refunded' ? style.refunded : ''
                        }
                      >
                        {item.status === 'refunded' ? '결제취소' : '결제완료'}
                      </span>{' '}
                      <p>
                        주문번호 <strong>{item.orderId.split('_')[1]}</strong>
                      </p>
                    </em>
                    <p>{item.title}</p>
                  </div>
                  <div className={style.payment_mid}>
                    <p>금액</p>
                    <span>₩{formatNumber(item.price)}</span>
                  </div>
                  <div className={style.payment_right}>
                    <Link href={item.receiptUrl} target="_blank">
                      영수증
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRefund(item.paymentKey)}
                      disabled={item.status === 'refunded'}
                    >
                      환불{item.status === 'refunded' ? '완료' : '하기'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagenation
            totalPage={data?.totalPage as number}
            currentPage={currentPage}
            onPage={onPage}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        </>
      ) : (
        <div>결제하신 멘토링이 없습니다.</div>
      )}
    </section>
  );
}
