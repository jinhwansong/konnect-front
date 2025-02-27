import React from 'react'
import Slide from '../_component/Slide';
import style from '@/styles/_common.module.scss';
import { Metadata } from 'next';
import { IfetchProgram } from '@/type';
import TapSection from '../_component/TapSection';
import { fetchProgram } from '@/app/_lib/useEtc';

// 메타데이터
export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    mentoring_field?: string;
  };
}): Promise<Metadata> {
  const param: IfetchProgram = {
    page: 1,
    limit: 6,
    sort: 'latest',
    mentoring_field: searchParams.mentoring_field || 'IT개발/데이터',
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
export default async function page({
  searchParams,
}: {
  searchParams: { mentoring_field?: string };
}) {
  const param: IfetchProgram = {
    page: 1,
    limit: 6,
    sort: 'latest',
    mentoring_field: searchParams.mentoring_field || 'IT개발/데이터',
  };
  const data = await fetchProgram(param);
  return (
    <>
      <Slide />
      <article className={style.main_article}>
        <h4 className={style.title}>관심있는 멘토에게 질문하기</h4>
        <TapSection initialData={data} />
      </article>
    </>
  );
}
