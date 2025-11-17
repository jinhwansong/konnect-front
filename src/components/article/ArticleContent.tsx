'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import {
  ARTICLE_OPTION_ALL,
  ArticleCategoryTabType,
  ARTICLE_OPTION_SORT,
  ArticleSortType,
} from '@/contact/article';
import { useGetArticle, useLikedArticles } from '@/hooks/query/useArticle';

import Button from '../common/Button';
import Pagination from '../common/Pagination';
import Select from '../common/Select';

import ArticleCard from './ArticleCard';

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
  const articleIds = data?.data?.map(item => item.id) ?? [];
  const { data: likedIds } = useLikedArticles(articleIds);
  const { data: session } = useSession();
  const router = useRouter();

  if (isLoading) return null;
  const onRouter = () => {
    if (!session?.user) {
      return router.push('/login');
    }
    router.push('/articles/create');
  };
  return (
    <section className="mx-auto mt-10 mb-16 w-[768px]">
      <div className="mb-10 flex w-full items-center justify-between">
        <div className="flex items-center gap-5">
          <Select<ArticleCategoryTabType>
            value={selected}
            onChange={setSelected}
            options={ARTICLE_OPTION_ALL}
            placeholder="카테고리 선택"
            className="w-[192px]"
          />
          <Select<ArticleSortType>
            value={sort}
            onChange={setSort}
            options={ARTICLE_OPTION_SORT}
            placeholder="정렬 기준"
            className="w-[120px]"
          />
        </div>
        <Button onClick={onRouter} size="lg">
          ✏️ 아티클 작성
        </Button>
      </div>

      {data?.data.length ? (
        <>
          <div className="flex flex-col gap-8">
            {data?.data.map(item => (
              <ArticleCard
                key={item.id}
                {...item}
                liked={likedIds?.includes(item.id) ?? false}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data?.totalPages || 1}
            onChange={newPage => setPage(newPage)}
          />
        </>
      ) : (
        <p className="flex h-[calc(100vh-280px)] w-full items-center justify-center">
          게시물이 없습니다.
        </p>
      )}
    </section>
  );
}
