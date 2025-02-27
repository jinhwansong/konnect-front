'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getDetailSchedule } from '@/app/_lib/useMentor';
import style from './schedule.module.scss';
import Image from 'next/image';
import { getImageUrl } from '@/util/getImageUrl';
import { formatDate } from '@/util/formatDate';
import { formatDateTime } from '@/util/formatDateTime';
import { getStatus } from '@/app/(client)/config/columns';
import { StatusType } from '@/type';

interface ISchedulePage {
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  phone: string;
  message: string;
  email: string;
  name: string;
  image: string;
}


export default function SchedulePage() {
  const param = useParams();
  const { data } = useQuery<ISchedulePage>({
    queryKey: ['scheduleDetail', param.id],
    queryFn: () => getDetailSchedule(param.id as string),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  return (
    <section className={style.schedule_section}>
      <div className={style.schedule}>
        <em>예약 정보</em>
        <strong className={style.title}>{data?.title}</strong>
        <ul className={style.textbox2}>
          <li>
            <em>예약시간</em>
            <p>
              {formatDate(data?.startTime as string)}{' '}
              {data?.startTime && formatDateTime(data?.startTime as string)} -{' '}
              {data?.endTime && formatDateTime(data?.endTime as string)}
            </p>
          </li>
          <li>
            <em>예약상태</em>
            <p>{getStatus[data?.status as StatusType]}</p>
          </li>
        </ul>
      </div>
      <div className={style.schedule}>
        <em>신청자 정보</em>
        <div className={style.content}>
          <div className={style.imgbox}>
            <Image
              src={getImageUrl(data?.image as string)}
              alt={data?.name as string}
              height={196}
              width={210}
            />
          </div>
          <ul className={style.textbox}>
            <li>
              <em>이름 | Name</em>
              <p>{data?.name}</p>
            </li>
            <li>
              <em>연락처 | phone</em>
              <p>{data?.phone}</p>
            </li>
            <li>
              <em>이메일 | email</em>
              <p>{data?.email}</p>
            </li>
          </ul>
        </div>
        <p className={style.message}>{data?.message}</p>
      </div>
    </section>
  );
}

status: 'confirmed';
