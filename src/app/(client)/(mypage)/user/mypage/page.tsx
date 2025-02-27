'use client'
import React from 'react'
import { useUserData } from '@/app/_lib/useUser';
import {
  useUpdateNickname,
  useUpdatePassword,
  useUpdatePhone,
  useUpdateProfile,
} from '@/app/_lib/useUser';
import { onName, onPassword, onPasswordcheck, onPhone } from '@/util/useSign';
import useProfileActions from '@/hooks/useProfileActions';
import useVaild from '@/hooks/useVaild';
import ProfileSection from '../../_component/ProfileSection';
import InfoItem from '../../_component/InfoItem';
import style from '../../_component/profile.module.scss';
export default function Mypage() {
  // 내정보
  const { data } = useUserData();
  // 닉네임 전화번호 새 비밀번호 현재비밀번호 비밀번호 체크
  const [nickname, changeNickname, nicknameError] = useVaild(
    data?.nickname ?? '',
    onName
  );
  const [phone, changePhone, phoneError] = useVaild(data?.phone ?? '', onPhone);
  const [newPassword, changeNewPassword, newPasswordError] = useVaild(
    '',
    onPassword
  );
  const [currentPassword, changeCurrentPassword, currentPasswordError] =
    useVaild('', onPassword);
  const [passwordcheck, changePasswordcheck, passwordcheckError] = useVaild(
    '',
    (value) => onPasswordcheck(newPassword, value)
  );
  // mutations
  const updateProfile = useUpdateProfile();
  const updateNickname = useUpdateNickname();
  const updatePassword = useUpdatePassword();
  const updatePhone = useUpdatePhone();

  const { prevKey, handleEdit, handleCancel, handleSave } = useProfileActions();
  return (
    <section className={style.mypage_section}>
      <article className={style.mypage_aticle}>
        <h4 className={style.mypage_title}>내 프로필</h4>
        <ProfileSection
          mutation={updateProfile}
          image={data?.image}
          title="내 프로필"
        />
        <InfoItem label="이름" data={data?.name} />
        <InfoItem
          label="닉네임"
          data={nickname}
          isEditing={prevKey === '닉네임'}
          handleEdit={() => handleEdit('닉네임')}
          handleSave={() => handleSave('닉네임', nickname, updateNickname)}
          type="text"
          placeholder="변경하실 닉네임을 적어주세요."
          handleCancel={() => handleCancel(changeNickname, data?.nickname)}
          error={nicknameError}
          onChange={changeNickname}
        />
      </article>
      <article className={style.mypage_aticle}>
        <h4 className={style.mypage_title}>기본 정보</h4>
        <InfoItem label="이메일" data={data?.email || data?.snsId} />
        <InfoItem
          label="비밀번호"
          data={currentPassword}
          sns={
            data?.snsId
              ? '소셜로그인은 비밀번호 변경을 할수 없습니다.'
              : '비밀번호를 설정해주세요.'
          }
          isEditing={prevKey === '비밀번호'}
          handleCancel={() => handleCancel(changePhone, data?.phone)}
          handleSave={() =>
            handleSave(
              '비밀번호',
              { newPassword, currentPassword },
              updatePassword
            )
          }
          error={currentPasswordError}
          onChange={changeCurrentPassword}
          handleEdit={() => handleEdit('비밀번호')}
          type="password"
          placeholder="현재 비밀번호를 입력해주세요."
          checkPasswordLabel="비밀번호 확인"
          checkPasswordData={passwordcheck}
          checkPasswordOnChange={changePasswordcheck}
          checkPasswordPlaceholder="비밀번호를 다시 입력해주세요."
          checkPasswordError={passwordcheckError}
          newPasswordLabel="새 비밀번호"
          newPasswordData={newPassword}
          newPasswordOnChange={changeNewPassword}
          newPasswordPlaceholder="새 비밀번호를 입력해주세요."
          newPasswordError={newPasswordError}
        />
        <InfoItem
          label="휴대폰 번호"
          data={phone}
          isEditing={prevKey === '휴대폰 번호'}
          handleEdit={() => handleEdit('휴대폰 번호')}
          handleSave={() => handleSave('휴대폰 번호', phone, updatePhone)}
          type="number"
          placeholder="-없이 숫자만 입력"
          handleCancel={() => handleCancel(changePhone, data?.phone)}
          error={phoneError}
          onChange={changePhone}
        />
      </article>
    </section>
  );
}
