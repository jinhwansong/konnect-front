'use client';
import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import {
  getNotification,
  useAsRead,
  useAsReadAll,
  useAsRemove,
  useAsRemoveAll,
} from '@/app/_lib/useUser';
import { INoti } from '@/type';

// 중요 메시지는 브라우저 알람 추가
export const getNotiMessageType = (message: string): boolean => {
  const importantKeywords = ['10분', '승인', '거절', '리뷰', '신청'];
  return importantKeywords.some((keyword) => message.includes(keyword));
};

// 알람데이터 만들기
const useNoti = () => {
  const queryclient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  // 알람조회
  const { data: notification } = useQuery({
    queryKey: ['noti'],
    queryFn: () => getNotification(),
    refetchInterval: 3 * 60 * 1000,
  });
  // 알림 읽음 처리
  const notiRead = useAsRead();
  const onNotiRead = useCallback(
    (id: number, isRead: boolean) => {
      if (!isRead) {
        notiRead.mutate(id, {
          onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['noti'] });
          },
        });
      }
    },
    [notiRead, queryclient]
  );
  // 전체 알림 읽음 처리
  const notiReadAll = useAsReadAll();
  const onNotiReadAll = useCallback(
    () => {
      notiReadAll.mutate(undefined, {
        onSuccess: () => {
          queryclient.invalidateQueries({ queryKey: ['noti'] });
        },
      });
    },
    [notiReadAll, queryclient]
  );
  // 알림 삭제 처리
  const notiRemove = useAsRemove();
  const onNotiRemove = useCallback(
    (id: number) => {
      notiRemove.mutate(id, {
        onSuccess: () => {
          queryclient.invalidateQueries({ queryKey: ['noti'] });
        },
      });
    },
    [notiRemove, queryclient]
  );
  // 전체 알림 삭제 처리
  const notiRemoveAll = useAsRemoveAll();
  const onNotiRemoveAll = useCallback(() => {
    notiRemoveAll.mutate(undefined, {
      onSuccess: () => {
        queryclient.invalidateQueries({ queryKey: ['noti'] });
      },
    });
  }, [notiRemoveAll, queryclient]);
  // 알람 권한 요청
  const requestNoti = useCallback(async () => {
    if (Notification.permission === 'granted') return true;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('알림 권한 요청 실패', error);
      }
      return false;
    }
  }, []);
  // 브라우저 알림 처리
  const browserNoti = useCallback(async (newNoti: INoti) => {
    if (
      getNotiMessageType(newNoti.message) &&
      Notification.permission === 'granted'
    ) {
      new Notification('멘토링 알람', {
        body: newNoti.message,
        icon: '/frontend/public/favicon.svg',
      });
    }
  }, []);
  // 소캣 연결 해봅시다.
  useEffect(() => {
    // 브라우저 알림 권한 요청
    requestNoti();
    // 소캣연결
    const connectSocket = () => {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/noti`, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 2,
        reconnectionDelay: 1000,
      });
      newSocket.on('connect', () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('알림 소켓 연결 성공');
        }
        setError(null);
      });
      newSocket.on('disconnect', () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('알림 소켓 연결 해제');
        }
      });
      // 알림 오류
      newSocket.on('error', (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('알림 소켓 연결 해제 오류:', error);
        }
        setError(error.message);
      });
      // 알람 수신 처리
      newSocket.on('noti', (newNoti: INoti) => {
        // 중요메시지 브라우저 알림 표시
        browserNoti(newNoti);
        // 알림 데이터 갱신
        queryclient.invalidateQueries({ queryKey: ['noti'] });
      });
      return newSocket;
    };
    const socketInstance = connectSocket();
    // 클린업 함수
    return () => {
      socketInstance.disconnect();
    };
  }, [queryclient, browserNoti, requestNoti]);

  // 알림 목록 데이터
  const notifications = notification?.item || [];
  return {
    notifications,
    onNotiRead,
    onNotiReadAll,
    onNotiRemove,
    onNotiRemoveAll,
  };
};

export default useNoti;
