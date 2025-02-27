'use client';
import React, { useCallback, useState } from 'react';
import {
  useMentorData,
  useUpdateCareer,
  useUpdateCompony,
  useUpdateIntroduce,
  useUpdatePosition,
  useUpdateProfile,
} from '@/app/_lib/useMentor';
import ProfileSection from '../../_component/ProfileSection';
import EditroItem from '../../_component/EditroItem';
import InfoItem from '../../_component/InfoItem';
import CareerItem from '../../_component/CareerItem';
import { usePopupStore } from '@/store/usePopupStore';
import useProfileActions from '@/hooks/useProfileActions';
import useSelect from '@/hooks/useSelect';
import useInput from '@/hooks/useInput';
import { careerlist } from '@/app/(client)/config/job';
import style from '../../_component/profile.module.scss';




export default function MentoProfile() {
  // 내정보
  const { data } = useMentorData();
  // 팝업관련...
  const { onPopup3, popup3 } = usePopupStore();
  const [career, onCareer] = useSelect(data?.career || '', onPopup3);
  const [compony, changeCompony] = useInput(data?.company);
  const [position, changePosition] = useInput(data?.position);
  const [introduce, setIntroduce] = useState(data?.introduce);
  const onIntroduce = useCallback((newContent: string) => {
    setIntroduce(newContent);
  }, []);
  // mutations
  const updatePosition = useUpdatePosition();
  const updateCompony = useUpdateCompony();
  const updateCareer = useUpdateCareer();
  const updateProfile = useUpdateProfile();
  const updateIntroduce = useUpdateIntroduce();
  const { prevKey, handleEdit, handleCancel, handleSave, handleCancelCareer } =
    useProfileActions();
  return (
    <section className={style.mypage_section}>
      <article className={style.mypage_aticle}>
        <h4 className={style.mypage_title}>멘토 프로필</h4>
        <ProfileSection
          mutation={updateProfile}
          image={data?.image}
          title="멘토 프로필"
        />
        <EditroItem
          data={data?.introduce}
          isEditing={prevKey === '자기소개'}
          handleEdit={() => handleEdit('자기소개')}
          handleSave={() => handleSave('자기소개', introduce, updateIntroduce)}
          handleCancel={() => handleCancelCareer(onIntroduce, data?.introduce)}
          onIntroduce={onIntroduce}
          introduce={introduce}
        />
      </article>
      <article className={style.mypage_aticle}>
        <h4 className={style.mypage_title}>경력 정보</h4>
        <InfoItem
          label="회사명"
          data={compony}
          type="text"
          placeholder="회사명을 적어주세요."
          isEditing={prevKey === '회사명'}
          handleEdit={() => handleEdit('회사명')}
          handleSave={() => handleSave('회사명', compony, updateCompony)}
          handleCancel={() => handleCancel(changeCompony, data?.company)}
          onChange={changeCompony}
        />
        <CareerItem
          options={careerlist}
          onSelet={onCareer}
          popup={popup3}
          onPopup={onPopup3}
          label="멘토 연차"
          isEditing={prevKey === '멘토 연차'}
          handleEdit={() => handleEdit('멘토 연차')}
          handleSave={() => handleSave('멘토 연차', career, updateCareer)}
          handleCancel={() => handleCancelCareer(onCareer, data?.career)}
          data={data?.career}
          seletText={career}
        />
        <InfoItem
          label="전문분야"
          data={position}
          type="text"
          placeholder="전문 분야를 적어주세요 ex) 프론트엔드"
          isEditing={prevKey === '전문분야'}
          handleEdit={() => handleEdit('전문분야')}
          handleSave={() => handleSave('전문분야', position, updatePosition)}
          handleCancel={() => handleCancel(changePosition, data?.position)}
          onChange={changePosition}
        />
      </article>
    </section>
  );
}
