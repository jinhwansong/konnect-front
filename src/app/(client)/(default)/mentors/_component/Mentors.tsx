'use client'
import React, { useCallback, useState } from 'react';
import Item from '@/app/(client)/_component/Item';
import { joblist } from '@/app/(client)/config/job';
import Pagenation from '@/app/_component/Pagenation';
import Selet from '@/app/_component/Selet';
import usePage from '@/hooks/usePage';
import useSelect from '@/hooks/useSelect';
import { usePopupStore } from '@/store/usePopupStore';
import { IMentoring } from '@/type';
import style from './mentors.module.scss'
import { fetchProgram } from '@/app/_lib/useEtc';

export default function Mentors({ items, totalPage }: IMentoring) {
  const { currentPage, onPrevPage, onNextPage, onPage } = usePage();
  const { onPopup2, popup2, onPopup3, popup3 } = usePopupStore();
  const list = ['전체', ...joblist];
  const sortlist:{[key:string]:string} = {
    '최신순':'latest' ,
    '인기순': 'popular'
  }
const reverseSortlist: { [key: string]: string } = {
  latest: '최신순',
  popular: '인기순',
};
  const [data, setData] = useState({ items, totalPage });
  const [job, onJob] = useSelect('', onPopup2, false);
  const [sort, onSort] = useSelect('', onPopup3);
  // 데이터 변경
  const handleDataChange = useCallback(
    async (params: { value: string; sort?: string }) => {
      const newDate = await fetchProgram({
        mentoring_field: params.value as string,
        page: currentPage,
        limit: 30,
        sort: params.sort || 'latest',
      });

      setData(newDate);
    },
    [currentPage]
  );
  // 정렬 변경
  const handleSortchange = async (value: string) => {
    const sortValue = sortlist[value];
    onSort(sortValue);
    await handleDataChange({ value: job, sort: sortValue });
  };
  // 직무 변경
  const handleMentoringchange = async (value: string) => {
    onJob(value);
    await handleDataChange({ value });
     
  };
  return (
    <>
      <div className={style.selet}>
        <Selet
          seletText={job}
          onSelet={onJob}
          list={list}
          open={popup2}
          onPopup={onPopup2}
          text="전체"
          width="530"
          changeData={handleMentoringchange}
        />
        <Selet
          seletText={reverseSortlist[sort] || '최신순'}
          onSelet={handleSortchange}
          list={Object.keys(sortlist)}
          open={popup3}
          onPopup={onPopup3}
          text="최신순"
          width="sort"
        />
      </div>
      <Item items={data.items} />
      <Pagenation
        totalPage={data.totalPage as number}
        currentPage={currentPage}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onPage={onPage}
      />
    </>
  );
}
