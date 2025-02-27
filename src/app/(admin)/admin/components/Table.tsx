'use client';
import React from 'react';
import { IColumn, IPage, ITables } from '@/type';
import Pagenation from '@/app/_component/Pagenation';
import style from './table.module.scss';
import { useRouter } from 'next/navigation';

interface ITable<T extends {id:number}> extends IPage {
  title: string;
  column: IColumn<T>[];
  data?: ITables<T>;
}

export default function Table<T extends {id:number}>({
  title,
  column,
  currentPage,
  onPrevPage,
  onNextPage,
  onPage,
  data,
}: ITable<T>) {
  const router = useRouter();
  return (
    <div className={style.tablebg}>
      <div>
        <h4 className={style.title}>{title}</h4>
      </div>

      <div>
        <table className={style.table}>
          <thead>
            <tr>
              {column?.map((config) => (
                <th key={config.id}>{config.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  title === '멘토 신청 관리' &&
                  router.push(`/admin/mentors/${item.id}`)
                }
                className={title === '멘토 신청 관리' ? style.click : ''}
              >
                {column?.map((config) => (
                  <td key={config.id}>{config.render?.(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagenation
        totalPage={data?.totalPage as number}
        currentPage={currentPage}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onPage={onPage}
      />
    </div>
  );
}
