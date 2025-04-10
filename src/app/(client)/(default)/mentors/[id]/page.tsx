import React from 'react'
import { Metadata } from 'next';
import Image from 'next/image';
import HtmlWrapper from '@/app/_component/HtmlWrapper';
import Button from '../_component/Buttons';
import { formatNumber } from '@/util/formatNumber';
import { formatTime } from '@/util/formatTime';
import { getImageUrl } from '@/util/getImageUrl';
import style from './style.module.scss';
import { fetchProgramDetail } from '@/app/_lib/useEtc';
// 메타데이터
export async function generateMetadata({
  params,
}: {
  params: {id: number};
}): Promise<Metadata> {
  try {
    const data = await fetchProgramDetail(params.id);
    return {
      title: `커넥트 - 한 걸음 더 나아가는 연결 | ${data?.title}`,
      description: '멘토와 함께 성장하는 플랫폼',
      openGraph: {
        title: `커넥트 - 한 걸음 더 나아가는 연결 | ${data?.title}`,
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
export default async function page({ params }: { params: { id: number } }) {
  const data = await fetchProgramDetail(params.id);
  return (
    <section className={style.section}>
      <aside className={style.aside}>
        <div className={style.imgbox}>
          <Image
            src={getImageUrl(data?.image)}
            alt={data?.name}
            width={196}
            height={260}
            loading="lazy"
            sizes="(max-width: 196px) 100vw, 196px"
          />
        </div>
        <div className={style.textbox}>
          <span className={style.field}>멘토링 정보</span>
          <em>
            <span>{data?.name}</span> 멘토
          </em>
          <p>
            {data?.company ? `${data.company} · ` : ''}
            {data?.position ? `${data.position} · ` : ''}
            {data?.career}
          </p>
          <p>
            1회 멘토링 : <strong>{formatNumber(data?.price)}</strong> 원 /{' '}
            {formatTime(data?.duration)} / 1명
          </p>
        </div>
        <Button id={data?.id} />
      </aside>
      <article>
        <span className={style.field}>{data?.mentoring_field}</span>
        <em className={style.title}>{data?.title}</em>
        <HtmlWrapper html={data?.content} />
      </article>
    </section>
  );
}
