import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { withQueryDefaults } from '@/hooks/query/options';
import {
  removeSession,
  fetchSessions,
  fetchSessionDetail,
  updateSession,
  createSession,
  updateSessionVisibility,
} from '@/libs/session';
import {
  PatchSession,
  SessionDetailResponse,
  SessionRequest,
  SessionResponse,
} from '@/types/session';

export const useGetSession = (page: number) => {
  const { data: session } = useSession();

  return useQuery<SessionResponse>(
    withQueryDefaults({
      queryKey: ['session', page],
      queryFn: () => fetchSessions(page),
      enabled: !!session?.user,
    })
  );
};

export const useGetSessionDetail = (id: string) => {
  const { data: session } = useSession();

  return useQuery<SessionDetailResponse>(
    withQueryDefaults({
      queryKey: ['session-detail', id],
      queryFn: () => fetchSessionDetail(id),
      enabled: !!session?.user,
    })
  );
};

export const useTogglePublic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      updateSessionVisibility(id, isPublic),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session-detail'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['session'], exact: false });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => removeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'], exact: false });
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SessionRequest) => createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'], exact: false });
    },
  });
};

export const usePatchSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: PatchSession) => updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session-detail'], exact: false
      });
      queryClient.invalidateQueries({ queryKey: ['session'], exact: false });
    },
  });
};
