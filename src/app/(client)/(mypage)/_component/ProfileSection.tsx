'use client';
import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { getImageUrl } from '@/util/getImageUrl';
import { useToastStore } from '@/store/useToastStore';
import style from './ProfileSection.module.scss';



 interface IProfileSection {
   mutation: any;
   image: string;
   title: string;
 }

export default function ProfileSection({
  mutation,
  image,
  title
}: IProfileSection) {
  // 캐시 무효화
  const queryClient = useQueryClient();
  // toast팝업
  const showToast = useToastStore((state) => state.showToast);
  // 이미지
  const profileRef = useRef<HTMLInputElement>(null);
  const onProfile = useCallback(() => {
    profileRef.current?.click();
  }, []);
  const changeProfile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.name.length > 30) {
          return showToast('파일명은 글자수 30미만으로 적어주세요.', 'error');
        }
        if (file.size > 2 * 1024 * 1024) {
          return showToast('파일크기는 2mb 미만으로 줄여주세요.', 'error');
        }
        if (!file.type.startsWith('image/')) {
          return showToast('이미지 파일만 업로드 가능합니다.', 'error');
        }
        const image = new FormData();
        image.append('image', file);
        image.append('optimize', 'true');
        image.append('maxWidth', '196');
        image.append('quality', '80');
        mutation.mutate(image, {
          onSuccess: (data: any) => {
            showToast(data.message, 'success');
            if (title === '내 프로필') {
              queryClient.setQueryData(['mydata'], (oldData: any) => ({
                ...oldData,
                image: data.image,
              }));
            }else {
              queryClient.setQueryData(['mentordata'], (oldData: any) => ({
                ...oldData,
                image: data.image,
              }));
            }
          },
          onError: (err: unknown) => {
            if (typeof err === 'object' || err !== null)
              showToast((err as any).data, 'error');
          },
        });
      }
    },
    [showToast, mutation, queryClient, title]
  );
  return (
    <div className={style.info_item}>
      <em className={style.item_title}>이미지</em>
      <div className={style.item_img}>
        <button
          onClick={onProfile}
          className={
            title === '내 프로필' ? style.myimg_button : style.img_button
          }
        >
          <Image
            src={getImageUrl(image)}
            alt="프로필사진"
            height={100}
            width={100}
          />
          <input
            type="file"
            id="profile"
            name="profile"
            hidden
            ref={profileRef}
            onChange={changeProfile}
          />
        </button>
        {title === '멘토 프로필' && (
          <div>
            <em>썸네일 이미지 등록 가이드</em>
            <ul>
              <li>해상도: 196px × 260px</li>
              <li>파일명: 30자 미만</li>
              <li>용량: 2MB 미만</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
