import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';
import { Suspense } from 'react';

import ArticleDetail from '@/components/article/ArticleDetail';
import { fetchArticleDetail } from '@/libs/article';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const article = await fetchArticleDetail(id);

    return {
      title: article.title,
      description: article.content.slice(0, 150),
      openGraph: {
        title: article.title,
        description: article.content.slice(0, 150),
        images: article.thumbnail ? [article.thumbnail] : [],
      },
    };
  } catch {
    return {
      title: '아티클',
      description: '아티클을 찾을 수 없습니다.',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['articleDetail', id],
    queryFn: () => fetchArticleDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            로딩 중...
          </div>
        }
      >
        <ArticleDetail articleId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
