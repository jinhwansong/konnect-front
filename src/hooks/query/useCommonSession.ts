import { useQuery } from '@tanstack/react-query';

import { CategoryTabType, MentoringSortType } from '@/contact/mentoring';
import { withQueryDefaults } from '@/hooks/query/options';
import { fetchSessionDetail, fetchSessions } from '@/libs/main';
import { SessionDetailResponse, SessionResponse } from '@/types/main';

export const useGetSession = (
  page: number,
  category: CategoryTabType = 'all',
  limit: number = 10,
  sort: MentoringSortType = 'latest'
) => {
  return useQuery<SessionResponse>(
    withQueryDefaults({
      queryKey: ['sessions', page, category, limit, sort],
      queryFn: () => fetchSessions(page, category, limit, sort),
    })
  );
};

export const useGetSessionDetail = (id: string) => {
  return useQuery<SessionDetailResponse>(
    withQueryDefaults({
      queryKey: ['main-session', id],
      queryFn: () => fetchSessionDetail(id),
    })
  );
};
