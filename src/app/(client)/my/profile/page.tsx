'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { SiNaver } from 'react-icons/si';

import { IcGoogle, IcKakao } from '@/assets';
import EditableTextForm from '@/components/my/EditableTextForm';
import PasswordForm from '@/components/my/PasswordForm';
import {
  useUpdateNickname,
  useUpdatePassword,
  useUpdatePhone,
} from '@/hooks/query/useMypage';
import { uploadProfileImage } from '@/libs/mypage';
import { NICKNAME_REGEX, PHONE_REGEX } from '@/schema/sign';
import { useToastStore } from '@/stores/useToast';
import { PasswordFormValues } from '@/types/user';
import { buildImageUrl } from '@/utils/helpers';

export default function ProfilePage() {
  const { show } = useToastStore();
  const { data: session, status, update } = useSession();
  const { mutate: updateNickname } = useUpdateNickname();
  const { mutate: updatePhone } = useUpdatePhone();
  const { mutate: updatePassword } = useUpdatePassword();
  const handleUpdateNickname = (nickname: string) => {
    updateNickname(
      { nickname },
      {
        onSuccess: () => {
          show('닉네임이 성공적으로 변경되었습니다!', 'success');
        },
        onError: error => {
          const errorMessage =
            error instanceof Error ? error.message : '오류가 발생했습니다.';
          show(errorMessage, 'error');
        },
      }
    );
  };

  const handleUpdatePhone = (phone: string) => {
    updatePhone(
      { phone },
      {
        onSuccess: () => {
          show('전화번호가 성공적으로 변경되었습니다!', 'success');
        },
        onError: error => {
          const errorMessage =
            error instanceof Error ? error.message : '오류가 발생했습니다.';
          show(errorMessage, 'error');
        },
      }
    );
  };

  const handleUpdatePassword = (values: PasswordFormValues) => {
    updatePassword(values, {
      onSuccess: () => {
        show('비밀번호가 성공적으로 변경되었습니다!', 'success');
      },
      onError: error => {
        const errorMessage =
          error instanceof Error ? error.message : '오류가 발생했습니다.';
        show(errorMessage, 'error');
      },
    });
  };
  const handleProfileImageUpload = async (
    file: File
  ): Promise<string | null> => {
    const formData = new FormData();
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/avif',
    ];

    if (file.name.length > 30) {
      show('파일명은 글자수 30자 미만으로 적어주세요.', 'error');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      show('파일 크기는 5MB 미만으로 줄여주세요.', 'error');
      return null;
    }

    if (!allowedTypes.includes(file.type)) {
      show('지원하지 않는 이미지 형식입니다.', 'error');
      return null;
    }

    // ✅ 실제 이미지 파일 추가
    formData.append('image', file);
    formData.append('optimize', 'true');
    formData.append('maxWidth', '120');

    try {
      const res = await uploadProfileImage(formData);
      return res.image;
    } catch {
      show('이미지 업로드에 실패했습니다.', 'error');
      return null;
    }
  };

  const snsProviders = useMemo(
    () => [
      {
        name: 'kakao',
        value: '카카오',
        img: <IcKakao />,
      },
      {
        name: 'naver',
        value: '네이버',
        img: <SiNaver size={14} />,
      },
      {
        name: 'google',
        value: '구글',
        img: <IcGoogle />,
      },
    ],
    []
  );

  const linked = session?.user.socials;
  if (status === 'loading') return null;

  return (
    <div className="flex-1">
      <h4 className="mb-6 text-2xl font-bold text-[var(--text-bold)]">
        프로필 설정
      </h4>
      <div className="flex items-start gap-12 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-10">
        <div className="flex flex-col items-center">
          <Image
            src={buildImageUrl(session?.user.image?.trim() as string)}
            alt={session?.user.name ?? '프로필 이미지'}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
          <input
            id="profile-upload"
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;

              const url = await handleProfileImageUpload(file);
              if (url) {
                await update({ image: url });
                show('프로필 이미지가 변경되었습니다!', 'success');
              }
            }}
          />
          <label
            htmlFor="profile-upload"
            className={clsx(
              'border border-[var(--border-color)] bg-transparent',
              'hover:bg-[var(--primary-sub01)] hover:text-white',
              'mt-4 w-full cursor-pointer rounded-md py-2 text-center text-sm font-medium',
              'transition-colors duration-200'
            )}
          >
            프로필 변경
          </label>
        </div>

        {/* 오른쪽: 정보 목록 */}
        <div className="flex-1 space-y-6">
          {/* 이메일 */}
          <div>
            <label className="text-sm font-medium text-[var(--text)]">
              이메일
            </label>
            <p className="mt-3 text-sm">{session?.user.email}</p>
          </div>
          {/* 닉네임 */}
          <EditableTextForm
            label="닉네임"
            name="nickname"
            placeholder={
              session?.user.nickname ?? '변경할 닉네임을 설정해주세요'
            }
            defaultValue={session?.user.nickname ?? ''}
            rules={{
              required: '닉네임을 입력하세요',
              minLength: { value: 2, message: '2자 이상 입력하세요' },
              maxLength: { value: 12, message: '12자 이하로 입력하세요' },
              pattern: {
                value: NICKNAME_REGEX,
                message: '한글, 영문, 숫자만 사용 가능합니다',
              },
            }}
            onSubmit={handleUpdateNickname}
          />
          <EditableTextForm
            placeholder={
              session?.user.phone ?? '변경할 전화번호를 설정해주세요'
            }
            label="전화번호"
            name="phone"
            defaultValue={session?.user.phone ?? ''}
            rules={{
              required: '전화번호를 입력하세요',
              pattern: {
                value: PHONE_REGEX,
                message: '올바른 전화번호 형식을 입력해주세요.',
              },
            }}
            isPhone
            onSubmit={handleUpdatePhone}
          />
          {/* 비밀번호 */}
          <PasswordForm onSubmit={handleUpdatePassword} />
          <label className="text-sm font-medium text-[var(--text)]">
            SNS 연동 현황
          </label>
          <ul className="mt-3 flex items-center gap-4">
            {snsProviders.map(provider => {
              const isLinked = linked?.includes(provider.name);
              return (
                <li
                  key={provider.name}
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border-color)] transition',
                    isLinked
                      ? [
                          provider.name === 'kakao' && 'bg-[#FAE500]',
                          provider.name === 'naver' &&
                            'bg-[#1EC800] text-white',
                          provider.name === 'google' && 'bg-[#f8f8f8]',
                        ]
                      : 'bg-[#F2F3F7] opacity-60'
                  )}
                >
                  <div className={clsx(!isLinked && 'grayscale')}>
                    {provider.img}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
