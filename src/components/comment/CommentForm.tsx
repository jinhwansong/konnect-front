'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CommentRequest, commentSchema } from '@/schema/comment';

import Button from '../common/Button';
import FormErrorMessage from '../common/FormErrorMessage';
import Textarea from '../common/Textarea';

interface CommentProps {
  onSubmit: (data: CommentRequest) => void;
}

export default function CommentForm({ onSubmit }: CommentProps) {
  const { data: session } = useSession();

  const methods = useForm<CommentRequest>({
    mode: 'onChange',
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors, isSubmitting },
  } = methods;

  const content = watch('content') || '';

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isValid && !isSubmitting && session) {
        handleSubmit(handleFormSubmit)();
      }
    }
    reset();
  };
  const handleFormSubmit = async (data: CommentRequest) => {
    await onSubmit(data);
    reset();
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Textarea
          {...register('content')}
          onKeyDown={onKeyDown}
          disabled={!session || isSubmitting}
          placeholder={
            session
              ? '댓글을 입력해 주세요.'
              : '로그인 후 댓글을 작성할 수 있습니다.'
          }
        />
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <p>
            {content.length}/{500}
          </p>
          <FormErrorMessage message={errors.content?.message} />
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button
            type="button"
            onClick={() => reset()}
            disabled={!session || isSubmitting || content.length === 0}
            size="md"
            variant="danger"
          >
            취소
          </Button>
          <Button type="submit" disabled={!session || !isValid} size="md">
            댓글남기기
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
