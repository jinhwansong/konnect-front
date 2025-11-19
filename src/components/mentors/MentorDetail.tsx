'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { HiMiniStar } from 'react-icons/hi2';
import {  LuClock3, LuLayers, LuTag } from 'react-icons/lu';

import { CAREER_OPTIONS, POSITION_OPTIONS } from '@/contact/apply';
import { useGetSessionDetail } from '@/hooks/query/useCommonSession';
import { formatMinutesToKorean } from '@/utils/formatDuration';
import { formatToKoreanWon } from '@/utils/formatPrice';
import { buildImageUrl } from '@/utils/getImageUrl';
import { findOptionLabel } from '@/utils/getLabel';

import Button from '../common/Button';


const DUMMY_REVIEWS = [
  {
    id: 'review-1',
    name: '박요한',
    rating: 4.9,
    date: '2024.08.12',
    content:
      '실무 경험을 바탕으로 바로 실행 가능한 조언을 해주셔서 많은 인사이트를 얻었습니다. 상담 이후에도 체크인을 도와주셔서 큰 도움이 됐어요.',
  },
  {
    id: 'review-2',
    name: '이서연',
    rating: 4.7,
    date: '2024.07.03',
    content:
      '커리어 방향이 막막했는데 로드맵을 함께 그려주셔서 다음 스텝을 명확하게 정할 수 있었습니다.',
  },
  {
    id: 'review-3',
    name: '김민준',
    rating: 5,
    date: '2024.05.21',
    content:
      '포트폴리오 리뷰가 매우 디테일했고, 실무 사례를 기반으로 개선 포인트를 짚어주셔서 실전 감각을 끌어올릴 수 있었습니다.',
  },
];

export default function MentorDetail({ sessionId }: { sessionId: string }) {
  const { data: session } = useGetSessionDetail(sessionId);
  const router = useRouter();
  const { data: sessions } = useSession();


  const onReserve = () => {
    if (!sessions?.user) {
      router.push('/login');
      return;
    }
    router.push(`/mentors/${sessionId}/reserve`);
  };


  const metaCards = [
    {
      label: '멘토링 가격',
      value: formatToKoreanWon(session?.price as number),
      icon: <LuTag className="text-[var(--primary)]" />,
    },
    {
      label: '세션 길이',
      value: formatMinutesToKorean(session?.duration as number),
      icon: <LuClock3 className="text-[var(--primary)]" />,
    },
    {
      label: '평균 평점',
      value: session?.rating ? `${session?.rating.toFixed(1)} / 5.0` : '신규',
      icon: <HiMiniStar className="text-[var(--primary)]" />,
    },
    {
      label: '카테고리',
      value: session?.category,
      icon: <LuLayers className="text-[var(--primary)]" />,
    },
  ];

  return (
    <section className="mx-auto mt-10 mb-24 w-full max-w-6xl px-4">
      <div className="grid gap-8 lg:grid-cols-[1.45fr_0.55fr]">
        <article>
          <div className="mt-5 space-y-4">
            <p className="text-sm tracking-[0.35em] text-[var(--text-sub)] uppercase">
              {session?.category}
            </p>
            <h1 className="text-3xl leading-tight font-semibold text-[var(--text-bold)] md:text-[40px]">
              {session?.title}
            </h1>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--text-sub)]">
            <TagPill>
              {findOptionLabel(session?.position as string, POSITION_OPTIONS)}
            </TagPill>
            <TagPill>
              {findOptionLabel(session?.career as string, CAREER_OPTIONS)}
            </TagPill>
            {session?.company !== '비공개' && (
              <TagPill>{session?.company}</TagPill>
            )}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {metaCards.map(card => (
              <div
                key={card.label}
                className="rounded-2xl border border-[var(--border-color)] px-5 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-sub)]">
                  {card.label}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-semibold text-[var(--text-bold)]">
                    {card.value}
                  </span>
                  <span className="text-lg text-[var(--text-sub)]">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-[28px] border border-[var(--border-color)]  p-6 lg:sticky lg:top-24">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={buildImageUrl(session?.image as string)}
              alt={session?.nickname as string}
              width={120}
              height={120}
              className="h-28 w-28 rounded-2xl object-cover"
            />
            <div className="text-center">
              <p className="text-xs tracking-[0.4em] text-[var(--text-sub)] uppercase">
                mentor
              </p>
              <p className="text-2xl font-semibold text-[var(--text-bold)]">
                {session?.nickname as string}
              </p>
              {session?.rating ? (
                <span className="mt-1 inline-flex items-center gap-1 text-sm text-[var(--text-sub)]">
                  <HiMiniStar className="text-[var(--primary)]" />
                  {session.rating.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-sub)]">1회 비용</dt>
              <dd className="font-semibold text-[var(--text-bold)]">
                {formatToKoreanWon(session?.price as number)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-sub)]">세션 길이</dt>
              <dd className="font-semibold text-[var(--text-bold)]">
                {formatMinutesToKorean(session?.duration as number)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-3">
            <Button className="w-full" size="lg" onClick={onReserve}>
              멘토링 예약하기
            </Button>
            <Button className="w-full" size="lg" variant="outline">
              <span className="flex items-center justify-center gap-2 text-sm">
                <FaHeart />
                찜하기
              </span>
            </Button>
          </div>
          <p className="mt-4 text-xs text-[var(--text-sub)]">
            예약 확정 후 결제 및 화상회의 링크가 안내됩니다.
          </p>
        </aside>
      </div>

      <section className="mt-12 border-t border-[var(--border-color)] pt-8">
        <article>
          <header className="mb-6">
            <p className="text-xs tracking-[0.3em] text-[var(--text-sub)] uppercase">
              INTRODUCTION
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-bold)]">
              멘토 소개
            </h2>
          </header>
          <div
            className="ProseMirror prose max-w-none text-[var(--text)]"
            dangerouslySetInnerHTML={{
              __html:
                session?.description ??
                '실제 프로젝트 경험을 바탕으로 커리어 성장과 제품 전략에 필요한 인사이트를 제공합니다.',
            }}
          />
        </article>
      </section>

      <section className="mt-12 border-t border-[var(--border-color)] pt-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--text-sub)] uppercase">
              REVIEWS
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-bold)]">
              멘티 후기
            </h2>
            <p className="text-sm text-[var(--text-sub)]">
              실제 멘티들의 피드백이에요
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DUMMY_REVIEWS.map(review => (
            <article
              key={review.id}
              className="rounded-2xl border border-[var(--border-color)] p-6 text-sm text-[var(--text)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[var(--text-bold)]">
                  {review.name}
                </p>
                <span className="inline-flex items-center gap-1 text-[var(--primary)]">
                  <HiMiniStar />
                  {review.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-1 text-[var(--text-sub)]">{review.date}</p>
              <p className="mt-3 leading-relaxed">{review.content}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border-color)] px-4 py-1.5 text-xs font-semibold text-[var(--text-bold)]">
      {children}
    </span>
  );
}

