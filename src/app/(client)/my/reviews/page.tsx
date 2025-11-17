'use client';
import React, { useState } from 'react';

import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import ReviewForm from '@/components/my/ReviewForm';
import ReviewItem from '@/components/my/ReviewItem';
import {
  useDeleteReview,
  useGetMenteeReview,
  usePatchReview,
} from '@/hooks/query/useReview';
import { useToastStore } from '@/stores/useToast';
import { Reviews } from '@/types/review';

export default function ReviewPage() {
  const { show } = useToastStore();
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const handleReview = (id: string) => {
    setSelectedReservationId(id);
    setIsOpen(true);
  };
  const { data, isLoading } = useGetMenteeReview(page);
  const selectedReview = data?.data.find(
    review => review.id === selectedReservationId
  );
  const { mutate: patchReview } = usePatchReview();
  const { mutate: deleteReview } = useDeleteReview();
  const onSubmit = (data: Reviews) => {
    patchReview(
      { id: selectedReservationId as string, data },
      {
        onSuccess: () => {
          show('리뷰 수정을 완료했습니다.', 'success');
          setIsOpen(false);
        },
        onError: error => {
          const errorMessage =
            error instanceof Error ? error.message : '오류가 발생했습니다.';
          show(errorMessage, 'error');
        },
      }
    );
  };
  const onDelete = (id: string) => {
    deleteReview(id, {
      onSuccess: () => {
        show('리뷰 삭제을 완료했습니다.', 'success');
        setIsOpen(false);
      },
      onError: error => {
        const errorMessage =
          error instanceof Error ? error.message : '오류가 발생했습니다.';
        show(errorMessage, 'error');
      },
    });
  };
  if (isLoading) return null;
  return (
    <section className="flex-1">
      <h4 className="mb-6 text-2xl font-bold text-[var(--text-bold)]">
        내가 쓴 후기
      </h4>
      {data?.data.length ? (
        <>
          <ul className="flex flex-col gap-6">
            {data.data.map(item => (
              <ReviewItem
                item={item}
                type="mentee"
                key={item.id}
                actions={
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleReview(item.id)}
                      size="sm"
                      variant="primary"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => onDelete(item.id)}
                      size="sm"
                      variant="danger"
                    >
                      삭제
                    </Button>
                  </div>
                }
              />
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={data?.totalPage || 1}
            onChange={newPage => setPage(newPage)}
          />
        </>
      ) : (
        <p className="flex h-[calc(100vh-280px)] w-full items-center justify-center text-[var(--text-sub)]">
          리뷰가 없습니다.
        </p>
      )}
      {isOpen && selectedReservationId && (
        <ReviewForm
          onSubmit={onSubmit}
          selectedReview={selectedReview}
          onClose={() => setIsOpen(false)}
        />
      )}
    </section>
  );
}
