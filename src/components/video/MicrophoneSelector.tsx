'use client';

import { useEffect, useState } from 'react';

interface MicrophoneSelectorProps {
  onDeviceChange: (deviceId: string) => void;
}

export default function MicrophoneSelector({
  onDeviceChange,
}: MicrophoneSelectorProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      try {
        // 먼저 권한 요청
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // 디바이스 목록 가져오기
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = allDevices.filter(
          device => device.kind === 'audioinput'
        );

        setDevices(audioInputs);

        if (audioInputs.length > 0 && !selectedDevice) {
          setSelectedDevice(audioInputs[0].deviceId);
        }
      } catch (err) {
        console.error('Failed to get audio devices:', err);
      }
    };

    getDevices();

    // 디바이스 변경 감지
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [selectedDevice]);

  const handleChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    onDeviceChange(deviceId);
  };

  if (devices.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-[120px] right-4 z-50 max-w-xs rounded-lg border-2 border-blue-500 bg-black/90 p-3 font-mono text-xs text-white">
      <div className="mb-2 font-bold">🎤 마이크 선택</div>
      <select
        value={selectedDevice}
        onChange={e => handleChange(e.target.value)}
        className="w-full rounded border border-gray-600 bg-gray-800 px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
      >
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
          </option>
        ))}
      </select>
      <div className="mt-2 text-xs text-gray-400">
        총 {devices.length}개 감지됨
      </div>
    </div>
  );
}
