'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import ArticleForm from '@/components/article/ArticleForm';
import { usePostArticle } from '@/hooks/query/useArticle';
import { useToastStore } from '@/stores/useToast';
import { ArticleRequest } from '@/types/article';

export default function ArticleCreatePage() {
  const { show } = useToastStore();
  const { mutate: postArticle } = usePostArticle();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: ArticleRequest) => {
      postArticle(data, {
        onSuccess: () => {
          show('아티클 등록을 완료했습니다.', 'success');
          router.push('/articles');
        },
        onError: () => {
          show('아티클 등록에 실패했습니다.', 'error');
        },
      });
    },
    [postArticle, show, router]
  );

  return <ArticleForm onSubmit={handleSubmit} title="아티클 등록" />;
}
