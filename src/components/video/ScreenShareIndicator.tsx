'use client';

import { FiMonitor, FiX } from 'react-icons/fi';

interface ScreenShareIndicatorProps {
  isSharing: boolean;
  onStopShare: () => void;
  userName: string;
}

export default function ScreenShareIndicator({
  isSharing,
  onStopShare,
  userName,
}: ScreenShareIndicatorProps) {
  if (!isSharing) return null;

  return (
    <div className="fixed top-4 left-1/2 z-40 -translate-x-1/2 transform">
      <div className="flex items-center gap-3 rounded-full bg-[var(--primary-sub03)] px-4 py-2 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-danger)]" />
          <FiMonitor className="h-4 w-4" />
          <span className="text-sm font-medium">
            {userName}님이 화면을 공유하고 있습니다
          </span>
        </div>
        <button
          onClick={onStopShare}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
        >
          <FiX className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
