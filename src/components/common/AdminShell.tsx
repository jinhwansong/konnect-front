'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { FiArrowRightCircle } from 'react-icons/fi';

import { adminMenu } from '@/app/admin/_config/menu';

interface AdminShellProps {
  title?: string;
  children: ReactNode;
}

export default function AdminShell({ title, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--background-sub)] text-[var(--text)]">
      <aside className="hidden w-64 flex-col border-r border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-6 shadow-md sm:flex">
        <div className="px-2">
          <Link
            href="/admin/dashboard"
            className="block rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-sub01)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)] focus-visible:outline-none"
          >
            Konnect 관리자
          </Link>
        </div>

        <nav className="mt-6 space-y-1">
          {adminMenu.map(link => {
            const isActive =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition duration-200 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)] focus-visible:outline-none ${
                  isActive
                    ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
                    : 'text-[var(--text-sub)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-bold)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{link.label}</span>
                {isActive && (
                  <FiArrowRightCircle className="text-[var(--primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg bg-[var(--background)] p-4 text-xs text-[var(--text-sub)]">
          <p className="font-semibold text-[var(--text-bold)]">
            도움이 필요하신가요?
          </p>
          <p className="mt-1 leading-relaxed">
            관리자 지원이나 시스템 관련 문의는 운영팀에 연락해주세요.
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--card-bg)]/90 px-6 py-4 backdrop-blur-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-wide text-[var(--text-sub)] uppercase">
                관리자 페이지
              </p>
              <h1 className="text-lg font-semibold text-[var(--text-bold)]">
                {title || 'Overview'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 items-center rounded-full bg-[var(--background)] px-4 text-xs text-[var(--text-sub)] shadow-sm">
                <span className="font-medium text-[var(--text-bold)]">
                  관리자 계정
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[var(--background)]">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
