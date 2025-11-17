'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { createPayment } from '@/libs/reservation';
import { useReservation } from '@/stores/useReservation';
import { useToastStore } from '@/stores/useToast';

export default function SuccessPage() {
  const { show } = useToastStore();
  const { sessionId } = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { reset } = useReservation();
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');
    if (!orderId || !paymentKey || !amount) {
      show('결제 정보가 유효하지 않습니다.', 'error');
      router.replace(`/mentors/${sessionId}/confirm`);
      return;
    }
    const data = {
      orderId: orderId as string,
      paymentKey: paymentKey as string,
      price: Number(amount),
    };
    try {
      createPayment(data);
      show('결제가 완료되었어요. 예약이 확정되었습니다.', 'success');
      reset();
      router.replace(`/mentors/done/${orderId}`);
    } catch {
      show('예약 확정에 실패했습니다.', 'error');
      router.replace(`/mentors/${sessionId}/confirm`);
    }
  }, [router, searchParams, sessionId, show, reset]);
  return null;
}
