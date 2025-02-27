'use client'
import React, { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/app/_component/Button';
import { useToastStore } from '@/store/useToastStore';
import { IErr } from '@/type';
import { useDeleteProgram } from '@/app/_lib/useMentor';

interface IButtonRouter {
  children: string;
  bg?: string;
  link:string;
}

export default function ButtonRouter({ children, bg, link }: IButtonRouter) {
  // 캐싱
  const queryClient = useQueryClient();
  // toast팝업
  const { showToast } = useToastStore((state) => state);
  const router = useRouter();
  const param = useParams();
  const deleteProgram = useDeleteProgram();
  const onPush = useCallback(() => {
    if (link === 'back') return router.back();
    if (link === 'delete') {
      deleteProgram.mutate(Number(param.id), {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['mentors'],
            exact: false,
          });
          router.back();
          showToast(data.message, 'success');
        },
        onError: (error: Error) => {
          const customError = error as IErr;
          showToast(customError.data, 'error');
        },
      });
    }
    if (link === 'modify') return router.push(`/mentor/program/${param.id}/modify`);
  }, [link, router, param, deleteProgram, queryClient, showToast]);
  return (
    <Button type="button" bg={bg} width="Small" onClick={onPush}>
      {children}
    </Button>
  );
}
