'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';

import { useWebRTC } from '@/hooks/useWebRTC';
import { useWebRTCSocket } from '@/hooks/useWebRTCSocket';

import ScreenShareControls from './ScreenShareControls';
import ScreenShareIndicator from './ScreenShareIndicator';
import VideoTile from './VideoTile';

interface User {
  id: string;
  name: string;
  image?: string;
  isMentor?: boolean;
}

interface VideoGridProps {
  roomId: string;
  currentUser: User;
  isConnected: boolean;
}

export default function VideoGrid({
  roomId,
  currentUser,
  isConnected: _isConnected,
}: VideoGridProps) {
  const { data: session } = useSession();
  const { socket, users, notifyStreamReady } = useWebRTCSocket({
    roomId,
    user: {
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.image,
      isMentor: currentUser.isMentor || false,
    },
    enabled: !!session?.user,
  });
  const {
    localStream,
    remoteStreams,
    remoteTrackStates,
    isLoading,
    error,
    isScreenSharing,
    localVideoRef,
    initializeLocalStream,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC({
    roomId,
    userId: session?.user?.id || '',
    socket,
  });

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteScreenSharing, setRemoteScreenSharing] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  // Socket 기반 원격 사용자 트랙 상태
  const [remoteTrackStatesSocket, setRemoteTrackStatesSocket] = useState<
    Map<string, { isAudioEnabled: boolean; isVideoEnabled: boolean }>
  >(new Map());

  useEffect(() => {
    if (socket && session?.user) {
      initializeLocalStream().then(() => {
        // 스트림 준비 완료 알림
        notifyStreamReady();

        // 초기 트랙 상태 전송
        socket.emit('track_state_changed', {
          roomId,
          userId: session.user.id,
          isVideoEnabled: true,
          isAudioEnabled: true,
        });
      });
    }
  }, [socket, session, initializeLocalStream, notifyStreamReady, roomId]);

  // Socket 이벤트 리스너
  useEffect(() => {
    if (!socket) return;

    const handleScreenShareStarted = (data: {
      userId: string;
      userName: string;
    }) => {
      if (data.userId !== session?.user?.id) {
        setRemoteScreenSharing(data);
      }
    };

    const handleScreenShareStopped = (data: { userId: string }) => {
      if (data.userId !== session?.user?.id) {
        setRemoteScreenSharing(null);
      }
    };

    const handleTrackStateChanged = (data: {
      userId: string;
      isVideoEnabled: boolean;
      isAudioEnabled: boolean;
    }) => {
      console.debug('📻 Received track state change:', data);
      if (data.userId !== session?.user?.id) {
        setRemoteTrackStatesSocket(prev => {
          const newMap = new Map(prev);
          newMap.set(data.userId, {
            isAudioEnabled: data.isAudioEnabled,
            isVideoEnabled: data.isVideoEnabled,
          });
          return newMap;
        });
      }
    };

    socket.on('screen_share_started', handleScreenShareStarted);
    socket.on('screen_share_stopped', handleScreenShareStopped);
    socket.on('track_state_changed', handleTrackStateChanged);

    return () => {
      socket.off('screen_share_started', handleScreenShareStarted);
      socket.off('screen_share_stopped', handleScreenShareStopped);
      socket.off('track_state_changed', handleTrackStateChanged);
    };
  }, [socket, session?.user?.id]);

  const handleToggleVideo = () => {
    toggleVideo();
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);

    // Socket으로 비디오 상태 전송
    socket?.emit('track_state_changed', {
      roomId,
      userId: session?.user?.id,
      isVideoEnabled: newState,
      isAudioEnabled,
    });
  };

  const handleToggleAudio = () => {
    toggleAudio();
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);

    // Socket으로 오디오 상태 전송
    socket?.emit('track_state_changed', {
      roomId,
      userId: session?.user?.id,
      isVideoEnabled,
      isAudioEnabled: newState,
    });
  };

  const handleScreenShare = () => {
    // 브라우저가 자체 선택 UI를 제공하므로 바로 시작
    startScreenShare('screen');
  };

  const handleStopScreenShare = () => {
    stopScreenShare();
  };

  // 실제 연결된 사용자 목록 (remoteStreams 기준)
  const connectedUsers = Array.from(remoteStreams.keys()).map(userId => {
    const user = users.find(u => u.id === userId);
    // Socket 기반 상태 우선, 없으면 WebRTC track 상태 사용
    const socketState = remoteTrackStatesSocket.get(userId);
    const trackState = remoteTrackStates.get(userId);
    const finalState = socketState || trackState;
    console.debug('🎯 VideoGrid - Connected user state:', {
      userId,
      userName: user?.name || '상대방',
      socketState,
      trackState,
      finalState,
    });

    return {
      id: userId,
      name: user?.name || '상대방',
      image: user?.image,
      isMentor: user?.isMentor || false,
      isAudioEnabled: finalState?.isAudioEnabled ?? true,
      isVideoEnabled: finalState?.isVideoEnabled ?? true,
    };
  });
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary-sub02)] border-t-[var(--primary)]" />
          <p className="text-[var(--text-sub)]">
            화상 연결을 준비하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-[var(--color-danger)]">연결 오류</p>
          <p className="text-sm text-[var(--text-sub)]">{error}</p>
        </div>
      </div>
    );
  }

  // 화면공유 중인 사용자 확인
  const screenSharingUser = isScreenSharing
    ? currentUser
    : remoteScreenSharing
      ? connectedUsers.find(u => u.id === remoteScreenSharing.userId)
      : null;

  const screenSharingStream = isScreenSharing
    ? localStream
    : remoteScreenSharing
      ? (remoteStreams.get(remoteScreenSharing.userId) ?? null)
      : null;
  const screenSharingAudioEnabled = isScreenSharing
    ? isAudioEnabled
    : screenSharingUser &&
        'isAudioEnabled' in screenSharingUser &&
        typeof screenSharingUser.isAudioEnabled === 'boolean'
      ? screenSharingUser.isAudioEnabled
      : true;

  return (
    <div className="relative h-full p-4">
      {/* 화면공유가 있을 때의 레이아웃 */}
      {screenSharingUser ? (
        <div className="relative h-full">
          {/* 메인 화면공유 영역 */}
          <div className="h-full w-full overflow-hidden rounded-xl bg-black">
            <VideoTile
              stream={screenSharingStream}
              user={screenSharingUser}
              isLocal={isScreenSharing}
              isVideoEnabled={true}
              isAudioEnabled={screenSharingAudioEnabled}
              videoRef={
                isScreenSharing
                  ? (localVideoRef as React.RefObject<HTMLVideoElement>)
                  : undefined
              }
              isScreenSharing={true}
              isMainScreen={true}
            />
          </div>

          {/* 우측 하단 작은 비디오들 */}
          <div className="absolute right-4 bottom-4 flex max-w-xs flex-col gap-2">
            {/* 현재 사용자 (화면공유 중이 아닌 경우) */}
            {!isScreenSharing && (
              <div className="h-36 w-48">
                <VideoTile
                  stream={localStream}
                  user={currentUser}
                  isLocal={true}
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  videoRef={localVideoRef as React.RefObject<HTMLVideoElement>}
                  isScreenSharing={false}
                  isSmall={true}
                />
              </div>
            )}

            {/* 다른 사용자들 */}
            {connectedUsers
              .filter(user => user.id !== remoteScreenSharing?.userId)
              .map(user => (
                <div key={user.id} className="h-36 w-48">
                  <VideoTile
                    stream={remoteStreams.get(user.id) || null}
                    user={user}
                    isLocal={false}
                    isVideoEnabled={user.isVideoEnabled}
                    isAudioEnabled={user.isAudioEnabled}
                    isScreenSharing={false}
                    isSmall={true}
                  />
                </div>
              ))}
          </div>
        </div>
      ) : (
        /* 일반 그리드 레이아웃 (화면공유 없을 때) */
        <div className="grid h-full grid-cols-2 gap-4">
          {/* 현재 사용자  */}
          <VideoTile
            stream={localStream}
            user={currentUser}
            isLocal={true}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            videoRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            isScreenSharing={false}
          />

          {/* 연결된 모든 사용자 (상대방) */}
          {connectedUsers.length > 0 ? (
            connectedUsers.map(user => (
              <VideoTile
                key={user.id}
                stream={remoteStreams.get(user.id) || null}
                user={user}
                isLocal={false}
                isVideoEnabled={user.isVideoEnabled}
                isAudioEnabled={user.isAudioEnabled}
                isScreenSharing={false}
              />
            ))
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-[var(--card-bg-sub)]">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary-sub02)] border-t-[var(--primary)]" />
                <p className="mb-2 font-semibold text-[var(--text)]">
                  상대방을 기다리는 중...
                </p>
                <p className="text-sm text-[var(--text-sub)]">
                  상대방이 입장하면 화상 연결이 시작됩니다
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 컨트롤 버튼들 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
        <div className="flex items-center gap-3 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)]/90 px-4 py-2 shadow-lg backdrop-blur-sm">
          {/* 비디오 토글 */}
          <button
            onClick={handleToggleVideo}
            className={`rounded-full p-2 transition-all ${
              isVideoEnabled
                ? 'bg-[var(--card-bg-sub)] text-[var(--text)] hover:bg-[var(--hover-bg)]'
                : 'bg-[var(--color-danger)] text-white hover:bg-red-600'
            }`}
          >
            {isVideoEnabled ? (
              <FiVideo className="h-4 w-4" />
            ) : (
              <FiVideoOff className="h-4 w-4" />
            )}
          </button>

          {/* 오디오 토글 */}
          <button
            onClick={handleToggleAudio}
            className={`rounded-full p-2 transition-all ${
              isAudioEnabled
                ? 'bg-[var(--card-bg-sub)] text-[var(--text)] hover:bg-[var(--hover-bg)]'
                : 'bg-[var(--color-danger)] text-white hover:bg-red-600'
            }`}
          >
            {isAudioEnabled ? (
              <FiMic className="h-4 w-4" />
            ) : (
              <FiMicOff className="h-4 w-4" />
            )}
          </button>

          {/* 화면 공유 컨트롤 */}
          <ScreenShareControls
            isSharing={isScreenSharing}
            onStartShare={handleScreenShare}
            onStopShare={handleStopScreenShare}
          />
        </div>
      </div>

      {/* 화면 공유 상태 표시기 */}
      {remoteScreenSharing && (
        <ScreenShareIndicator
          isSharing={!!remoteScreenSharing}
          onStopShare={() => setRemoteScreenSharing(null)}
          userName={remoteScreenSharing.userName}
        />
      )}
    </div>
  );
}
