'use client';
import React, { useState } from 'react';

import {
  CategoryTabType,
  MENTORING_OPTION_ALL,
  mentoringSortOptions,
  MentoringSortType,
} from '@/contact/mentoring';
import { useGetSession } from '@/hooks/query/useCommonSession';

import Select from '../common/Select';
import MentorItem from '../main/MentorItem';

export default function MentorContent({
  initialCategory,
}: {
  initialCategory: CategoryTabType;
}) {
  const safeInitial = initialCategory ?? 'all';
  const [selected, setSelected] = useState<CategoryTabType>(safeInitial);
  const [sort, setSort] = useState<MentoringSortType>('latest');
  const { data, isLoading } = useGetSession(1, selected, 20, sort);
  if (isLoading) return null;
  return (
    <section className="mx-auto mt-10 mb-16 md:w-[768px] lg:w-[1200px]">
      <h4 className="mb-7 text-2xl font-bold text-[var(--text-bold)]">
        멘토 찾기
      </h4>
      <div className="mb-5 flex  items-center justify-between">
        <Select
          value={selected}
          onChange={setSelected}
          options={MENTORING_OPTION_ALL}
          placeholder="카테고리 선택"
          className="w-[192px]"
        />
        <Select
          value={sort}
          onChange={setSort}
          options={mentoringSortOptions}
          placeholder="정렬 기준"
          className="w-[140px]"
        />
      </div>
      {data?.data && data.data.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {data.data.map(item => (
            <MentorItem key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="h-[350px] w-full py-10 text-center leading-[350px]">
          등록된 멘토링 세션이 없습니다.
        </div>
      )}
    </section>
  );
}
