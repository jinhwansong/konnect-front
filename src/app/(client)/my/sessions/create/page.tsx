'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import SessionForm from '@/components/my/SessionForm';
import { useCreateSession } from '@/hooks/query/useSession';
import { useToastStore } from '@/stores/useToast';
import { SessionRequest } from '@/types/session';

export default function SessionCreatePage() {
  const { show } = useToastStore();
  const router = useRouter();
  const { mutate: createSession } = useCreateSession();

  const handleSubmit = useCallback(
    async (data: SessionRequest) => {
      createSession(data, {
        onSuccess: () => {
          show('세션 등록을 완료했습니다.', 'success');
          router.push('/my/sessions');
        },
        onError: () => {
          show('세션 등록에 실패했습니다.', 'error');
        },
      });
    },
    [createSession, show, router]
  );

  return <SessionForm onSubmit={handleSubmit} title="세션 등록" />;
}
