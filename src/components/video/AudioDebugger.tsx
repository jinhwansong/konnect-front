'use client';

import { useEffect, useState } from 'react';

interface AudioDebuggerProps {
  stream: MediaStream | null;
  label: string;
  index?: number;
}

export default function AudioDebugger({
  stream,
  label,
  index = 0,
}: AudioDebuggerProps) {
  const [audioInfo, setAudioInfo] = useState({
    hasAudio: false,
    trackCount: 0,
    enabled: false,
    muted: false,
    readyState: '',
  });

  useEffect(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      const audioTrack = audioTracks[0];

      setAudioInfo({
        hasAudio: audioTracks.length > 0,
        trackCount: audioTracks.length,
        enabled: audioTrack?.enabled ?? false,
        muted: audioTrack?.muted ?? true,
        readyState: audioTrack?.readyState ?? 'none',
      });

      // 오디오 트랙 상태 로그
      if (audioTrack) {
        console.log(`🔊 [${label}] Audio track:`, {
          id: audioTrack.id,
          enabled: audioTrack.enabled,
          muted: audioTrack.muted,
          readyState: audioTrack.readyState,
          label: audioTrack.label,
        });
      }
    }
  }, [stream, label]);

  const bgColor = label.includes('Remote') ? 'bg-blue-900/90' : 'bg-black/80';
  const topOffset = 4 + index * 120; // 각 박스마다 120px 간격

  return (
    <div
      className={`fixed left-4 ${bgColor} z-50 rounded border-2 p-2 font-mono text-xs text-white ${
        label.includes('Remote') ? 'border-blue-500' : 'border-gray-600'
      }`}
      style={{ bottom: `${topOffset}px` }}
    >
      <div className="mb-1 font-bold">{label}</div>
      <div>Stream: {stream ? '✅' : '❌'}</div>
      <div>Audio tracks: {audioInfo.trackCount}</div>
      <div>Enabled: {audioInfo.enabled ? '✅' : '❌'}</div>
      <div>Muted: {audioInfo.muted ? '🔇' : '🔊'}</div>
      <div>State: {audioInfo.readyState}</div>
    </div>
  );
}
