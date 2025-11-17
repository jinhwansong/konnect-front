import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { PASSWORD_REGEX } from '@/schema/sign';
import { PasswordFormValues } from '@/types/user';

import Button from '../common/Button';
import FormErrorMessage from '../common/FormErrorMessage';
import Input from '../common/Input';

export default function PasswordForm({
  onSubmit,
}: {
  onSubmit: (values: PasswordFormValues) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid, errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const submitHandler: SubmitHandler<PasswordFormValues> = async data => {
    await onSubmit(data);
    setIsEditing(false);
    reset();
  };

  const cancelHandler = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
      <em className="block text-sm font-medium text-[var(--text)]">비밀번호</em>

      {!isEditing && (
        <div className="flex items-center gap-5">
          <Input
            type="password"
            placeholder="비밀번호를 설정해주세요."
            disabled
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-[45px]"
            onClick={() => setIsEditing(true)}
          >
            설정
          </Button>
        </div>
      )}

      {isEditing && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {/* 현재 비밀번호 */}
            <div>
              <Input
                type="password"
                placeholder="현재 비밀번호"
                {...register('currentPassword', {
                  required: '현재 비밀번호를 입력하세요',
                  minLength: { value: 8, message: '8자 이상 입력하세요' },
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: '영문, 숫자, 특수문자를 포함해야 합니다',
                  },
                })}
              />
              <FormErrorMessage message={errors.currentPassword?.message} />
            </div>

            {/* 새 비밀번호 */}
            <div>
              <Input
                type="password"
                placeholder="새 비밀번호"
                {...register('newPassword', {
                  required: '새 비밀번호를 입력하세요',
                  minLength: { value: 8, message: '8자 이상 입력하세요' },
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: '영문, 숫자, 특수문자를 포함해야 합니다',
                  },
                })}
              />
              <FormErrorMessage message={errors.newPassword?.message} />
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <Input
                type="password"
                placeholder="새 비밀번호 확인"
                {...register('confirmPassword', {
                  required: '비밀번호 확인을 입력하세요',
                  minLength: { value: 8, message: '8자 이상 입력하세요' },
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: '영문, 숫자, 특수문자를 포함해야 합니다',
                  },
                  validate: val =>
                    val === watch('newPassword') ||
                    '비밀번호가 일치하지 않습니다',
                })}
              />
              <FormErrorMessage message={errors.confirmPassword?.message} />
            </div>
          </div>
          {/* 버튼 */}
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!isValid}
            >
              저장
            </Button>
            <Button
              type="button"
              size="sm"
              variant="danger"
              onClick={cancelHandler}
            >
              취소
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
