'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import useClickOutside from '@/hooks/useClickOutside';
import { removeFcm } from '@/libs/notification';
import { useToastStore } from '@/stores/useToast';
import { buildImageUrl } from '@/utils/helpers';

import Button from '../common/Button';

export default function UserMenu() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const { show } = useToastStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openRef = useRef<HTMLLIElement>(null);

  useClickOutside(openRef, () => setOpen(false));

  useEffect(() => {
    setMounted(true);
  }, []);

  const menteeItem = [
    { name: '멘토링 일정', href: '/my/reservations/upcoming' },
    { name: '내가 쓴 후기', href: '/my/reviews' },
    { name: '결제 내역', href: '/my/payments' },
  ];

  const mentorItem = [
    { name: '세션 만들기', href: '/my/sessions' },
    { name: '예약 확인', href: '/my/schedule' },
    { name: '후기 모아보기', href: '/my/review-manage' },
    { name: '내 수익', href: '/my/earnings' },
  ];


  
  const handleLogout = async () => {
    try {
      // 세션에서가 아니라 브라우저에 저장해 둔 현재 FCM 토큰을 기준으로 삭제
      let storedFcm: string | null = null;
      if (typeof window !== 'undefined') {
        try {
          storedFcm = window.localStorage.getItem('fcmToken');
        } catch {
          storedFcm = null;
        }
      }

      // FCM 토큰 삭제 시도 (실패해도 로그아웃은 계속 진행)
      if (storedFcm) {
        try {
          await removeFcm(storedFcm);
        } catch (error) {
          // FCM 토큰 삭제 실패는 로그만 남기고 계속 진행
          console.warn('FCM 토큰 삭제 실패 (로그아웃은 계속 진행):', error);
        }
        // 로컬 스토리지는 항상 정리
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem('fcmToken');
          } catch {
            // 무시
          }
        }
      }

      await signOut({ callbackUrl: '/' });
      show('로그아웃을 완료했습니다.', 'success');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      show('로그아웃에 실패했습니다.', 'error');
    }
  };

  // 로그인 안 된 경우 → 버튼들
  if (!mounted) {
    return null;
  }

  if (!session) {
    return (
      <>
        <li>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:bg-[var(--hover-bg)]"
          >
            로그인
          </Link>
        </li>
        <li>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--primary-sub01)]"
          >
            회원가입
          </Link>
        </li>
      </>
    );
  }

  // 로그인 된 경우 → 프로필 드롭다운
  return (
    <li className="relative" ref={openRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-center overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
      >
        <Image
          src={buildImageUrl(session?.user.image?.trim())}
          alt={session.user.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute top-[44px] right-0 z-200 box-border flex w-[280px] flex-col overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-2xl transition-transform">
          <div className="border-b border-[var(--border-color)] px-6 py-4">
            <div className="mb-3 flex items-center gap-3.5">
              <Image
                src={buildImageUrl(session?.user.image?.trim())}
                alt={session.user.name}
                width={40}
                height={40}
                className="h-10 w-10 overflow-hidden rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-[var(--text-bold)]">
                  {session.user.nickname}
                </p>
                <p className="truncate text-sm text-[var(--text-sub)]">
                  {session.user.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => {
                setOpen(false);
                router.push('/my/profile');
              }}
            >
              프로필 설정
            </Button>
          </div>

          <ul className="flex flex-col text-sm">
            {(session.user.role === 'mentee' ? menteeItem : mentorItem).map(
              item => (
                <li key={item.name}>
                  <Link
                    onClick={() => setOpen(false)}
                    href={item.href}
                    className="block px-6 py-4 text-[var(--text)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--primary)]"
                  >
                    {item.name}
                  </Link>
                </li>
              )
            )}
            <li className="border-t border-[var(--border-color)]">
              <button
                onClick={handleLogout}
                className="block w-full px-6 py-4 text-[var(--text)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--color-danger)]"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
    </li>
  );
}
