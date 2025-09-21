import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from 'react';

import MentorContent from '@/components/mentors/MentorContent';
import { queryKeys } from '@/hooks/query/queryKeys';
import { fetchSessions } from '@/libs/main';

export default async function MentorsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.sessions.list({
      page: 1,
      category: 'all',
      limit: 20,
      sort: 'latest',
    }),
    queryFn: () => fetchSessions(1, 'all', 20, 'latest'),
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
        <MentorContent initialCategory="all" />
      </Suspense>
    </HydrationBoundary>
  );
}
