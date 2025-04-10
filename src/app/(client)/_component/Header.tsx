'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {useQueryClient } from '@tanstack/react-query';
import { FcManager, FcHome, FcQuestions } from 'react-icons/fc';
import { BiBell } from 'react-icons/bi';
import { getImageUrl } from '@/util/getImageUrl';
import usePopup from '@/hooks/usePopup';
import { usePopupStore } from '@/store/usePopupStore';
import { IcFavicon, IcFeed, IcLogo } from '@/asset';
import { useUserData } from '@/app/_lib/useUser';
import { useLogout } from '@/app/_lib/useEtc';
import style from './header.module.scss';
import useNoti from '@/hooks/useNotification';
import { INoti } from '@/type';
import getTime from '@/util/getTime';
import { BiX } from 'react-icons/bi';

export default function Header() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { onPopup, popup, closePop, onPopup4, popup4 } = usePopupStore();
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
  // 알림 관련
  const {
    notifications,
    onNotiRead,
    onNotiReadAll,
    onNotiRemove,
    onNotiRemoveAll,
  } = useNoti();
  return (
    <header className={style.header}>
      <div className={style.header_inner}>
        <div className={style.header_top}>
          <Link href="/">
            <IcLogo />
          </Link>
          <div className={style.header_link}>
            <div className={style.button_wrap}>
              <button
                data-tip="알림"
                className={style.button}
                onClick={onPopup4}
              >
                <BiBell />
                알림
              </button>
              {popup4 && (
                <div className={style.popup} ref={popupRef}>
                  {data ? (
                    notifications.length > 0 ? (
                      <>
                        <div>
                          <button onClick={() => onNotiReadAll()}>
                            모두 읽음 ·
                          </button>
                          <button onClick={() => onNotiRemoveAll()}>
                            모두 삭제
                          </button>
                        </div>
                        <ul className={style.noti}>
                          {notifications.map((noti: INoti) => (
                            <li
                              key={noti.id}
                              className={noti.isRead ? style.read : ''}
                              onClick={() => onNotiRead(noti.id, noti.isRead)}
                            >
                              <Image
                                src={noti.image || IcFavicon}
                                width={30}
                                height={30}
                                alt="아이콘"
                              />
                              <div className={style.text_box}>
                                <p>{noti.message}</p>
                                <span>{getTime(noti.createdAt)}</span>
                              </div>
                              <button onClick={() => onNotiRemove(noti.id)}>
                                <BiX />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <div className={style.not_feed}>
                        <IcFeed />
                        <em>받은 알림이 없습니다.</em>
                        <p>알림 설정에서 받고 싶은 알림을 선택하세요.</p>
                      </div>
                    )
                  ) : (
                    <div className={style.not_login}>
                      <Link href="/login">로그인 하기</Link>
                      <p>
                        로그인 하시면 신청한 멘토링 또는
                        <br /> 새로운 아티클이 올라오면 알려드립니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                      {data.role === 'mentee' && (
                        <>
                          <Link href="/user/mypage" onClick={closePop}>
                            내 정보
                          </Link>

                          <Link href="/user/mentorings" onClick={closePop}>
                            멘토링 신청 내역
                          </Link>
                          <Link href="/user/payments" onClick={closePop}>
                            결제/환불 내역
                          </Link>
                          <Link href="/user/payments" onClick={closePop}>
                            결제/환불 내역
                          </Link>
                        </>
                      )}
                      {data.role === 'mentor' && (
                        <>
                          <Link href="/user/mypage" onClick={closePop}>
                            내 정보
                          </Link>

                          <Link
                            href="/mentor/mentor_profile"
                            onClick={closePop}
                          >
                            멘토 정보
                          </Link>
                          <Link href="/mentor/schedule" onClick={closePop}>
                            멘토링 관리
                          </Link>
                          <Link href="/mentor/program" onClick={closePop}>
                            멘토링 생성/관리
                          </Link>
                        </>
                      )}
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
        </div>
      </div>
    </header>
  );
}
