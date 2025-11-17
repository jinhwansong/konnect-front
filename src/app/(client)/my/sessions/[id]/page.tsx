'use client';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { FiClock, FiDollarSign, FiStar } from 'react-icons/fi';

import Button from '@/components/common/Button';
import {
  useDeleteSession,
  useGetSessionDetail,
  useTogglePublic,
} from '@/hooks/query/useSession';
import { useToastStore } from '@/stores/useToast';
import { formatToKoreanDate } from '@/utils/formatDate';
import { formatMinutesToKorean } from '@/utils/formatDuration';
import { formatToKoreanWon } from '@/utils/formatPrice';

export default function SessionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { show } = useToastStore();
  const { mutate: togglePublic } = useTogglePublic();
  const { mutate: deleteSession } = useDeleteSession();
  const { data: session, isLoading } = useGetSessionDetail(id as string);

  // 공개여부 전환
  const handlePublic = () => {
    togglePublic({
      id: session?.id as string,
      isPublic: session?.public as boolean,
    });
  };

  // 삭제
  const handleDeleteSession = () => {
    deleteSession(
      {
        id: session?.id as string,
      },
      {
        onSuccess: () => {
          show('세션삭제를 완료했습니다.', 'success');
          router.push('/my/sessions');
        },
        onError: () => {
          show('세션삭제를 실패했습니다.', 'error');
        },
      }
    );
  };

  if (isLoading) return null;

  const InfoCard = [
    {
      icon: <FiDollarSign size={16} />,
      label: '가격',
      value: `${formatToKoreanWon(session?.price as number)}`,
    },
    {
      icon: <FiClock size={16} />,
      label: '시간',
      value: `${formatMinutesToKorean(session?.duration as number)}`,
    },
    {
      icon: <FiStar size={16} />,
      label: '평점',
      value: session?.rating ? `${session?.rating.toFixed(1)}점` : '평가 없음',
    },
  ];

  return (
    <section className="flex-1 text-sm text-[var(--text)]">
      <h1 className="mb-4 text-2xl leading-snug font-bold break-words text-[var(--text-bold)]">
        {session?.title}
      </h1>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[var(--primary-sub02)] px-2 py-0.5 text-sm text-[var(--primary)]">
            {session?.category}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-sm font-medium ${
              session?.public
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {session?.public ? '공개' : '비공개'}
          </span>
          <button
            className="text-sm text-[var(--primary)] underline"
            type="button"
            onClick={handlePublic}
          >
            {session?.public ? '비공개로 전환' : '공개로 전환'}
          </button>
          <span>{formatToKoreanDate(session?.createdAt as string)}</span>
        </div>

        <div className="flex h-9 items-center gap-2 text-sm whitespace-nowrap text-[var(--text-sub)]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/my/sessions/edit/${session?.id}`)}
          >
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteSession}>
            삭제
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 text-[13px] sm:grid-cols-3">
        {InfoCard.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--border-color)] p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-[var(--text-sub)]">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <div className="text-lg font-semibold text-[var(--text-bold)]">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-sm max-w-none leading-relaxed text-[var(--text)]">
        <div
          className="ProseMirror viewer"
          dangerouslySetInnerHTML={{ __html: session?.description ?? '' }}
        />
      </div>
    </section>
  );
}
