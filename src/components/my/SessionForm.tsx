import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import Editor from '@/components/common/Editor';
import Input from '@/components/common/Input';
import { EXPERTISE_OPTIONS } from '@/contact/mentoring';
import { uploadSessionImage } from '@/libs/session';
import { SessionFormValues, sessionSchema } from '@/schema/session';
import { useToastStore } from '@/stores/useToast';
import { SessionRequest } from '@/types/session';

import FormErrorMessage from '../common/FormErrorMessage';
import Select from '../common/Select';

interface SessionFormProps {
  onSubmit: (data: SessionRequest) => void;
  defaultValues?: SessionRequest;
  title: string;
}

export default function SessionForm({
  onSubmit,
  defaultValues,
  title,
}: SessionFormProps) {
  const { show } = useToastStore();
  const methods = useForm<SessionFormValues>({
    mode: 'all',
    resolver: zodResolver(sessionSchema),
    defaultValues: defaultValues ?? {
      title: '',
      description: '',
      price: 0,
      duration: 0,
      category: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = methods;
  const handleImageUpload = async (files: File[]) => {
    const formData = new FormData();
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/avif',
    ];

    files.forEach(file => {
      if (file.name.length > 30) {
        show('파일명은 글자수 30자 미만으로 적어주세요.', 'error');
        return [];
      }

      if (file.size > 5 * 1024 * 1024) {
        show('파일 크기는 5MB 미만으로 줄여주세요.', 'error');
        return [];
      }

      if (!allowedTypes.includes(file.type)) {
        show('지원하지 않는 이미지 형식입니다.', 'error');
        return [];
      }
      formData.append('images', file);
    });
    formData.append('optimize', 'true');
    formData.append('maxWidth', '800');
    formData.append('quality', '80');
    try {
      const res = await uploadSessionImage(formData);
      return res.urls;
    } catch {
      show('이미지 업로드에 실패했습니다.', 'error');
      return [];
    }
  };
  return (
    <section className="flex-1">
      <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
        {title}
      </h4>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">세션 제목</label>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="예: React 기초 강의"
                  error={fieldState.error?.message}
                />
              )}
            />
            <FormErrorMessage message={errors.title?.message} />
          </div>

          <div className="flex gap-4">
            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-sm text-[var(--text-bold)]">
                가격 (원)
              </label>
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="예: 50000"
                    value={field.value === 0 ? '' : field.value}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.price?.message} />
            </div>

            <div className="flex w-1/2 flex-col gap-1">
              <label className="text-sm text-[var(--text-bold)]">
                시간 (분)
              </label>
              <Controller
                name="duration"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="예: 60"
                    value={field.value === 0 ? '' : field.value}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.duration?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">카테고리</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={EXPERTISE_OPTIONS}
                  placeholder="카테고리를 선택해주세요"
                />
              )}
            />
            <FormErrorMessage message={errors.category?.message} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">설명</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: '내용을 입력하세요.' }}
              render={({ field }) => (
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  onImageUpload={handleImageUpload}
                />
              )}
            />
            <FormErrorMessage message={errors.description?.message} />
          </div>
          <Button type="submit" disabled={!isValid}>
            {title}
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
