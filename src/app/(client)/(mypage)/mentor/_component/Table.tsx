'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IColumn, ITables } from '@/type';
import style from './table.module.scss';


interface ITable<T extends { id: number }> {
  column: IColumn<T>[];
  data?: ITables<T>;
  tap?:string;
}

export default function Table<T extends { id: number }>({
  column,
  data,
  tap
}: ITable<T>) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className={style.table_wrapper}>
      <table className={`${style.table} ${tap === '7' && style.schedule_table}`}>
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
                pathname.split('/')[2] === 'program' &&
                router.push(`/mentor/program/${item.id}`)
              }
              className={
                pathname.split('/')[2] === 'program' ? style.click : ''
              }
            >
              {column?.map((config) => (
                <td
                  key={config.id}
                >
                  {config.render?.(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
