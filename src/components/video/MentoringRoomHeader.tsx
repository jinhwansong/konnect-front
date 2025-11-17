'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiWifi } from 'react-icons/fi';

export default function MentoringRoomHeader() {
  const router = useRouter();

  const handleExitRoom = () => {
    if (confirm('멘토링 방을 나가시겠습니까?')) {
      router.push('/my/reservations/upcoming');
    }
  };

  return (
    <header className="flex-shrink-0 border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-sub)] transition-colors hover:text-[var(--text)]"
          >
            <FiArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">뒤로</span>
          </button>

          <div className="h-6 w-px bg-[var(--border-color)]" />

          <div>
            <h1 className="text-sm font-semibold text-[var(--text-bold)]">
              멘토링 방
            </h1>
            <p className="text-xs text-[var(--text-sub)]">실시간 화상 채팅</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 연결 상태 표시 */}
          <div className="flex items-center gap-2">
            <FiWifi className="h-4 w-4 text-[var(--color-success)]" />
            <span className="text-xs text-[var(--text-sub)]">연결됨</span>
          </div>

          {/* 방 나가기 버튼 */}
          <button
            onClick={handleExitRoom}
            className="rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-[var(--color-danger)] transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
          >
            방 나가기
          </button>
        </div>
      </div>
    </header>
  );
}
