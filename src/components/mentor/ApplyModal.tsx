'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { CAREER_OPTIONS, POSITION_OPTIONS } from '@/contact/apply';
import { EXPERTISE_OPTIONS } from '@/contact/mentoring';
import { useMentorApply } from '@/hooks/query/useMentorApply';
import { ApplyRequest, applySchema } from '@/schema/mentor';
import { useToastStore } from '@/stores/useToast';

import Button from '../common/Button';
import CheckboxGroup from '../common/CheckboxGroup';
import FormFieldWrapper from '../common/FormFieldWrapper';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Textarea from '../common/Textarea';

export default function ApplyModal() {
  const router = useRouter();
  const { show } = useToastStore();
  const { data: session } = useSession();
  const { mutate: applyMentor } = useMentorApply();
  const methods = useForm<ApplyRequest>({
    mode: 'onChange',
    resolver: zodResolver(applySchema),
    defaultValues: {
      company: '',
      introduce: '',
      position: '',
      career: '',
      expertise: [],
      portfolio: '',
    },
  });
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = methods;
  console.log(watch('introduce').length);
  const onSubmit = (data: ApplyRequest) => {
    applyMentor(data, {
      onSuccess: () => {
        show('멘토신청을 완료했습니다.', 'success');
        router.push('/');
      },
      onError: error => {
        const errorMessage =
          error instanceof Error ? error.message : '오류가 발생했습니다.';
        show(errorMessage, 'error');
      },
    });
  };
  return (
    <Modal onClose={() => router.back()}>
      <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
        감사합니다,{' '}
        <span className="font-bold text-[var(--primary)]">
          {session?.user?.nickname}
        </span>
        님
        <br />
        지식공유자가 되기 위해서
        <br />
        아래 정보가 필요해요.
      </h4>
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          {/* 회사명 */}
          <FormFieldWrapper
            label="회사명"
            name="company"
            error={errors.company?.message}
          >
            <Input
              {...register('company')}
              type="text"
              placeholder="회사명을 입력해주세요."
            />
          </FormFieldWrapper>

          {/* 직무 */}
          <FormFieldWrapper
            label="직무"
            name="position"
            error={errors.position?.message}
          >
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={POSITION_OPTIONS}
                  placeholder="직무를 선택해주세요"
                />
              )}
            />
          </FormFieldWrapper>

          {/* 연차 */}
          <FormFieldWrapper
            label="연차"
            name="career"
            error={errors.career?.message}
          >
            <Controller
              name="career"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={CAREER_OPTIONS}
                  placeholder="연차를 선택해주세요"
                />
              )}
            />
          </FormFieldWrapper>

          {/* 전문분야 */}
          <FormFieldWrapper
            label="전문 분야"
            name="expertise"
            error={errors.expertise?.message}
          >
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  options={EXPERTISE_OPTIONS}
                  type="checkbox"
                  className="flex flex-wrap gap-2"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormFieldWrapper>

          {/* 자기소개 */}
          <FormFieldWrapper
            label="자기소개"
            name="introduce"
            error={errors.introduce?.message}
          >
            <Textarea
              {...register('introduce')}
              placeholder="자기소개를 입력해주세요."
              maxLength={500}
            />
          </FormFieldWrapper>

          {/* 포트폴리오 */}
          <FormFieldWrapper
            label="포트폴리오 링크"
            name="portfolio"
            error={errors.portfolio?.message}
          >
            <Input
              {...register('portfolio')}
              type="text"
              placeholder="URL 형식으로 입력해주세요."
            />
          </FormFieldWrapper>
          <Button type="submit" disabled={!isValid}>
            멘토지원
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
}
