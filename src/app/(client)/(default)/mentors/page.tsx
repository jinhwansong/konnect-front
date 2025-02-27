import React from 'react'
import { Metadata } from 'next';
import { IfetchProgram } from '@/type';
import style from '@/styles/_common.module.scss';
import Mentors from './_component/Mentors';
import { fetchProgram } from '@/app/_lib/useEtc';

// 메타데이터
export async function generateMetadata(): Promise<Metadata> {
  const param: IfetchProgram = {
    page: 1,
    limit: 10,
    sort: 'latest',
    mentoring_field: '',
  };
  try {
    const data = await fetchProgram(param);
    return {
      title: `커넥트 - 한 걸음 더 나아가는 연결 | ${data.items[0].mentoring_field}`,
      description: '멘토와 함께 성장하는 플랫폼',
      openGraph: {
        title: `커넥트 - 한 걸음 더 나아가는 연결 | ${data.items[0].mentoring_field}`,
        description: '멘토와 함께 성장하는 플랫폼',
      },
    };
  } catch (error) {
    return {
      title: '커넥트 - 한 걸음 더 나아가는 연결',
      description: '멘토와 함께 성장하는 플랫폼',
      openGraph: {
        title: '커넥트 - 한 걸음 더 나아가는 연결',
        description: '멘토와 함께 성장하는 플랫폼',
      },
    };
  }
}
export default async function page() {
  const param: IfetchProgram = {
    page: 1,
    limit: 30,
    sort: 'latest',
    mentoring_field: '',
  };
  const data = await fetchProgram(param);
  return (
    <section>
      <h4 className={style.title}>분야별 멘토 찾기</h4>
      <Mentors items={data.items} totalPage={data.totalPage} />
    </section>
  );
}
