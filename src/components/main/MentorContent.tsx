'use client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import MentorItem from '@/components/main/MentorItem';
import { categoryIcons, CategoryTabType } from '@/contact/mentoring';
import { useGetSession } from '@/hooks/query/useCommonSession';

export default function MentorContent({
  initialCategory,
}: {
  initialCategory: CategoryTabType;
}) {
  const safeInitial = initialCategory ?? 'all';
  const [selected, setSelected] = useState<CategoryTabType>(safeInitial);
  const { data, isLoading } = useGetSession(1, selected, 8, 'latest');
  if (isLoading) return null;
  return (
    <article className="mx-auto w-full px-5 sm:px-8 lg:w-[1200px] xl:px-0">
      <div className="flex justify-evenly gap-3 px-4 pb-2 sm:gap-4 md:gap-5">
        {Object.entries(categoryIcons).map(([key, { icon, label }]) => (
          <button
            key={key}
            onClick={() => setSelected(key as CategoryTabType)}
            className={`flex shrink-0 flex-col items-center text-xs font-medium sm:text-sm ${
              selected === key ? 'text-[var(--primary)]' : ''
            }`}
          >
            <motion.div
              whileHover={{
                y: -6,
                transition: { type: 'spring', stiffness: 300, damping: 15 },
              }}
            >
              {icon}
            </motion.div>

            <span className="mt-1 block text-center leading-tight break-keep sm:mt-2">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* 멘토링 세션 리스트 */}
      {data?.data && data.data.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {data.data.map(item => (
            <MentorItem key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="h-[200px] w-full py-10 text-center text-sm leading-[200px] text-[var(--text-default)]">
          등록된 멘토링 세션이 없습니다.
        </div>
      )}
    </article>
  );
}
