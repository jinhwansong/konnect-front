import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import { getRoomMessages, sendMessage, issueWebRTCToken } from '@/libs/chat';
import {
  ChatMessage,
  ChatMessageListResponse,
  GetRoomMessagesParams,
} from '@/types/chat';

export function useChatMessages(params: Omit<GetRoomMessagesParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['chatMessages', params.roomId],
    queryFn: async ({ pageParam }) => {
      const [result] = await Promise.all([
        getRoomMessages({
          ...params,
          cursor: pageParam,
        }),
        new Promise(resolve => setTimeout(resolve, 50)),
      ]);
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: 'always',
    retry: 1,
    placeholderData: previousData => previousData,
  });
}

export function useAddRealtimeMessage() {
  const queryClient = useQueryClient();

  return useCallback(
    (roomId: string, message: ChatMessage) => {
      queryClient.setQueryData<InfiniteData<ChatMessageListResponse>>(
        ['chatMessages', roomId],
        oldData => {
          if (!oldData || !oldData.pages.length) return oldData;

          const pages = [...oldData.pages];
          const firstPage = pages[0];

          if (!firstPage) return oldData;

          const isDuplicate = pages.some(page =>
            page.data.some(msg => msg.id === message.id)
          );
          if (isDuplicate) return oldData;

          pages[0] = {
            ...firstPage,
            data: [...firstPage.data, message],
            count: firstPage.count + 1,
          };

          return {
            ...oldData,
            pages,
          };
        }
      );
    },
    [queryClient]
  );
}

// 캐시 완전 초기화 후 최신 메시지만 다시 로드
export function useResetToLatestMessages() {
  const queryClient = useQueryClient();

  return useCallback(
    async (roomId: string) => {
      await queryClient.resetQueries({
        queryKey: ['chatMessages', roomId],
        exact: true,
      });
    },
    [queryClient]
  );
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessage,
  });
}

export function useIssueWebRTCToken() {
  return useMutation({
    mutationFn: issueWebRTCToken,
  });
}
