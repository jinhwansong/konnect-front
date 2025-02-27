'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BiSearch } from 'react-icons/bi';
import Button from '@/app/_component/Button';
import Input from '@/app/_component/Input';
import Pagenation from '@/app/_component/Pagenation';
import { column } from '@/app/(client)/config/columns';
import { getProgram } from '@/app/_lib/useMentor';
import Table from '../_component/Table';
import usePage from '@/hooks/usePage';
import useInput from '@/hooks/useInput';
import style from './program.module.scss';

export default function ProgramPage() {
  const [search, changeSearch] = useInput('');
  const router = useRouter();
  
  const { onPrevPage, onNextPage, onPage, currentPage } = usePage();
  const { data } = useQuery({
    queryKey: ['mentors', currentPage],
    queryFn: () => getProgram(currentPage),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  return (
    <section className={style.management_section}>
      <h4 className={style.management_title}>멘토링 생성/관리</h4>
      <div className={style.management_mid}>
        <form className={style.management_search}>
          <Input
            type="text"
            value={search}
            onChange={changeSearch}
            placeholder="생성하신 멘토링 프로그램을 검색해보세요"
            name="search2"
            bg="search"
          />
          <label htmlFor="search2">
            <BiSearch />
          </label>
        </form>
        <Button
          type="button"
          width="Manage"
          onClick={() => router.push('/mentor/create_program')}
        >
          멘토링 등록
        </Button>
      </div>
      <Table column={column} data={data && data} />
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
