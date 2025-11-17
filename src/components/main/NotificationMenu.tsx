'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { BiBell, BiX } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';

import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useGetNotification,
  useGetUnreadCount,
  useMarkAllAsRead,
  useMarkAsRead,
} from '@/hooks/query/useNotification';
import useClickOutside from '@/hooks/useClickOutside';
import { formatToKoreanDate } from '@/utils/formatDate';

export default function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLLIElement | null>(null);
  useClickOutside(popupRef, () => setOpen(false));

  const { data: session } = useSession();

  // API Hooks
  const { data: getNotification } = useGetNotification();
  const { data: getUnreadCount } = useGetUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: deleteAllNotifications } = useDeleteAllNotifications();

  const notifications = getNotification ?? [];
  const readCount = getUnreadCount?.count ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);
  // handlers
  const handleRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  const handleReadAll = () => {
    markAllAsRead();
  };

  const handleRemove = (id: string) => {
    deleteNotification(id);
  };

  const handleRemoveAll = () => {
    deleteAllNotifications();
  };
  return (
    <li className="relative flex items-center gap-1" ref={popupRef}>
      {/* 검색 버튼 */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
      >
        <FiSearch className="h-5 w-5" />
      </button>

      {/* 알림 버튼 */}
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-lg p-2 text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
        onClick={() => setOpen(prev => !prev)}
      >
        <BiBell className="h-5 w-5" />
        {mounted && readCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-danger)] px-1.5 py-0.5 text-xs font-bold text-white">
            {readCount > 9 ? '9+' : readCount}
          </span>
        )}
      </button>

      {/* 알림 드롭다운 */}
      {mounted && open && (
        <div className="absolute top-12 right-0 z-50 w-[360px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl">
          {session ? (
            notifications.length > 0 ? (
              <>
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
                  <h4 className="text-sm font-semibold text-[var(--text-bold)]">
                    알림
                  </h4>
                  <div className="flex gap-2 text-xs text-[var(--text-sub)]">
                    <button
                      onClick={() => {
                        handleReadAll();
                        setOpen(false);
                      }}
                      className="transition-colors duration-200 hover:text-[var(--primary)]"
                    >
                      모두 읽음
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => {
                        handleRemoveAll();
                        setOpen(false);
                      }}
                      className="transition-colors duration-200 hover:text-[var(--primary)]"
                    >
                      모두 삭제
                    </button>
                  </div>
                </div>

                {/* 알림 목록 */}
                <ul className="max-h-[400px] overflow-y-auto">
                  {notifications.map(noti => (
                    <li
                      key={noti.id}
                      className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${
                        noti.isRead
                          ? 'bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]'
                          : 'bg-[var(--primary-sub02)] hover:bg-[var(--primary-sub01)]/20'
                      }`}
                      onClick={() => {
                        handleRead(noti.id, noti.isRead);
                        setOpen(false); // ✅ 항목 클릭 시 닫기
                      }}
                    >
                      <div className="flex-1">
                        <p className="mb-1 text-sm text-[var(--text)]">
                          {noti.message}
                        </p>
                        <span className="text-xs text-[var(--text-sub)]">
                          {formatToKoreanDate(noti.createdAt)}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="ml-2 text-[var(--text-sub)] transition-colors duration-200 hover:text-[var(--text)]"
                        onClick={e => {
                          e.stopPropagation();
                          handleRemove(noti.id);
                          setOpen(false);
                        }}
                      >
                        <BiX className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="px-4 py-10 text-center text-[var(--text-sub)]">
                <em className="block text-base font-semibold text-[var(--text)]">
                  받은 알림이 없습니다
                </em>
                <p className="mt-2 text-sm">
                  알림 설정에서 받고 싶은 알림을 선택하세요.
                </p>
              </div>
            )
          ) : (
            <div className="px-4 py-10 text-center">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-sub01)]"
              >
                로그인 하기
              </Link>
              <p className="mt-2 text-sm text-[var(--text-sub)]">
                로그인 하시면 신청한 멘토링이나
                <br /> 새로운 아티클 소식을 받아보실 수 있어요.
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
