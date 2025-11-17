'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import ArticleForm from '@/components/article/ArticleForm';
import {
  useGetArticleDetail,
  useUpdateArticle,
} from '@/hooks/query/useArticle';
import { useToastStore } from '@/stores/useToast';
import { ArticleRequest } from '@/types/article';

export default function EditArticlePage() {
  const { id } = useParams();
  const { show } = useToastStore();
  const router = useRouter();
  const { data: article } = useGetArticleDetail(id as string);
  const { mutate: updateArticle } = useUpdateArticle();

  const handleSubmit = useCallback(
    async (data: ArticleRequest) => {
      updateArticle(
        {
          id: article?.id as string,
          data,
        },
        {
          onSuccess: () => {
            show('아티클 수정을 완료했습니다.', 'success');
            router.push(`/articles/${id}`);
          },
          onError: () => {
            show('아티클 수정에 실패했습니다.', 'error');
          },
        }
      );
    },
    [updateArticle, article?.id, show, router, id]
  );

  return (
    <ArticleForm
      defaultValues={article}
      onSubmit={handleSubmit}
      title="아티클 수정"
    />
  );
}
