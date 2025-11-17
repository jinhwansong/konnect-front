import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from 'react';

import ArticleContent from '@/components/article/ArticleContent';
import { fetchArticles } from '@/libs/article';

export default async function ArticlesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['article', 1, 'all', 10, 'latest'],
    queryFn: () => fetchArticles(1, 'all', 10, 'latest'),
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
        <ArticleContent initialCategory="all" />
      </Suspense>
    </HydrationBoundary>
  );
}
