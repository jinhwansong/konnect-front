import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import ArticleList from '@/components/main/ArticleList';
import MentorContent from '@/components/main/MentorContent';
import Slider from '@/components/main/Slider';
import { fetchArticles } from '@/libs/article';
import { fetchSessions } from '@/libs/main';
import AdminRedirect from '@/components/common/AdminRedirect';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['sessions', 1, 'all', 8, 'latest'],
    queryFn: () => fetchSessions(1, 'all', 8, 'latest'),
  });

  await queryClient.prefetchQuery({
    queryKey: ['article', 1, 'all', 6, 'likes'],
    queryFn: () => fetchArticles(1, 'all', 6, 'likes'),
  });
  return (
    <>
      <AdminRedirect />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Slider />
        <MentorContent initialCategory="all" />
        <ArticleList type="likes" />
      </HydrationBoundary>
    </>
  );
}
