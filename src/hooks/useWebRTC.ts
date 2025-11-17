'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SimplePeer, { SignalData } from 'simple-peer';
import { Socket } from 'socket.io-client';

interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  socket: Socket | null; // 소켓은 초기에는 null일 수 있음
}

interface WebRTCUser {
  id: string;
  name: string;
  image?: string;
  isMentor: boolean;
  stream?: MediaStream;
}

interface WebRTCSignalPayload {
  roomId: string;
  userId: string;
  targetUserId: string;
  signal: SignalData;
  type: 'offer' | 'answer' | 'ice_candidate';
}

// 화면 공유 제약 조건 타입 (DOM lib 일부 환경 호환)
type DisplaySurfaceType =
  | 'browser'
  | 'window'
  | 'application'
  | 'monitor'
  | 'screen'
  | 'tab';
type DisplayMediaConstraints = {
  video:
    | boolean
    | (MediaTrackConstraints & { displaySurface?: DisplaySurfaceType });
  audio?: boolean | MediaTrackConstraints;
};

interface RemoteTrackState {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

export const useWebRTC = ({ roomId, userId, socket }: UseWebRTCOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [remoteTrackStates, setRemoteTrackStates] = useState<
    Map<string, RemoteTrackState>
  >(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [originalStream, setOriginalStream] = useState<MediaStream | null>(
    null
  );

  type PeerInstance = SimplePeer.Instance;
  const peersRef = useRef<Map<string, PeerInstance>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // 로컬 스트림 초기화
  const initializeLocalStream = useCallback(async (audioDeviceId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(
        '🎥 Initializing local stream...',
        audioDeviceId ? `with device: ${audioDeviceId}` : 'default device'
      );

      const audioConstraints = audioDeviceId
        ? {
            deviceId: { exact: audioDeviceId },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          };

      let stream: MediaStream | null = null;

      // 먼저 비디오 + 오디오 시도
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: audioConstraints,
        });
        console.log('✅ Video + Audio stream initialized');
      } catch (videoError) {
        console.warn('⚠️ Video failed, trying audio only:', videoError);

        // 비디오 실패 시 오디오만 시도
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints,
          });
          console.log('✅ Audio-only stream initialized');
          setError('카메라를 사용할 수 없습니다. 오디오만으로 연결합니다.');
        } catch (audioError) {
          console.error('❌ Audio also failed:', audioError);
          throw audioError;
        }
      }

      if (stream) {
        console.log('Stream tracks:', {
          video: stream.getVideoTracks().length,
          audio: stream.getAudioTracks().length,
        });

        console.log(
          'Audio tracks:',
          stream.getAudioTracks().map(t => ({
            id: t.id,
            label: t.label,
            enabled: t.enabled,
            settings: t.getSettings(),
          }))
        );

        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 기존 peer들에게 새 트랙 전달 (마이크 변경 시)
        if (peersRef.current.size > 0) {
          console.log(
            `🔄 Updating tracks for ${peersRef.current.size} existing peers`
          );
          peersRef.current.forEach((peer, targetUserId) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const peerConnection = (peer as any)._pc;

            if (peerConnection) {
              const videoTrack = stream.getVideoTracks()[0];
              const audioTrack = stream.getAudioTracks()[0];

              if (videoTrack) {
                const videoSender = peerConnection
                  .getSenders()
                  .find((s: RTCRtpSender) => s.track?.kind === 'video');
                if (videoSender) {
                  videoSender
                    .replaceTrack(videoTrack)
                    .then(() =>
                      console.log(`✅ Video track replaced for ${targetUserId}`)
                    )
                    .catch((err: Error) =>
                      console.error(`❌ Failed to replace video track:`, err)
                    );
                }
              }

              if (audioTrack) {
                const audioSender = peerConnection
                  .getSenders()
                  .find((s: RTCRtpSender) => s.track?.kind === 'audio');
                if (audioSender) {
                  audioSender
                    .replaceTrack(audioTrack)
                    .then(() =>
                      console.log(`✅ Audio track replaced for ${targetUserId}`)
                    )
                    .catch((err: Error) =>
                      console.error(`❌ Failed to replace audio track:`, err)
                    );
                }
              }
            }
          });
        }
      }

      // 스트림 준비 완료 알림은 VideoGrid에서 처리
    } catch (err) {
      console.error('❌ Error accessing media devices:', err);
      setError('카메라와 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Peer 연결 생성
  const createPeer = useCallback(
    (targetUserId: string, isInitiator: boolean): PeerInstance => {
      console.log(
        `🔗 Creating peer for ${targetUserId}, initiator: ${isInitiator}`
      );

      const peer = new SimplePeer({
        initiator: isInitiator,
        trickle: true, // true로 변경하여 ICE candidate를 즉시 전송
        stream: localStream || undefined,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: ['turn:openrelay.metered.ca:80'],
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
          ],
          iceCandidatePoolSize: 10, // ICE candidate 풀 크기 증가
        },
        // 연결 안정성을 위한 추가 설정
        objectMode: false,
        channelConfig: {
          ordered: false, // 순서 보장 비활성화로 성능 향상
          maxRetransmits: 0, // 재전송 비활성화
        },
      });
      peer.on('iceStateChange', state => {
        console.log('ICE state:', state);
      });
      peer.on('signal', (signal: SignalData) => {
        console.log(`📡 Sending signal to ${targetUserId}:`, signal.type);
        if ('candidate' in signal && signal.candidate)
          console.log('ICE candidate:', signal.candidate);

        const payload: WebRTCSignalPayload = {
          roomId,
          userId,
          targetUserId,
          signal,
          type:
            signal.type === 'offer'
              ? 'offer'
              : signal.type === 'answer'
                ? 'answer'
                : 'ice_candidate',
        };
        socket?.emit('webrtc_signal', payload);
      });

      peer.on('stream', (stream: MediaStream) => {
        console.log(`📹 Received stream from ${targetUserId}`);
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        console.log(`Stream tracks:`, {
          video: stream.getVideoTracks().length,
          audio: stream.getAudioTracks().length,
          audioEnabled: audioTrack?.enabled,
          videoEnabled: videoTrack?.enabled,
        });

        // 초기 트랙 상태 저장
        setRemoteTrackStates(
          prev =>
            new Map(
              prev.set(targetUserId, {
                isAudioEnabled: audioTrack?.enabled ?? false,
                isVideoEnabled: videoTrack?.enabled ?? false,
              })
            )
        );

        // 트랙 상태 변경 리스너 추가
        stream.getTracks().forEach(track => {
          track.onended = () => {
            console.log(`🔇 Track ended for ${targetUserId}:`, track.kind);
          };
          track.onmute = () => {
            console.log(`🔇 Track muted for ${targetUserId}:`, track.kind);
          };
          track.onunmute = () => {
            console.log(`🔊 Track unmuted for ${targetUserId}:`, track.kind);
          };
        });

        setRemoteStreams(prev => new Map(prev.set(targetUserId, stream)));
      });

      peer.on('connect', () => {
        console.log(`✅ Peer connected: ${targetUserId}`);
        setIsConnected(true);
      });

      peer.on('error', (err: Error) => {
        console.error(`❌ Peer error (${targetUserId}):`, err);
        setError(`연결 오류: ${err.message}`);
      });

      peer.on('close', () => {
        console.log(`👋 Peer disconnected: ${targetUserId}`);
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(targetUserId);
          return newMap;
        });
        setRemoteTrackStates(prev => {
          const newMap = new Map(prev);
          newMap.delete(targetUserId);
          return newMap;
        });
        peersRef.current.delete(targetUserId);
      });

      return peer;
    },
    [localStream, roomId, userId, socket]
  );

  // WebRTC 시그널 처리
  const handleWebRTCSignal = useCallback(
    (data: WebRTCSignalPayload & { userId: string }) => {
      const senderId = data.userId; // 보낸 사람
      const { signal, type } = data;

      console.log(`📥 Received ${type} from ${senderId}`);

      if (senderId === userId) return; // 자신이 보낸 신호는 무시

      const existingPeer = peersRef.current.get(senderId);

      if (type === 'offer') {
        console.log(`🤝 Handling offer from ${senderId}`);
        // Offer를 받으면 answer를 보낼 Peer 생성
        if (existingPeer) {
          existingPeer.destroy();
        }
        const newPeer = createPeer(senderId, false);
        newPeer.signal(signal);
        peersRef.current.set(senderId, newPeer);
      } else if (type === 'answer' && existingPeer) {
        console.log(`✅ Handling answer from ${senderId}`);
        existingPeer.signal(signal);
      } else if (type === 'ice_candidate' && existingPeer) {
        console.log(`🧊 Handling ICE candidate from ${senderId}`);
        try {
          existingPeer.signal(signal);
        } catch (err) {
          console.warn('Failed to add ICE candidate:', err);
        }
      }
    },
    [userId, createPeer]
  );

  // 사용자 참여 처리
  const handleUserJoined = useCallback(
    (userData: WebRTCUser) => {
      console.log(`👤 User joined:`, userData);
      if (userData.id === userId) return;

      // 이미 연결 시도 중이면 무시
      if (peersRef.current.has(userData.id)) {
        console.log(`⚠️ Already have peer for ${userData.id}`);
        return;
      }

      // 로컬 스트림이 준비된 경우에만 연결 시도
      if (localStream) {
        // userId 비교로 initiator 결정 (문자열 비교로 일관성 보장)
        const shouldInitiate = userId < userData.id;
        console.log(
          `🔗 ${shouldInitiate ? 'Initiating' : 'Waiting for'} connection to ${userData.id} (my ID: ${userId})`
        );

        if (shouldInitiate) {
          const peer = createPeer(userData.id, true);
          peersRef.current.set(userData.id, peer);
        }
      } else {
        console.log(`⏳ Waiting for local stream to connect to ${userData.id}`);
      }
    },
    [userId, localStream, createPeer]
  );

  // 사용자 나가기 처리
  const handleUserLeft = useCallback((leftUserId: string) => {
    const peer = peersRef.current.get(leftUserId);
    if (peer) {
      peer.destroy();
      peersRef.current.delete(leftUserId);
    }

    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(leftUserId);
      return newMap;
    });

    setRemoteTrackStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(leftUserId);
      return newMap;
    });
  }, []);

  // 원격 스트림의 트랙 상태를 주기적으로 업데이트 (500ms마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (remoteStreams.size > 0) {
        setRemoteTrackStates(prev => {
          const newMap = new Map(prev);
          let hasChanges = false;

          remoteStreams.forEach((stream, userId) => {
            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = stream.getVideoTracks()[0];
            const currentState = prev.get(userId);
            const newState = {
              isAudioEnabled: audioTrack?.enabled ?? false,
              isVideoEnabled: videoTrack?.enabled ?? false,
            };

            // 상태가 변경된 경우에만 업데이트
            if (
              !currentState ||
              currentState.isAudioEnabled !== newState.isAudioEnabled ||
              currentState.isVideoEnabled !== newState.isVideoEnabled
            ) {
              newMap.set(userId, newState);
              hasChanges = true;
              console.log(`🔄 Track state changed for ${userId}:`, newState);
            }
          });

          return hasChanges ? newMap : prev;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [remoteStreams]);

  // Socket 이벤트 리스너 등록
  useEffect(() => {
    if (!socket) return;

    // stream_ready 이벤트 핸들러 (백엔드에서 userId로 보냄 → id로 변환)
    const handleStreamReady = (data: {
      userId: string;
      userName: string;
      socketId: string;
    }) => {
      console.log('📹 Stream ready event:', data);
      handleUserJoined({
        id: data.userId, // ✅ userId → id 변환
        name: data.userName,
        isMentor: false,
      });
    };

    // user_joined 이벤트 핸들러 (백엔드에서 userId로 보냄 → id로 변환)
    const handleUserJoinedEvent = (data: {
      userId: string;
      userName: string;
      userImage?: string;
      isMentor?: boolean;
      socketId: string;
    }) => {
      console.log('👤 User joined event:', data);
      handleUserJoined({
        id: data.userId, // ✅ userId → id 변환
        name: data.userName,
        image: data.userImage,
        isMentor: data.isMentor ?? false,
      });
    };

    socket.on('webrtc_signal', handleWebRTCSignal);
    socket.on('user_joined', handleUserJoinedEvent);
    socket.on('user_left', handleUserLeft);
    socket.on('stream_ready', handleStreamReady);

    return () => {
      socket.off('webrtc_signal', handleWebRTCSignal);
      socket.off('user_joined', handleUserJoinedEvent);
      socket.off('user_left', handleUserLeft);
      socket.off('stream_ready', handleStreamReady);
    };
  }, [socket, handleWebRTCSignal, handleUserJoined, handleUserLeft]);

  // 언마운트 시 정리
  useEffect(() => {
    const currentPeers = peersRef.current;
    const currentStream = localStream;

    return () => {
      currentPeers.forEach(peer => peer.destroy());
      currentPeers.clear();
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, [localStream]);

  // 비디오/오디오 토글
  const toggleVideo = useCallback(() => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
  }, [localStream]);

  // 화면 공유 중지
  const stopScreenShare = useCallback(async () => {
    try {
      if (!originalStream) {
        console.warn('⚠️ No original stream to restore');
        return;
      }

      // 화면공유 상태를 먼저 false로 설정
      setIsScreenSharing(false);

      // 현재 화면 공유 스트림 정지
      if (localStream) {
        console.log('🛑 Stopping screen share tracks');
        localStream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped track: ${track.kind}`);
        });
      }

      // 원래 스트림으로 복원
      console.log('🔄 Restoring original camera stream');
      setLocalStream(originalStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = originalStream;
      }

      // 모든 Peer에 원래 스트림으로 복원 (안정적인 방식)
      const restoreTracksForPeer = async (peer: any, userId: string) => {
        const videoTrack = originalStream.getVideoTracks()[0];
        const audioTrack = originalStream.getAudioTracks()[0];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const peerConnection = (peer as any)._pc;

        if (!peerConnection) {
          console.warn(`⚠️ No peer connection for ${userId}`);
          return;
        }

        // 연결 상태 확인 (더 엄격한 검사)
        if (
          peerConnection.connectionState === 'closed' ||
          peerConnection.connectionState === 'failed' ||
          peerConnection.connectionState === 'disconnected'
        ) {
          console.warn(
            `⚠️ Peer connection is ${peerConnection.connectionState} for ${userId}, skipping track restoration`
          );
          return;
        }

        // 연결이 아직 설정 중인 경우 잠시 대기
        if (peerConnection.connectionState === 'connecting') {
          console.log(
            `⏳ Peer connection is connecting for ${userId}, waiting...`
          );
          await new Promise(resolve => setTimeout(resolve, 200));

          // 다시 확인
          const stateAfterWait: RTCPeerConnectionState =
            peerConnection.connectionState;
          if (stateAfterWait !== 'connected') {
            console.warn(
              `⚠️ Peer connection still not connected for ${userId}, skipping`
            );
            return;
          }
        }

        console.log(`🔄 Restoring tracks for peer: ${userId}`);

        try {
          if (videoTrack) {
            const videoSender = peerConnection
              .getSenders()
              .find((s: RTCRtpSender) => s.track?.kind === 'video');
            if (videoSender) {
              await videoSender.replaceTrack(videoTrack);
              console.log(`✅ Video track restored for ${userId}`);
            }
          }

          if (audioTrack) {
            const audioSender = peerConnection
              .getSenders()
              .find((s: RTCRtpSender) => s.track?.kind === 'audio');
            if (audioSender) {
              await audioSender.replaceTrack(audioTrack);
              console.log(`✅ Audio track restored for ${userId}`);
            }
          }

          console.log(
            `📊 Connection state after track restoration: ${peerConnection.connectionState}`
          );
        } catch (error) {
          console.error(`❌ Failed to restore tracks for ${userId}:`, error);
        }
      };

      // 각 peer에 대해 순차적으로 트랙 복원
      const restoreTracksSequentially = async () => {
        for (const [userId, peer] of peersRef.current.entries()) {
          await restoreTracksForPeer(peer, userId);
          // 각 peer 사이에 약간의 지연
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };

      // 트랙 복원 실행 (에러가 발생해도 계속 진행)
      try {
        await restoreTracksSequentially();

        // 화면공유 중지 후 재협상 트리거
        for (const [targetUserId, peer] of peersRef.current.entries()) {
          try {
            console.log(
              `📡 Triggering renegotiation after restore with ${targetUserId}`
            );

            // SimplePeer의 renegotiate 메서드 사용
            if (typeof (peer as any).renegotiate === 'function') {
              (peer as any).renegotiate();
              console.log(
                `✅ Restore renegotiation triggered for ${targetUserId}`
              );
            } else {
              // fallback: 직접 offer 생성
              const pc: RTCPeerConnection | undefined = (peer as any)?._pc;
              if (pc && pc.connectionState === 'connected') {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const payload: WebRTCSignalPayload = {
                  roomId,
                  userId,
                  targetUserId,
                  signal: offer as unknown as SignalData,
                  type: 'offer',
                };

                socket?.emit('webrtc_signal', payload);
                console.log(
                  `✅ Fallback restore renegotiation sent for ${targetUserId}`
                );
              }
            }
          } catch (err) {
            console.error(
              `❌ Restore renegotiation failed for ${targetUserId}:`,
              err
            );
          }
        }
      } catch (error) {
        console.error('❌ Error during track restoration:', error);
      }

      // 소켓으로 화면 공유 중지 상태 전송
      socket?.emit('screen_share_stopped', { roomId, userId });
      console.log('✅ Screen share stopped successfully');

      setOriginalStream(null);
    } catch (err) {
      console.error('❌ Error stopping screen share:', err);
      setError('화면 공유를 중지할 수 없습니다.');
    }
  }, [originalStream, localStream, roomId, userId, socket]);

  // 화면 공유 시작
  const startScreenShare = useCallback(
    async (_source: 'screen' | 'window' | 'tab' = 'screen') => {
      try {
        setIsLoading(true);

        // 현재 스트림 저장 (복원용)
        if (localStream && !isScreenSharing) {
          setOriginalStream(localStream);
        }

        // 브라우저가 자체 선택 UI를 제공하므로 displaySurface는 무시
        const constraints: DisplayMediaConstraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: true,
        };

        const screenStream = await navigator.mediaDevices.getDisplayMedia(
          constraints as MediaStreamConstraints
        );

        console.log('📺 Screen share stream created:', {
          videoTracks: screenStream.getVideoTracks().length,
          audioTracks: screenStream.getAudioTracks().length,
          videoTrack: screenStream.getVideoTracks()[0]?.getSettings(),
        });

        setLocalStream(screenStream);
        setIsScreenSharing(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // 모든 Peer에 새 스트림 전송 (더 안정적인 방식)
        const replaceTracksForPeer = async (
          peer: any,
          targetUserId: string
        ) => {
          const videoTrack = screenStream.getVideoTracks()[0];
          const audioTrack = screenStream.getAudioTracks()[0];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const peerConnection = (peer as any)._pc;

          if (!peerConnection) {
            console.warn(`⚠️ No peer connection for ${targetUserId}`);
            return;
          }

          // 연결 상태 확인 (더 엄격한 검사)
          if (
            peerConnection.connectionState === 'closed' ||
            peerConnection.connectionState === 'failed' ||
            peerConnection.connectionState === 'disconnected'
          ) {
            console.warn(
              `⚠️ Peer connection is ${peerConnection.connectionState} for ${targetUserId}, skipping track replacement`
            );
            return;
          }

          // 연결이 아직 설정 중인 경우 잠시 대기
          if (peerConnection.connectionState === 'connecting') {
            console.log(
              `⏳ Peer connection is connecting for ${targetUserId}, waiting...`
            );
            await new Promise(resolve => setTimeout(resolve, 300));

            // 다시 확인
            if (
              peerConnection.connectionState === 'connecting' ||
              peerConnection.connectionState === 'disconnected'
            ) {
              console.warn(
                `⚠️ Peer connection still not ready for ${targetUserId}, skipping`
              );
              return;
            }
          }

          console.log(
            `🔄 Replacing tracks for screen share to ${targetUserId}`
          );

          try {
            // 비디오 트랙 교체
            if (videoTrack) {
              const videoSender = peerConnection
                .getSenders()
                .find((s: RTCRtpSender) => s.track?.kind === 'video');
              if (videoSender) {
                await videoSender.replaceTrack(videoTrack);
                console.log(
                  `✅ Video track replaced for screen share to ${targetUserId}`
                );
              } else {
                console.warn(`⚠️ No video sender found for ${targetUserId}`);
              }
            }

            // 오디오 트랙 교체 (화면공유에 오디오가 포함된 경우)
            if (audioTrack) {
              const audioSender = peerConnection
                .getSenders()
                .find((s: RTCRtpSender) => s.track?.kind === 'audio');
              if (audioSender) {
                await audioSender.replaceTrack(audioTrack);
                console.log(
                  `✅ Audio track replaced for screen share to ${targetUserId}`
                );
              }
            }

            console.log(
              `📊 Connection state after track replacement: ${peerConnection.connectionState}`
            );
          } catch (error) {
            console.error(
              `❌ Failed to replace tracks for ${targetUserId}:`,
              error
            );
          }
        };

        // 각 peer에 대해 순차적으로 트랙 교체
        const replaceTracksSequentially = async () => {
          for (const [targetUserId, peer] of peersRef.current.entries()) {
            await replaceTracksForPeer(peer, targetUserId);
            // 각 peer 사이에 약간의 지연
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        };

        // 트랙 교체 실행
        await replaceTracksSequentially();

        // 화면공유 후 재협상 트리거 (더 안전한 방식)
        for (const [targetUserId, peer] of peersRef.current.entries()) {
          try {
            console.log(`📡 Triggering renegotiation with ${targetUserId}`);

            // SimplePeer의 renegotiate 메서드 사용
            if (typeof (peer as any).renegotiate === 'function') {
              (peer as any).renegotiate();
              console.log(`✅ Renegotiation triggered for ${targetUserId}`);
            } else {
              // fallback: 직접 offer 생성
              const pc: RTCPeerConnection | undefined = (peer as any)?._pc;
              if (pc && pc.connectionState === 'connected') {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const payload: WebRTCSignalPayload = {
                  roomId,
                  userId,
                  targetUserId,
                  signal: offer as unknown as SignalData,
                  type: 'offer',
                };

                socket?.emit('webrtc_signal', payload);
                console.log(
                  `✅ Fallback renegotiation sent for ${targetUserId}`
                );
              }
            }
          } catch (err) {
            console.error(`❌ Renegotiation failed for ${targetUserId}:`, err);
          }
        }

        // 화면 공유 종료 이벤트 처리 (사용자가 브라우저에서 직접 중지)
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };

        // 소켓으로 화면 공유 상태 전송
        socket?.emit('screen_share_started', { roomId, userId });
      } catch (err) {
        console.error('Error starting screen share:', err);
        setError('화면 공유를 시작할 수 없습니다.');

        // 화면 공유 취소 시 원래 스트림 복원
        if (isScreenSharing && originalStream) {
          setLocalStream(originalStream);
          setIsScreenSharing(false);
          setOriginalStream(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      localStream,
      isScreenSharing,
      roomId,
      userId,
      socket,
      stopScreenShare,
      originalStream,
    ]
  );

  return {
    localStream,
    remoteStreams,
    remoteTrackStates,
    isConnected,
    isLoading,
    error,
    isScreenSharing,
    localVideoRef,
    initializeLocalStream,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
  };
};
