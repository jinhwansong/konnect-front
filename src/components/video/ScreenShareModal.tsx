'use client';

import { useState } from 'react';
import { FiMonitor, FiX, FiShare2 } from 'react-icons/fi';

interface ScreenShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartShare: (source: 'screen' | 'window' | 'tab') => void;
}

export default function ScreenShareModal({
  isOpen,
  onClose,
  onStartShare,
}: ScreenShareModalProps) {
  const [selectedSource, setSelectedSource] = useState<
    'screen' | 'window' | 'tab'
  >('screen');

  if (!isOpen) return null;

  const handleStartShare = () => {
    onStartShare(selectedSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-sub02)]">
              <FiShare2 className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-bold)]">
                화면 공유
              </h2>
              <p className="text-sm text-[var(--text-sub)]">
                공유할 화면을 선택하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card-bg-sub)] transition-colors hover:bg-[var(--hover-bg)]"
          >
            <FiX className="h-4 w-4 text-[var(--text-sub)]" />
          </button>
        </div>

        {/* 옵션 선택 */}
        <div className="space-y-4 p-6">
          {/* 전체 화면 */}
          <button
            onClick={() => setSelectedSource('screen')}
            className={`w-full rounded-xl border-2 p-4 transition-all ${
              selectedSource === 'screen'
                ? 'border-[var(--primary)] bg-[var(--primary-sub02)]'
                : 'border-[var(--border-color)] bg-[var(--card-bg-sub)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selectedSource === 'screen'
                    ? 'bg-[var(--primary)]'
                    : 'bg-[var(--card-bg)]'
                }`}
              >
                <FiMonitor
                  className={`h-6 w-6 ${selectedSource === 'screen' ? 'text-white' : 'text-[var(--text-sub)]'}`}
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-[var(--text-bold)]">
                  전체 화면
                </h3>
                <p className="text-sm text-[var(--text-sub)]">
                  모든 화면을 공유합니다
                </p>
              </div>
            </div>
          </button>

          {/* 창 */}
          <button
            onClick={() => setSelectedSource('window')}
            className={`w-full rounded-xl border-2 p-4 transition-all ${
              selectedSource === 'window'
                ? 'border-[var(--primary)] bg-[var(--primary-sub02)]'
                : 'border-[var(--border-color)] bg-[var(--card-bg-sub)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selectedSource === 'window'
                    ? 'bg-[var(--primary)]'
                    : 'bg-[var(--card-bg)]'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded border-2 ${selectedSource === 'window' ? 'border-white' : 'border-[var(--text-sub)]'}`}
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-[var(--text-bold)]">창</h3>
                <p className="text-sm text-[var(--text-sub)]">
                  특정 창을 공유합니다
                </p>
              </div>
            </div>
          </button>

          {/* 탭 */}
          <button
            onClick={() => setSelectedSource('tab')}
            className={`w-full rounded-xl border-2 p-4 transition-all ${
              selectedSource === 'tab'
                ? 'border-[var(--primary)] bg-[var(--primary-sub02)]'
                : 'border-[var(--border-color)] bg-[var(--card-bg-sub)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selectedSource === 'tab'
                    ? 'bg-[var(--primary)]'
                    : 'bg-[var(--card-bg)]'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-t border-2 ${selectedSource === 'tab' ? 'border-white' : 'border-[var(--text-sub)]'}`}
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-[var(--text-bold)]">탭</h3>
                <p className="text-sm text-[var(--text-sub)]">
                  브라우저 탭을 공유합니다
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 border-t border-[var(--border-color)] p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--border-color)] px-4 py-3 text-[var(--text)] transition-colors hover:bg-[var(--hover-bg)]"
          >
            취소
          </button>
          <button
            onClick={handleStartShare}
            className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--primary-sub01)]"
          >
            공유 시작
          </button>
        </div>
      </div>
    </div>
  );
}
