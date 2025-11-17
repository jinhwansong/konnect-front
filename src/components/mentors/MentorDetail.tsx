'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiBriefcase } from 'react-icons/fi';

import { CAREER_OPTIONS, POSITION_OPTIONS } from '@/contact/apply';
import { careerIconMap, positionIconMap } from '@/contact/mentoring';
import { useGetSessionDetail } from '@/hooks/query/useCommonSession';
import { formatMinutesToKorean } from '@/utils/formatDuration';
import { formatToKoreanWon } from '@/utils/formatPrice';
import { buildImageUrl } from '@/utils/getImageUrl';
import { findOptionLabel } from '@/utils/getLabel';

import Button from '../common/Button';

export default function MentorDetail({ sessionId }: { sessionId: string }) {
  const { data: session, isLoading } = useGetSessionDetail(sessionId);
  const router = useRouter();
  const { data: sessions } = useSession();
  const onRouter = () => {
    if (!sessions?.user) {
      return router.push('/login');
    }
    router.push(`/mentors/${sessionId}/reserve`);
  };
  if (isLoading) return null;
  return (
    <section className="mx-auto mt-12 mb-20 px-4 md:w-[768px] lg:w-[1200px]">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <h1 className="text-3xl leading-tight font-bold text-[var(--text-bold)]">
            {session?.title}
          </h1>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 border-b border-[var(--border-color)] pb-4 text-sm text-[var(--text-sub)]">
            <div>
              <span className="font-medium text-[var(--text)]">카테고리:</span>{' '}
              {session?.category}
            </div>
            <div>
              <span className="font-medium text-[var(--text)]">가격:</span>{' '}
              {formatToKoreanWon(session?.price as number)}
            </div>
            <div>
              <span className="font-medium text-[var(--text)]">시간:</span>{' '}
              {formatMinutesToKorean(session?.duration as number)}
            </div>
            <div>
              <span className="font-medium text-[var(--text)]">평점:</span> ⭐{' '}
              {session?.rating}
            </div>
          </div>

          <div
            className="ProseMirror mt-6"
            dangerouslySetInnerHTML={{ __html: session?.description ?? '' }}
          />
        </div>

        <aside className="self-start rounded-xl border border-[var(--border-color)] bg-white p-6 text-center shadow-sm md:sticky md:top-28">
          <Image
            src={buildImageUrl(session?.image as string)}
            alt={session?.nickname as string}
            width={100}
            height={100}
            className="mx-auto mb-4 h-24 w-24 rounded-full border object-cover"
          />
          <div className="text-lg font-semibold text-[var(--text-bold)]">
            {session?.nickname}
          </div>

          <ul className="mt-3 space-y-2 text-sm text-[var(--text-sub)]">
            <li className="flex items-center justify-center gap-1.5 text-[var(--text-bold)]">
              <span className="text-base text-[var(--background-sub01)]">
                {positionIconMap[session?.position as string]}
              </span>
              <span>
                {findOptionLabel(session?.position as string, POSITION_OPTIONS)}
              </span>
            </li>
            <li className="flex items-center justify-center gap-1.5 text-[var(--text-bold)]">
              <span className="text-base text-[var(--background-sub01)]">
                {careerIconMap[session?.career as string]}
              </span>
              <span>
                {findOptionLabel(session?.career as string, CAREER_OPTIONS)}
              </span>
            </li>
            {session?.company !== '비공개' && (
              <li className="flex items-center justify-center gap-1.5 font-medium text-[var(--primary)]">
                <FiBriefcase />
                <span>{session?.company}</span>
              </li>
            )}
          </ul>

          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full" variant="primary" onClick={onRouter}>
              멘토링 신청하기
            </Button>
            <Button className="w-full" variant="outline">
              <span className="flex items-center justify-center gap-2.5">
                <FaHeart /> 찜하기
              </span>
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
