'use client'
import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation';
import Button from '@/app/_component/Button';
import style from './mentors.module.scss'
import { useUserData } from '@/app/_lib/useUser';


interface IButtons {
  id: number;
}

export default function Buttons({id}: IButtons) {
  const router = useRouter();
  const { data } = useUserData();
  const onRouter = useCallback(() => {
    if (!data) {
      return router.push('/login');
    }
    router.push(`/mentors/${id}/apply`);
  }, [data, router, id]);
  return (
    <div className={style.button_wrap}>
      <Button type="button" width="4" bg="border2">
        + 팔로우
      </Button>
      <Button type="button" width="6" onClick={() => onRouter()}>
        멘토링 신청하기
      </Button>
    </div>
  );
}
