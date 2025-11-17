'use client';
import React, { useState } from 'react';

import Pagination from '@/components/common/Pagination';
import ReviewItem from '@/components/my/ReviewItem';
import { useGetMentorReview } from '@/hooks/query/useReview';

export default function ReviewManagePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMentorReview(page);
  if (isLoading) return null;
  return (
    <section className="flex-1">
      <h4 className="mb-6 text-2xl font-bold text-[var(--text-bold)]">
        후기 모아보기
      </h4>
      {data?.data.length ? (
        <>
          <ul className="flex flex-col gap-6">
            {data.data.map(item => (
              <ReviewItem item={item} type="mentor" key={item.id} />
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={data?.totalPage || 1}
            onChange={newPage => setPage(newPage)}
          />
        </>
      ) : (
        <p className="flex h-[calc(100vh-280px)] w-full items-center justify-center text-gray-500">
          리뷰가 없습니다.
        </p>
      )}
    </section>
  );
}
