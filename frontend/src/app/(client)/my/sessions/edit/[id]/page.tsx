'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToastStore } from '@/stores/useToast';
import { SessionRequest } from '@/types/session';
import SessionForm from '@/components/my/SessionForm';
import { useGetSessionDetail, usePatchSession } from '@/hooks/query/useSession';

export default function EditSessionPage() {
  const { id } = useParams();
  const { showToast } = useToastStore();
  const router = useRouter();
  const { data: session, isLoading } = useGetSessionDetail(id as string);
  const { mutate: patchSession } = usePatchSession();

  const onSubmit = async (data: SessionRequest) => {
    try {
      await patchSession({
        id: session?.id as string,
        data,
      });
      showToast('세션수정을 완료했습니다.', 'success');
      router.push(`/my/sessions/${id}`);
    } catch {
      showToast('세션수정에 실패했습니다.', 'error');
    }
  };
  if (isLoading) return null;
  return (
    <SessionForm
      defaultValues={session}
      onSubmit={onSubmit}
      title="세션 수정"
    />
  );
}
