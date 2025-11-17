'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import ChatPanel from '@/components/chat/ChatPanel';
import MentoringRoomHeader from '@/components/video/MentoringRoomHeader';
import VideoGrid from '@/components/video/VideoGrid';

export default function MentoringRoomPage() {
  const params = useParams();
  const { data: session } = useSession();
  const roomId = params.roomId as string;

  const [isConnected, setIsConnected] = useState(false);
  const [_roomData, _setRoomData] = useState<unknown>(null);

  useEffect(() => {
    setIsConnected(true);
  }, [roomId]);

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-sm font-semibold text-[var(--text-sub)]">
            로그인이 필요합니다
          </h2>
          <p className="text-[var(--text-sub)]">
            멘토링 방에 참여하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 헤더 */}
      <MentoringRoomHeader />

      {/* 메인 컨텐츠 */}
      <div className="flex min-h-0 flex-1">
        {/* 좌측 화상채팅 영역 */}
        <div className="flex-1 bg-[var(--card-bg)]">
          <VideoGrid
            roomId={roomId}
            currentUser={{
              id: session.user.id,
              name: session.user.name,
              image: session.user.image || undefined,
              isMentor: false,
            }}
            isConnected={isConnected}
          />
        </div>

        {/* 우측 채팅 영역 */}
        <div className="w-96 border-l border-[var(--border-color)] bg-[var(--card-bg)]">
          <ChatPanel
            roomId={roomId}
            currentUser={{
              id: session.user.id,
              name: session.user.name,
              image: session.user.image || undefined,
              isMentor: false,
            }}
          />
        </div>
      </div>
    </>
  );
}
