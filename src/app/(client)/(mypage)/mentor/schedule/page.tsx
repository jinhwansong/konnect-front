'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import Pagenation from '@/app/_component/Pagenation';
import usePage from '@/hooks/usePage';
import { getSchedule } from '@/app/_lib/useMentor';
import style from './schedule.module.scss'
import Table from '../_component/Table';
import { scheduleColumn } from '@/app/(client)/config/columns';

export default function SchedulePage() {
  const { onPrevPage, onNextPage, onPage, currentPage } = usePage();
  const { data } = useQuery({
    queryKey: ['schedule', currentPage],
    queryFn: () => getSchedule(currentPage),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  return (
    <section className={style.schedule_section}>
      <h4 className={style.schedule_title}>멘토링 관리</h4>
      <Table column={scheduleColumn} data={data} tap='7' />
      <Pagenation
        totalPage={data?.totalPage as number}
        currentPage={currentPage}
        onPage={onPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </section>
  );
}
