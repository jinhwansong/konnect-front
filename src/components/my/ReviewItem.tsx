import clsx from 'clsx';
import React from 'react';
import { FaStar } from 'react-icons/fa';

import { ReviewMenteeItem, ReviewMentorItem } from '@/types/review';
import { formatToKoreanDate } from '@/utils/formatDate';

interface ReviewListProps {
  item: ReviewMentorItem | ReviewMenteeItem;
  type: 'mentor' | 'mentee';
  actions?: React.ReactNode;
}

export default function ReviewItem({ item, type, actions }: ReviewListProps) {
  return (
    <li className="rounded-xl border border-[var(--border-color)] p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-sub)]">
            {formatToKoreanDate(item.createdAt)}
          </span>
          <span className="text-sm font-medium text-[var(--primary)]">
            {type === 'mentor'
              ? `멘티 ${(item as ReviewMentorItem).menteeName}`
              : `멘토 ${(item as ReviewMenteeItem).mentorName}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <FaStar
              key={star}
              size={16}
              className={clsx(
                star <= item.rating
                  ? 'fill-[var(--primary)] text-[var(--primary)]'
                  : 'text-[var(--border-color)]'
              )}
            />
          ))}
          <span className="ml-1 text-sm font-medium text-[var(--text-sub)]">
            {item.rating}.0
          </span>
        </div>
      </div>
      <p className="mb-1 text-base font-semibold text-[var(--text-bold)]">
        {item.sessionTitle}
      </p>

      <p className="mb-3 text-sm text-[var(--text)]">{item.content}</p>
      {actions && <div className="shrink-0">{actions}</div>}
    </li>
  );
}
