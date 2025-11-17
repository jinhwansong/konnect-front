'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useReservation } from '@/stores/useReservation';
import { useToastStore } from '@/stores/useToast';

export default function FailPage() {
  const searchParams = useSearchParams();
  const { sessionId } = useParams<{ sessionId: string }>();

  const router = useRouter();
  const { show } = useToastStore();
  const { reservation } = useReservation();
  const hasDraft = Boolean(reservation && reservation.timeSlot?.startTime);
  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    if (code === 'USER_CANCEL') {
      show('사용자가 결제를 취소했습니다.', 'error');
    } else {
      show(`결제 실패${message ? `: ${message}` : ''}`, 'error');
    }

    const next = hasDraft
      ? `/mentors/${sessionId}/confirm`
      : `/mentors/${sessionId}/reserve`;

    router.replace(next);
  }, [searchParams, router, sessionId, show, hasDraft]);

  return null;
}
