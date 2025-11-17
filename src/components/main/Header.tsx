'use client';

import LogoLink from './LogoLink';
import MainNav from './MainNav';
import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';

export default function Header() {
  return (
    <>
      <header className="z-50 border-b border-[var(--border-color)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-10">
            {/* 로고 */}
            <div className="flex items-center">
              <LogoLink />
            </div>

            {/* 데스크톱 네비게이션 */}
            <div className="flex items-center space-x-8">
              <MainNav />
            </div>

            {/* 데스크톱 액션 버튼들 */}
          </div>
          <div className="flex items-center space-x-3">
            <NotificationMenu />

            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
