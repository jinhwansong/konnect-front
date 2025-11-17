'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import React, { useState } from 'react';

import { deleteProfile } from '@/libs/mypage';
import { useToastStore } from '@/stores/useToast';

import ConfirmDialog from '../common/ConfirmDialog';

export default function MyPageSidebar() {
  const { data: session } = useSession();
  const { show } = useToastStore();

  const commonItem = [
    {
      title: '내 정보',
      items: [{ name: '프로필 설정', href: '/my/profile' }],
    },
    {
      title: '이용 내역',
      items: [
        { name: '멘토링 일정', href: '/my/reservations/upcoming' },
        { name: '내가 쓴 후기', href: '/my/reviews' },
        { name: '결제 내역', href: '/my/payments' },
      ],
    },
  ];

  const mentorExtra = [
    {
      title: '멘토링 관리',
      items: [
        { name: '세션 만들기', href: '/my/sessions' },
        { name: '예약 확인', href: '/my/schedule' },
        { name: '후기 모아보기', href: '/my/review-manage' },
        { name: '내 수익', href: '/my/earnings' },
      ],
    },
  ];
  const mentorExtraItem = {
    name: '멘토 프로필 관리',
    href: '/my/mentor-profile',
  };

  const pathname = usePathname();
  const tabs =
    session?.user?.role === 'mentor'
      ? [
          {
            ...commonItem[0],
            items: [...commonItem[0].items, mentorExtraItem],
          },
          ...commonItem.slice(1),
          ...mentorExtra,
        ]
      : commonItem;
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteProfile();
      show(res.message, 'success');
      setOpen(false);

      signOut({
        callbackUrl: '/',
      });
    } catch {
      show('회원탈퇴 중 오류가 발생했습니다.', 'error');
    }
  };
  return (
    <aside className="w-[200px]">
      {tabs.map(section => (
        <div key={section.title} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-[var(--text-bold)]">
            {section.title}
          </h2>
          <ul className="space-y-1">
            {section.items.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'block w-full rounded-md px-3 py-3 text-sm transition-colors',
                    pathname.includes(item.href)
                      ? 'bg-[var(--primary-sub02)] font-semibold text-[var(--primary)]'
                      : 'text-[var(--text)] hover:bg-[var(--hover-bg)] hover:text-[var(--primary-sub01)]'
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        className={clsx(
          'w-full rounded-md px-3 py-3 text-sm font-medium',
          'text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500'
        )}
        onClick={() => setOpen(true)}
      >
        회원탈퇴
      </button>
      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        title="정말 회원탈퇴 하시겠습니까?"
        description="탈퇴 후에는 계정을 복구할 수 없으며, 모든 데이터가 삭제됩니다."
        confirmText="탈퇴하기"
        cancelText="취소"
      />
    </aside>
  );
}
