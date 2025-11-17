'use client';
import React from 'react';

import { useGetArticle, useLikedArticles } from '@/hooks/query/useArticle';

import ArticleCard from '../article/ArticleCard';

export default function ArticleList({ type }: { type: string }) {
  const { data, isLoading } = useGetArticle(1, 'all', 6, type);
  const articleIds = data?.data?.map(item => item.id) ?? [];
  const { data: likedIds } = useLikedArticles(articleIds);
  if (isLoading) return null;
  return (
    <article className="mx-auto mt-10 mb-20 px-5 sm:px-8 md:w-[768px] lg:w-[1200px] xl:px-0">
      <h4 className="mb-6 text-xl font-bold text-[var(--text-bold)] sm:text-2xl">
        인기 많은 아티클
      </h4>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
        {data?.data &&
          data.data.map((item, index) => (
            <ArticleCard
              key={item.id}
              {...item}
              type="main"
              number={index + 1}
              liked={likedIds?.includes(item.id) ?? false}
            />
          ))}
      </div>
    </article>
  );
}
