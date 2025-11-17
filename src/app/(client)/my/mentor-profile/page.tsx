'use client';
import React from 'react';

import { Toggle } from '@/components/common/Toggle';
import EditableCheckboxForm from '@/components/my/EditableCheckboxForm';
import EditableSelectForm from '@/components/my/EditableSelectForm';
import EditableTextForm from '@/components/my/EditableTextForm';
import { CAREER_OPTIONS, POSITION_OPTIONS } from '@/contact/apply';
import { EXPERTISE_OPTIONS } from '@/contact/mentoring';
import {
  usePatchIsCompanyHidden,
  usePatchExpertise,
  usePatchCareer,
  usePatchPosition,
  usePatchCompany,
  useGetMentorProfile,
} from '@/hooks/query/useMypage';
import { useToastStore } from '@/stores/useToast';

export default function MentorProfilePage() {
  const { show } = useToastStore();
  const { mutate: patchCompany } = usePatchCompany();
  const { mutate: patchPosition } = usePatchPosition();
  const { mutate: patchCareer } = usePatchCareer();
  const { mutate: patchExpertise } = usePatchExpertise();
  const { mutate: patchIsCompanyHidden } = usePatchIsCompanyHidden();
  const { data: mentor, isLoading } = useGetMentorProfile();
  const handleUpdateCompany = async (value: string) => {
    try {
      await patchCompany({ company: value });
      show('회사명이 수정되었습니다.', 'success');
    } catch {
      show('회사명 수정 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleUpdatePosition = async (value: string) => {
    try {
      await patchPosition({ position: value });
      show('직무가 수정되었습니다.', 'success');
    } catch {
      show('직무 수정 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleUpdateCareer = async (value: string) => {
    try {
      await patchCareer({ career: value });
      show('연차가 수정되었습니다.', 'success');
    } catch {
      show('연차 수정 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleUpdateExpertise = async (value: string[]) => {
    try {
      await patchExpertise({ expertise: value });
      show('전문분야가 수정되었습니다.', 'success');
    } catch {
      show('전문분야 수정 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleUpdateIsCompanyHidden = async (value: boolean) => {
    try {
      await patchIsCompanyHidden({ isCompanyHidden: value });
      show('회사명 공개 여부가 변경되었습니다.', 'success');
    } catch {
      show('회사명 공개 설정 중 오류가 발생했습니다.', 'error');
    }
  };
  if (isLoading) return null;
  return (
    <div className="flex-1">
      <h4 className="mb-6 text-2xl font-bold text-[var(--text-bold)]">
        멘토 프로필 관리
      </h4>
      <div className="space-y-6 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-10">
        {/* 회사명  */}
        <EditableTextForm
          label="회사명"
          name="company"
          defaultValue={mentor?.company ?? ''}
          placeholder={mentor?.company ?? '회사명을 입력해주세요.'}
          rules={{ required: '회사명을 입력하세요' }}
          onSubmit={handleUpdateCompany}
        />
        {/* 직무 (Select) */}
        <EditableSelectForm
          label="직무"
          name="position"
          defaultValue={mentor?.position ?? '직무를 선택해주세요.'}
          options={POSITION_OPTIONS}
          placeholder="직무를 선택해주세요."
          onSubmit={handleUpdatePosition}
        />

        {/* 연차 (Select) */}
        <EditableSelectForm
          label="연차"
          name="career"
          defaultValue={mentor?.career ?? '연차를 선택해주세요.'}
          options={CAREER_OPTIONS}
          placeholder="연차를 선택해주세요"
          onSubmit={handleUpdateCareer}
        />

        {/* 전문 분야 (CheckboxGroup) */}
        <EditableCheckboxForm
          label="전문 분야"
          name="expertise"
          defaultValue={mentor?.expertise ?? []}
          options={EXPERTISE_OPTIONS}
          onSubmit={handleUpdateExpertise}
        />
      </div>
      <div className="mt-5 space-y-6 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-10">
        {/* 회사명 공개 여부 */}
        <div className="flex items-center justify-between">
          <div>
            <em className="text-base font-medium text-[var(--text)]">
              회사명 공개 여부
            </em>
            <p className="mt-1 text-xs text-[var(--text-sub)]">
              비공개로 설정하면 프로필에 회사명이 표시되지 않습니다.
            </p>
          </div>
          <Toggle
            checked={mentor?.isCompanyHidden}
            onCheckedChange={v => handleUpdateIsCompanyHidden(v)}
          />
        </div>
      </div>
    </div>
  );
}
