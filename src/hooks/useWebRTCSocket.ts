'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  image?: string;
  isMentor: boolean;
}

interface UseWebRTCSocketOptions {
  roomId: string;
  user: User;
  enabled?: boolean;
}

interface WebRTCUser {
  id: string;
  name: string;
  image?: string;
  isMentor: boolean;
  isStreamReady?: boolean;
}

export function useWebRTCSocket({
  roomId,
  user,
  enabled = true,
}: UseWebRTCSocketOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<WebRTCUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Cloudflare 터널 환경에서는 백엔드 터널 URL 사용
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // 소켓 연결
  useEffect(() => {
    if (!enabled || !roomId || !user.id) return;

    // webrtc namespace로 연결
    const newSocket = io(`${apiUrl}/webrtc`, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // 연결 이벤트
    newSocket.on('connect', () => {
      console.log('🔌 WebRTC Socket connected:', newSocket.id);
      setIsConnected(true);

      // 방 참여
      newSocket.emit('user_joined', {
        roomId,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
        isMentor: user.isMentor,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 WebRTC Socket disconnected');
      setIsConnected(false);
    });

    // 사용자 목록 업데이트
    newSocket.on('users_list', (usersList: WebRTCUser[]) => {
      console.log('👥 Users list received:', usersList);
      setUsers(usersList.filter(u => u.id !== user.id));
    });

    // 사용자 참여
    newSocket.on(
      'user_joined',
      (joinedUser: WebRTCUser & { socketId: string }) => {
        console.log('👤 User joined:', joinedUser);
        if (joinedUser.id !== user.id) {
          setUsers(prev => {
            const exists = prev.some(u => u.id === joinedUser.id);
            if (exists) return prev;
            return [
              ...prev,
              {
                id: joinedUser.id,
                name: joinedUser.name,
                image: joinedUser.image,
                isMentor: joinedUser.isMentor,
                isStreamReady: joinedUser.isStreamReady,
              },
            ];
          });
        }
      }
    );

    // 사용자 퇴장
    newSocket.on('user_left', (leftUser: { userId: string }) => {
      console.log('👋 User left:', leftUser);
      setUsers(prev => prev.filter(u => u.id !== leftUser.userId));
    });

    // 스트림 준비 완료
    newSocket.on(
      'stream_ready',
      (readyUser: { userId: string; userName: string }) => {
        console.log('📹 Stream ready:', readyUser);
        if (readyUser.userId !== user.id) {
          setUsers(prev =>
            prev.map(u =>
              u.id === readyUser.userId ? { ...u, isStreamReady: true } : u
            )
          );
        }
      }
    );

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('user_left', { roomId, userId: user.id });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [enabled, roomId, user.id, user.name, user.image, user.isMentor, apiUrl]);

  // 스트림 준비 알림
  const notifyStreamReady = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('stream_ready', { roomId, userId: user.id });
    }
  }, [socket, isConnected, roomId, user.id]);

  return {
    socket,
    users,
    isConnected,
    notifyStreamReady,
  };
}
