import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '../common/Button';
import Editor from '../common/Editor';
import Select from '../common/Select';
import { useToastStore } from '@/stores/useToast';
import { ArticleRequest } from '@/types/article';
import Input from '../common/Input';
import { uploadArticleImage } from '@/libs/article';
import { ARTICLE_OPTIONS } from '@/contact/article';

interface ArticleFormProps {
  onSubmit: (data: ArticleRequest) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  defaultValues?: ArticleRequest;
  title: string;
}

export default function ArticleForm({
  onSubmit,
  content,
  setContent,
  defaultValues,
  title,
}: ArticleFormProps) {
  const { showToast } = useToastStore();
  const methods = useForm<ArticleRequest>({
    mode: 'all',
    defaultValues: defaultValues ?? {
      title: '',
      content: '',
      thumbnail: null,
      category: '',
    },
  });
  const {
    formState: { isValid },
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

    files.forEach((file) => {
      if (file.name.length > 30) {
        showToast('파일명은 글자수 30자 미만으로 적어주세요.', 'error');
        return [];
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('파일 크기는 5MB 미만으로 줄여주세요.', 'error');
        return [];
      }

      if (!allowedTypes.includes(file.type)) {
        showToast('지원하지 않는 이미지 형식입니다.', 'error');
        return [];
      }
      formData.append('images', file);
    });
    formData.append('optimize', 'true');
    formData.append('maxWidth', '800');
    formData.append('quality', '80');
    try {
      const res = await uploadArticleImage(formData);
      return res.urls;
    } catch {
      showToast('이미지 업로드에 실패했습니다.', 'error');
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
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-col gap-8"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">
              아티클 제목
            </label>
            <Input
              name="title"
              type="text"
              placeholder="예: React 기초 강의"
              rules={{ required: '제목은 필수 입력입니다.' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">카테고리</label>
            <Select
              name="category"
              options={ARTICLE_OPTIONS}
              placeholder="카테고리를 선택해주세요"
              rules={{ required: '카테고리를 선택해주세요.' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">
              아티클 내용
            </label>
            <Editor
              value={content}
              onChange={setContent}
              onImageUpload={handleImageUpload}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-bold)]">
              썸네일 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full cursor-pointer rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary-sub01)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[var(--primary)] focus:outline-none"
              {...methods.register('thumbnail', {
                required: '썸네일 이미지를 선택해주세요.',
              })}
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
