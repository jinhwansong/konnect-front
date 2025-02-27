'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Table from './Table'
import { findUserAll } from '../_lib/find.user';
import usePage from '@/hooks/usePage';
import { formatDate } from '@/util/formatDate';
import { getImageUrl } from '@/util/getImageUrl';
import { IAdminUsers, IColumn } from '@/type';
import style from './table.module.scss';


export default function Users() {
    const { currentPage, onPrevPage, onNextPage, onPage } = usePage();
    const { data } = useQuery({
      queryKey: ['users', currentPage],
      queryFn: () => findUserAll(currentPage),
      staleTime: 60 * 1000,
      gcTime: 300 * 1000,
    });
    const column: IColumn<IAdminUsers>[] = [
      { id: 1, name: '번호', render: (item: IAdminUsers) => item.id },
      {
        id: 2,
        name: '프로필',
        render: (item: IAdminUsers) => (
          <div className={style.profile}>
            <Image
              src={getImageUrl(item?.image as string)}
              alt={item.name as string}
              height={35}
              width={35}
            />
            <div>
              <p>{item.name}</p>
              <span>{item.email || item.snsId}</span>
            </div>
          </div>
        ),
      },
      { id: 3, name: '닉네임', render: (item: IAdminUsers) => item.nickname },
      { id: 4, name: '전화번호', render: (item: IAdminUsers) => item.phone },
      { id: 5, name: '사용자 권한', render: (item: IAdminUsers) => item.role },
      {
        id: 6,
        name: '가입일',
        render: (item: IAdminUsers) => formatDate(item.createdAt),
      },
    ];
  return (
    <Table
      title="사용자관리"
      column={column}
      data={data}
      currentPage={currentPage}
      onPrevPage={onPrevPage}
      onNextPage={onNextPage}
      onPage={onPage}
    />
  );
}
