'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { FcManager, FcHome, FcQuestions } from 'react-icons/fc';
import { BiSearch } from 'react-icons/bi';
import Input from '@/app/_component/Input';
import { getImageUrl } from '@/util/getImageUrl';
import usePopup from '@/hooks/usePopup';
import useInput from '@/hooks/useInput';
import { usePopupStore } from '@/store/usePopupStore';
import { IcLogo } from '@/asset';
import { useUserData } from '@/app/_lib/useUser';
import { useLogout } from '@/app/_lib/useEtc';

import style from './header.module.scss';


export default function Header() {
  const queryClient = useQueryClient();
  const [search, changeSearch] = useInput('');
  const router = useRouter();
  const { onPopup, popup, closePop } = usePopupStore();
  const { popupRef } = usePopup();
  // 내정보
  const { data } = useUserData();
  // 로그아웃
  const logoutMutation = useLogout();
  const onLogout = useCallback(() => {
    logoutMutation.mutate();
    queryClient.setQueryData(['mydata'], null);
    router.replace('/');
    onPopup();
   
  }, [router, onPopup, logoutMutation, queryClient]);
  return (
    <header className={style.header}>
      <div className={style.header_inner}>
        <div className={style.header_top}>
          <Link href="/">
            <IcLogo />
          </Link>
          <div className={style.header_link}>
            <Link href="/mentor">멘토지원</Link>
            {data ? (
              <div className={style.profile}>
                <button
                  className={style.profileImg}
                  onClick={onPopup}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Image
                    src={getImageUrl(data?.image)}
                    alt={data.name as string}
                    height={35}
                    width={35}
                  />
                </button>
                {popup && (
                  <div className={style.profile_tap} ref={popupRef}>
                    <div>
                      <em>{data.nickname}</em>
                      <p>{data.email || data.snsId}</p>
                    </div>
                    <div>
                      <Link href="/user/mypage" onClick={closePop}>
                        내 정보
                      </Link>
                      <Link href="/user/bookmarks" onClick={closePop}>
                        북마크
                      </Link>
                      <Link href="/user/relationships" onClick={closePop}>
                        팔로우
                      </Link>
                      <Link href="/user/mentorings" onClick={closePop}>
                        멘토링 신청 내역
                      </Link>
                      <Link href="/user/payments">결제/환불 내역</Link>
                      {data.role === 'admin' && (
                        <Link href="/admin" onClick={closePop}>
                          관리자페이지
                        </Link>
                      )}
                    </div>
                    <div>
                      <button onClick={onLogout}>로그아웃</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">로그인</Link>
            )}
          </div>
        </div>
        <div className={style.header_Btm}>
          <nav className={style.header_nav}>
            <Link href="/">
              <FcHome />홈
            </Link>
            <Link href="/mentors">
              <FcManager />
              분야별 멘토 찾기
            </Link>
            <Link href="/article">
              <FcQuestions />
              분야별 아티클
            </Link>
          </nav>
          <form className={style.header_search}>
            <Input
              type="text"
              value={search}
              onChange={changeSearch}
              placeholder="관심있는 직무, 회사, 멘토를 검색해보세요"
              name="search"
              bg="search"
            />
            <label htmlFor="search">
              <BiSearch />
            </label>
          </form>
        </div>
      </div>
    </header>
  );
}
