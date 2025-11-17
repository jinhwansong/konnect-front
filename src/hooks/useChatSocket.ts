import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

import type {
  ChatMessage,
  ChatUser,
  UserConnectedEvent,
  UserDisconnectedEvent,
  JoinSuccessEvent,
  JoinDeniedEvent,
} from '@/types/chat';

interface UseChatSocketOptions {
  roomId: string;
  user: {
    id: string;
    name: string;
    image?: string;
    isMentor: boolean;
  };
  enabled?: boolean;
  mode?: 'general' | 'reservation'; // 일반 채팅(realtime/chat) or 예약 기반 채팅(chat)
  onJoinSuccess?: (data: JoinSuccessEvent) => void;
  onJoinDenied?: (data: JoinDeniedEvent) => void;
  onUserJoined?: (data: UserConnectedEvent) => void;
  onUserLeft?: (data: UserDisconnectedEvent) => void;
  onNewMessage?: (message: ChatMessage) => void;
  onUsersListUpdate?: (users: ChatUser[]) => void;
  onMessagesHistory?: (messages: ChatMessage[]) => void;
}

export function useChatSocket(options: UseChatSocketOptions) {
  const {
    roomId,
    user,
    enabled = true,
    mode = 'general',
    onJoinSuccess,
    onJoinDenied,
    onUserJoined,
    onUserLeft,
    onNewMessage,
    onUsersListUpdate,
    onMessagesHistory,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken;

  // 메시지 전송
  const sendMessage = useCallback(
    (
      message: string,
      type: 'text' | 'file' = 'text',
      fileUrl?: string,
      fileName?: string
    ) => {
      if (!socketRef.current || !isJoined) {
        // console.warn(
        //   '⚠️ [채팅] 메시지를 보낼 수 없습니다 (연결 안 됨 또는 방 미입장)'
        // );
        return;
      }

      const payload = {
        roomId,
        message,
        type,
        fileUrl,
        fileName,
      };

      socketRef.current.emit('new_message', payload);
      console.log('💬 [채팅] 메시지 전송:', payload);
    },
    [roomId, isJoined]
  );

  // 방 퇴장
  const leaveRoom = useCallback(() => {
    if (!socketRef.current) return;

    // 모드에 따라 다른 이벤트 발송
    if (mode === 'reservation') {
      socketRef.current.emit('leave_room', {
        roomId,
        userId: user.id,
      });
    } else {
      socketRef.current.emit('user_disconnected', { roomId });
    }
    //  console.log('👋 [채팅] 방 퇴장 요청:', roomId);

    setIsJoined(false);
  }, [roomId, user.id, mode]);

  // 재연결
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  // 소켓 연결 및 초기화
  useEffect(() => {
    if (!enabled || !roomId || !user.id) return;

    if (!token) {
      setError('인증 토큰이 없습니다.');
      return;
    }

    // Cloudflare 터널 환경에서는 백엔드 터널 URL 사용
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // 소켓 연결 생성
    const socket = io(`${apiUrl}/chat`, {
      auth: {
        token,
      },
      withCredentials: true,
      transports: ['polling', 'websocket'], // Cloudflare에서는 폴링 우선
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // 연결 성공 시
    socket.on('connect', () => {
      //   console.log('✅ [채팅] 소켓 연결 성공:', socket.id);
      setIsConnected(true);
      setError(null);

      // 모드에 따라 다른 방식으로 방 입장
      if (mode === 'reservation') {
        // 예약 기반 채팅: join_room 이벤트 사용 (JWT 검증)
        socket.emit('join_room', {
          roomId,
          userId: user.id,
          token,
        });
        console.log('🚪 [예약 채팅] 방 입장 요청 전송 (JWT 검증):', roomId);
      } else {
        // 일반 채팅: user_connected 이벤트 사용 (JWT로 사용자 정보 조회)
        socket.emit('user_connected', { roomId });
        // console.log('🚪 [일반 채팅] 방 입장 요청 전송 (JWT 검증):', roomId);
      }
    });

    // 연결 해제
    socket.on('disconnect', reason => {
      console.log('❌ [채팅] 연결 해제:', reason);
      setIsConnected(false);
      setIsJoined(false);
    });

    // 연결 에러
    socket.on('connect_error', err => {
      //   console.error('⚠️ [채팅] 연결 에러:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    // 방 입장 성공 (예약 모드)
    socket.on('join_success', (data: JoinSuccessEvent) => {
      //  console.log('🎉 [예약 채팅] 방 입장 성공:', data);
      setIsJoined(true);
      setError(null);
      onJoinSuccess?.(data);
    });

    // 방 입장 거절 (예약 모드)
    socket.on('join_denied', (data: JoinDeniedEvent) => {
      const errorMessages: Record<string, string> = {
        INVALID_TOKEN: '인증 토큰이 유효하지 않습니다.',
        RESERVATION_NOT_FOUND: '예약을 찾을 수 없습니다.',
        NOT_IN_TIME_WINDOW: '예약 시간이 아닙니다.',
        NOT_PARTICIPANT: '이 채팅방의 참가자가 아닙니다.',
        SERVER_ERROR: '서버 오류가 발생했습니다.',
      };
      const errorMsg =
        errorMessages[data.reason] || `입장 거부: ${data.reason}`;
      //  console.warn('🚫 [예약 채팅] 방 입장 거절:', data.reason);
      setError(errorMsg);
      setIsJoined(false);
      onJoinDenied?.(data);
    });

    // 사용자 입장 알림 (예약 모드)
    socket.on('user_joined', data => {
      //   console.log(`🙋‍♀️ [예약 채팅] ${data.userId}님이 입장했습니다.`);
      onUserJoined?.(data);
    });

    // 사용자 퇴장 알림 (예약 모드)
    socket.on('user_left', data => {
      //     console.log(`👋 [예약 채팅] ${data.userId}님이 퇴장했습니다.`);
      onUserLeft?.(data);
    });

    // 사용자 목록 수신 (일반 모드)
    socket.on('users_list', (usersList: ChatUser[]) => {
      // console.log('👥 [일반 채팅] 사용자 목록:', usersList.length, '명');
      setUsers(usersList);
      setIsJoined(true); // 사용자 목록을 받으면 입장 성공으로 간주
      onUsersListUpdate?.(usersList);
    });

    // 메시지 기록 수신 (일반 모드)
    socket.on('messages_history', (messagesList: ChatMessage[]) => {
      // console.log('📜 [일반 채팅] 메시지 기록:', messagesList.length, '개');
      setMessages(messagesList);
      onMessagesHistory?.(messagesList);
    });

    // 사용자 입장 알림 (일반 모드)
    socket.on('user_connected', (data: UserConnectedEvent) => {
      // console.log('🙋 [일반 채팅] 사용자 입장:', data.userName);
      setUsers(prev => {
        const exists = prev.some(u => u.id === data.userId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: data.userId,
            name: data.userName,
            image: data.userImage,
            isMentor: data.isMentor,
            isConnected: true,
          },
        ];
      });
      onUserJoined?.(data);
    });

    // 사용자 퇴장 알림 (일반 모드)
    socket.on('user_disconnected', (data: UserDisconnectedEvent) => {
      // console.log('👋 [일반 채팅] 사용자 퇴장:', data.userName);
      setUsers(prev => prev.filter(u => u.id !== data.userId));
      onUserLeft?.(data);
    });

    // 새 메시지 수신 (공통)
    socket.on('new_message', (message: ChatMessage) => {
      // console.log(
      //   '💬 [채팅] 새 메시지:',
      //   message.sender.name,
      //   '-',
      //   message.message
      // );
      setMessages(prev => [...prev, message]);
      onNewMessage?.(message);
    });

    // 정리 (컴포넌트 언마운트 시)
    return () => {
      // console.log('🧹 [채팅] 소켓 연결 정리 중...');

      // 연결 해제 전에 방 퇴장
      if (socket.connected) {
        if (mode === 'reservation') {
          socket.emit('leave_room', {
            roomId,
            userId: user.id,
          });
        } else {
          socket.emit('user_disconnected', {
            roomId,
            userId: user.id,
          });
        }
      }

      // 모든 이벤트 리스너 제거
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('join_success');
      socket.off('join_denied');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('users_list');
      socket.off('messages_history');
      socket.off('user_connected');
      socket.off('user_disconnected');
      socket.off('new_message');

      socket.disconnect();
      socketRef.current = null;
      console.log('✅ [채팅] 소켓 연결 정리 완료');
    };
  }, [
    enabled,
    roomId,
    user.id,
    user.name,
    user.image,
    user.isMentor,
    mode,
    token,
    onJoinSuccess,
    onJoinDenied,
    onUserJoined,
    onUserLeft,
    onNewMessage,
    onUsersListUpdate,
    onMessagesHistory,
  ]);

  return {
    isConnected,
    isJoined,
    messages,
    users,
    error,
    sendMessage,
    leaveRoom,
    reconnect,
    socket: socketRef.current,
  };
}
