'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import TimeTable from '../../_component/TimeTable';
import ButtonRouter from '../../_component/ButtonRouter';
import { formatDate } from '@/util/formatDate';
import { formatNumber } from '@/util/formatNumber';
import { stateus } from '@/util/status';
import HtmlWrapper from '@/app/_component/HtmlWrapper';
import { ISchedule } from '@/type';
import style from './program.module.scss';
import { getDetailProgram } from '@/app/_lib/useMentor';

export default function ProgramDetail() {
  const param = useParams()
  const { data } = useQuery({
    queryKey: ['mentorDetail', param.id],
    queryFn: () => getDetailProgram(param.id as string),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  const schedule: ISchedule = data?.available_schedule;
  return (
    <section className={style.program_section}>
      <div className={style.detail_top_tip}>
        <h4 className={style.program_title}>
          멘토링 생성/관리
          <span
            className={data?.status === 'active' ? style.status : style.none}
          >
            {stateus(data?.status)}
          </span>
        </h4>
        <TimeTable schedule={schedule} duration={data?.duration}>
          멘토링 일정표
        </TimeTable>
      </div>
      <div className={style.detail_top}>
        <h5 className={style.detail_title}>{data?.title}</h5>
        <ul className={style.detail_info_meta}>
          <li>
            <span>1회당 멘토링 시간 : </span>
            <span>{data?.duration}분</span>
          </li>
          <li>
            <span>1회당 가격 : </span>
            <span>{formatNumber(data?.price)}원</span>
          </li>
          <li>
            <span>평점 : </span>
            <span>
              {data?.averageRating} ({formatNumber(data?.totalReviews)})
            </span>
          </li>
          <li>
            <span>멘토링분야 : </span>
            <span>{data?.mentoring_field}</span>
          </li>
          <li>
            <span>등록일 : </span>
            <span>{formatDate(data?.createdAt)}</span>
          </li>
        </ul>
      </div>
      <div className={style.detail_bottom}>
        <HtmlWrapper html={data?.content} />
      </div>
      <div className={style.button_wrap}>
        <ButtonRouter bg="none" link="back">
          목록
        </ButtonRouter>
        <ButtonRouter bg="delete" link="delete">
          삭제
        </ButtonRouter>
        <ButtonRouter link="modify">수정</ButtonRouter>
      </div>
    </section>
  );
}
