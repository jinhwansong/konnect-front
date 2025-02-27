'use client'
import React, { useCallback, useState } from 'react'
import style from './taps.module.scss';
import Item from './Item';
import { IMentoring } from '@/type';
import { fetchProgram } from '@/app/_lib/useEtc';

export interface IItem {
  initialData: IMentoring;
}

export default function TapSection({ initialData }: IItem) {
  const [data, setData] = useState(initialData);
  const taps = [
    { name: '개발자 커리어', value: 'IT개발/데이터' },
    { name: '디자인/기획 준비', value: '서비스 기획/UI, UX' },
    { name: '마케팅 필수전략', value: '마케팅/MD' },
  ];
  const [tap, setTap] = useState('IT개발/데이터');
  const changeTap = useCallback(async (value: string) => {
    setTap(value);
    const newDate = await fetchProgram({
      mentoring_field: value,
      page: 1,
      limit: 6,
      sort: 'latest',
    });
    setData(newDate);
  }, []);
  return (
    <>
      <div className={style.tap_warp}>
        {taps.map((item) => (
          <button
            key={item.name}
            onClick={() => changeTap(item.value)}
            className={item.value === tap ? style.tap_active : ''}
          >
            {item.name}
          </button>
        ))}
      </div>
      <Item items={data.items} />
    </>
  );
}
