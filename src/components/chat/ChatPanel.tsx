'use client';

import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { FiMessageCircle, FiUsers, FiArrowDown } from 'react-icons/fi';

import VirtualizedList, {
  type ChatVirtualHandle,
} from '@/components/common/VirtualizedList';
import {
  useChatMessages,
  useSendMessage,
  useAddRealtimeMessage,
  useResetToLatestMessages,
} from '@/hooks/query/useChat';
import { useChatSocket } from '@/hooks/useChatSocket';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface User {
  id: string;
  name: string;
  image?: string;
  isMentor?: boolean;
}

interface ChatPanelProps {
  roomId: string;
  currentUser: User;
}

export default function ChatPanel({ roomId, currentUser }: ChatPanelProps) {
  // 스크롤 하단 여부 추적
  const [isAtBottom, setIsAtBottom] = useState(true);
  const virtuosoRef = useRef<ChatVirtualHandle>(null);

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages({
    roomId,
    limit: 20,
  });

  const historyMessages = useMemo(() => {
    if (!messagesData?.pages) return [];

    // pages를 역순으로 하여 오래된 페이지가 먼저 오도록
    return [...messagesData.pages].reverse().flatMap(page => page.data);
  }, [messagesData?.pages]);

  // REST API로 메시지 전송 (자동 캐시 무효화)
  const sendMessageMutation = useSendMessage();

  // 실시간 메시지를 React Query 캐시에 추가
  const addRealtimeMessage = useAddRealtimeMessage();
  // 캐시 초기화 (첫 페이지만 남김)
  const resetToLatest = useResetToLatestMessages();

  // WebSocket에서 새 메시지를 받으면 React Query 캐시에 추가 (메모이제이션)
  const handleNewMessage = useCallback(
    (message: ChatMessageType) => {
      addRealtimeMessage(roomId, message);
    },
    [addRealtimeMessage, roomId]
  );

  // WebSocket으로 실시간 메시지 수신 및 전송
  const {
    isConnected,
    users,
    sendMessage: sendSocketMessage,
  } = useChatSocket({
    roomId,
    user: {
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.image,
      isMentor: currentUser.isMentor || false,
    },
    enabled: true,
    mode: 'general',
    onNewMessage: handleNewMessage,
  });

  // 메시지 전송
  const handleSendMessage = useCallback(
    async (message: string, files?: File[]) => {
      if (!message.trim() && (!files || files.length === 0)) return;

      try {
        // TODO: 파일 업로드 로직 추가
        if (files && files.length > 0) {
          // 1. 파일을 먼저 업로드하고 URL 받기
          // const formData = new FormData();
          // files.forEach(file => formData.append('files', file));
          // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
          // const { fileUrl } = await uploadRes.json();

          // 2. 파일 URL과 함께 메시지 전송
          // sendSocketMessage(message, 'file', fileUrl, files[0].name);
          return;
        }

        // 1. WebSocket으로 실시간 전송 (즉시 반영)
        sendSocketMessage(message);

        // 2. REST API로 DB에 저장
        await sendMessageMutation.mutateAsync({
          roomId,
          message,
        });
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      }
    },
    [roomId, sendMessageMutation, sendSocketMessage]
  );

  // 이전 메시지 로드 (VirtualizedList 내부에서 스크롤 보정 자동 처리)
  const handleLoadPrevious = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    try {
      await fetchNextPage();
      // 스크롤 위치 복원은 VirtualizedList의 anchor 기반 로직이 자동 처리
    } catch (err) {
      console.error('이전 메시지 로드 실패:', err);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤이 하단에 도달하면 자동으로 이전 페이지 제거 (메모리 최적화)
  useEffect(() => {
    if (isAtBottom && messagesData && messagesData.pages.length > 2) {
      // 하단에 도달했고 3페이지 이상이면 캐시 초기화 (2페이지는 유지)
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          resetToLatest(roomId);
        });
      }, 2000); // 2초 딜레이로 증가

      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAtBottom, messagesData?.pages.length, resetToLatest, roomId]);

  // 최신 메시지로 스크롤 버튼
  const scrollToBottom = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToBottom('smooth');
    }
  }, []);

  return (
    <div className="flex h-full flex-col bg-[var(--card-bg)]">
      {/* 채팅 헤더 */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border-color)] bg-[var(--card-bg-sub)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-sub02)]">
            <FiMessageCircle className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-bold)]">
              채팅
            </h3>
            <p className="text-xs text-[var(--text-sub)]">
              {isConnected ? '연결됨' : '연결 중...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 참여자 수 */}
          <div className="flex items-center gap-1 text-xs text-[var(--text-sub)]">
            <FiUsers className="h-3 w-3" />
            <span>{users.length}명</span>
          </div>
        </div>
      </div>

      {/* 가상화된 메시지 목록 (무한스크롤) */}
      <div className="relative min-h-0 flex-1">
        {/* React Query로 가져온 메시지 표시 */}
        <VirtualizedList
          mode="chat"
          data={historyMessages}
          emptyText="아직 메시지가 없습니다"
          onLoadPrevious={handleLoadPrevious}
          hasPrevious={hasNextPage}
          loadingPrevious={isFetchingNextPage}
          virtuosoRef={virtuosoRef}
          onAtBottomStateChange={setIsAtBottom}
          renderItem={(item, _index) => {
            const messageWithDate = {
              ...item,
              // React Query 형식 (sender 객체)
              userId: item.sender.id,
              userName: item.sender.name,
              userImage: item.sender.image,
              isMentor: item.sender.isMentor,
              timestamp:
                typeof item.createdAt === 'string'
                  ? new Date(item.createdAt)
                  : item.createdAt,
            };
            return (
              <div className="px-4 py-2">
                <ChatMessage
                  message={messageWithDate}
                  isCurrentUser={item.sender.id === currentUser.id}
                />
              </div>
            );
          }}
        />

        {/* 최신 메시지로 이동 버튼 (스크롤이 하단이 아닐 때 표시) */}
        {!isAtBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-all hover:bg-[var(--primary-dark)] hover:shadow-xl"
            aria-label="최신 메시지로 이동"
          >
            <FiArrowDown className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 메시지 입력 */}
      <div className="flex-shrink-0 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
