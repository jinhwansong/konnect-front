import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { ARTICLE_OPTIONS } from '@/contact/article';
import { uploadArticleImage } from '@/libs/article';
import { ArticleRequest, articleSchema } from '@/schema/article';
import { useToastStore } from '@/stores/useToast';

import Button from '../common/Button';
import Editor from '../common/Editor';
import FormErrorMessage from '../common/FormErrorMessage';
import Input from '../common/Input';
import Select from '../common/Select';

interface ArticleFormProps {
  onSubmit: (data: ArticleRequest) => void;
  defaultValues?: ArticleRequest;
  title: string;
}

export default function ArticleForm({
  onSubmit,
  defaultValues,
  title,
}: ArticleFormProps) {
  const { show } = useToastStore();
  const methods = useForm<ArticleRequest>({
    mode: 'all',
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues ?? {
      title: '',
      content: '',
      thumbnail: null,
      category: '',
    },
  });
  const {
    control,
    register,
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
      const res = await uploadArticleImage(formData);
      return res.image;
    } catch {
      show('이미지 업로드에 실패했습니다.', 'error');
      return [];
    }
  };
  return (
    <section className="mx-auto mt-10 mb-16 w-[768px]">
      <h4 className="mb-5 text-xl leading-[1.4] font-semibold tracking-[-0.3px] text-[var(--text-bold)]">
        {title}
      </h4>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-col gap-8"
        >
          <div>
            <label className="mb-2 block text-sm text-[var(--text-bold)]">
              아티클 제목
            </label>
            <Input
              type="text"
              placeholder="예: React 기초 강의"
              {...register('title')}
            />
            <FormErrorMessage message={errors.title?.message} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="mb-2 block text-sm text-[var(--text-bold)]">
              카테고리
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={ARTICLE_OPTIONS}
                  placeholder="카테고리를 선택해주세요"
                />
              )}
            />
            <FormErrorMessage message={errors.category?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[var(--text-bold)]">
              아티클 내용
            </label>

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  onImageUpload={handleImageUpload}
                />
              )}
            />
            <FormErrorMessage message={errors.content?.message} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--text-bold)]">
              썸네일 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full cursor-pointer rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary-sub01)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[var(--primary)] focus:outline-none"
              {...register('thumbnail')}
            />
          </div>
          <Button type="submit" disabled={!isValid}>
            {title}
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
