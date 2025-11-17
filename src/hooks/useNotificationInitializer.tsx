'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useFirebase } from '@/hooks/useFirebase';

export default function useNotificationInitializer() {
  const { data: session } = useSession();
  const userId = session?.user?.id; // 로그인된 유저 id
  const { requestToken } = useFirebase(userId);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!userId) return;

    // 이미 허용(granted)이면 여기서 굳이 requestToken() 안 호출
    //    → useFirebase 안의 "자동 등록 useEffect"가 토큰 서버 등록을 담당
    if (Notification.permission !== 'default') return;

    // 아직 허용/차단 선택 안 했을 때만 권한 + 토큰 요청
    requestToken();
  }, [userId, requestToken]);

  return null;
}
