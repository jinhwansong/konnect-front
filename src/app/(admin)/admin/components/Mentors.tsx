'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Table from './Table';
import { findMentorAll } from '../_lib/find.mentors';
import usePage from '@/hooks/usePage';
import { formatDate } from '@/util/formatDate';
import { getImageUrl } from '@/util/getImageUrl';
import { IAdminMentors, IColumn } from '@/type';
import style from './table.module.scss';

export default function Mentors() {
  const { currentPage, onPrevPage, onNextPage, onPage } = usePage();
  const { data } = useQuery({
    queryKey: ['mentors', currentPage],
    queryFn: () => findMentorAll(currentPage),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  const column: IColumn<IAdminMentors>[] = [
    { id: 1, name: '번호', render: (item: IAdminMentors) => item?.id },
    {
      id: 2,
      name: '멘토신청정보',
      render: (item: IAdminMentors) => (
        <div className={style.profile}>
          <Image
            src={getImageUrl(item?.image as string)}
            alt={item.name as string}
            height={35}
            width={35}
          />
          <div>
            <p>{item.name}</p>
            <span>{item.email}</span>
          </div>
        </div>
      ),
    },
    { id: 3, name: '직무', render: (item: IAdminMentors) => item?.job },
    { id: 4, name: '경력', render: (item: IAdminMentors) => item?.career },
    { id: 5, name: '상태', render: (item: IAdminMentors) => item?.status },
    {
      id: 6,
      name: '신청일',
      render: (item: IAdminMentors) => formatDate(item?.createdAt),
    },
  ];

  return (
    <Table
      title="멘토 신청 관리"
      column={column}
      data={data}
      currentPage={currentPage}
      onPrevPage={onPrevPage}
      onNextPage={onNextPage}
      onPage={onPage}
    />
  );
}
