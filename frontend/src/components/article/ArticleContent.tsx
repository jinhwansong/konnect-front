'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleCard from './ArticleCard';
import Pagination from '../common/Pagination';
import {
  ARTICLE_OPTION_ALL,
  ArticleCategoryTabType,
  articleSortOptions,
  ArticleSortType,
} from '@/contact/article';
import SelectBox from '../common/SelectBox';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGetArticle, useLikedArticles } from '@/hooks/query/useArticle';

export default function ArticleContent({
  initialCategory,
}: {
  initialCategory: ArticleCategoryTabType;
}) {
  const safeInitial = initialCategory ?? 'all';

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ArticleSortType>('latest');
  const [selected, setSelected] = useState<ArticleCategoryTabType>(safeInitial);
  const { data, isLoading } = useGetArticle(page, selected, 10, sort);
  const articleIds = data?.data?.map((item) => item.id) ?? [];
  const { data: likedIds } = useLikedArticles(articleIds);
  const { accessToken } = useAuthStore();
  const router = useRouter();

  if (isLoading) return null;
  const onRouter = () => {
    if (!accessToken) {
      return router.push('/login');
    }
    router.push('/articles/create');
  };
  return (
    <section className="mx-auto mt-10 mb-16 w-[768px]">
      <div className="mb-10 flex w-full items-center justify-between">
        <div className="mb-7 flex items-center gap-5">
          <SelectBox<ArticleCategoryTabType>
            value={selected}
            onChange={setSelected}
            options={ARTICLE_OPTION_ALL}
            placeholder="카테고리 선택"
            className="w-[192px]"
          />
          <SelectBox
            value={sort}
            onChange={setSort}
            options={articleSortOptions}
            placeholder="정렬 기준"
            className="w-[120px]"
          />
        </div>
        <button
          onClick={onRouter}
          className="rounded-lg bg-[var(--primary-sub01)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--primary)]"
        >
          ✏️ 아티클 작성
        </button>
      </div>

      {data?.data && data.data.length > 0 ? (
        <div className="flex flex-col gap-8">
          {data.data.map((item) => (
            <ArticleCard
              key={item.id}
              {...item}
              liked={likedIds?.includes(item.id) ?? false}
            />
          ))}
        </div>
      ) : (
        <p className="flex h-[calc(100vh-280px)] w-full items-center justify-center">
          게시물이 없습니다.
        </p>
      )}

      <Pagination
        page={page}
        totalPages={data?.totalPages || 1}
        onChange={(newPage) => setPage(newPage)}
      />
    </section>
  );
}
