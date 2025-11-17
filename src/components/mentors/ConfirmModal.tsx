'use client';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { usePostReservation } from '@/hooks/query/useReservation';
import { useReservation } from '@/stores/useReservation';
import { useToastStore } from '@/stores/useToast';
import { formatMinutesToKorean } from '@/utils/formatDuration';
import { formatToKoreanWon } from '@/utils/formatPrice';

import Button from '../common/Button';
import Modal from '../common/Modal';

export default function ConfirmModal({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { show } = useToastStore();
  const { data: session } = useSession();
  const { reservation, reset } = useReservation();
  const info = [
    { name: '멘토 이름', value: reservation.mentorName },
    { name: '멘토링 제목', value: reservation.sessionTitle },
    { name: '멘토링 가격', value: formatToKoreanWon(reservation.amount) },
    { name: '멘토링 일자', value: reservation.date },
    {
      name: '멘토링 시간',
      value: `${reservation.timeSlot.startTime} ~ ${reservation.timeSlot.endTime}`,
    },
    { name: '멘토링 소요', value: formatMinutesToKorean(reservation.duration) },
    { name: '멘토에게 전달할 말', value: reservation.question },
  ];
  const { mutateAsync: postReservation } = usePostReservation();

  const handleReservation = async () => {
    try {
      const data = {
        date: reservation.date,
        startTime: reservation.timeSlot.startTime,
        endTime: reservation.timeSlot.endTime,
        question: reservation.question,
        sessionId,
      };
      const res = await postReservation(data);
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string
      );
      const payment = tossPayments.payment({
        customerKey: `USER_${session?.user.id}`,
      });
      await payment?.requestPayment({
        method: 'CARD',
        orderName: reservation.sessionTitle,
        customerName: session?.user.name,
        customerEmail: session?.user.email,
        amount: {
          value: reservation.amount,
          currency: 'KRW',
        },
        orderId: res.reservationId,
        successUrl: `${window.location.origin}/mentors/${sessionId}/confirm/success`,
        failUrl: `${window.location.origin}/mentors/${sessionId}/confirm/fail`,
      });
    } catch {
      reset();
      show('결제 준비 중 오류가 발생했습니다.', 'error');
    }
  };
  const handleClose = () => {
    router.replace(`/mentors/${sessionId}`);
    reset();
  };
  return (
    <Modal onClose={() => handleClose()}>
      <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
        예약 확인
      </h4>
      <div className="scroll-custom flex h-[510px] flex-col justify-between overflow-y-auto">
        <ul className="flex flex-col gap-5 bg-[var(--background)]">
          {info.map(item => (
            <li key={item.name}>
              <span className="mb-2 block text-sm">{item.name}</span>
              <p className="text-sm font-medium text-[var(--text-bold)]">
                {item.value}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex gap-2.5">
          <Button
            variant="outline"
            onClick={() => router.push(`/mentors/${sessionId}/reserve`)}
            type="button"
            className="flex-1"
          >
            이전으로
          </Button>
          <Button type="button" onClick={handleReservation} className="flex-1">
            결제하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
