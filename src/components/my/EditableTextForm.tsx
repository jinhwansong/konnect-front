'use client';
import { useState } from 'react';
import { useForm, SubmitHandler, RegisterOptions } from 'react-hook-form';

import Button from '../common/Button';
import FormErrorMessage from '../common/FormErrorMessage';
import Input from '../common/Input';

interface EditableTextFormProps {
  label: string;
  name: string;
  defaultValue: string;
  rules?: RegisterOptions;
  onSubmit: (value: string) => Promise<void> | void;
  type?: string;
  placeholder?: string;
  isPhone?: boolean;
}

export default function EditableTextForm({
  label,
  name,
  defaultValue,
  rules,
  onSubmit,
  type = 'text',
  placeholder,
  isPhone,
}: EditableTextFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<{ [key: string]: string }>({
    mode: 'all',
    defaultValues: { [name]: defaultValue },
  });

  const submitHandler: SubmitHandler<{
    [key: string]: string;
  }> = async data => {
    await onSubmit(data[name]);
    setIsEditing(false);
    reset({ [name]: data[name] });
  };
  const cancelHandler = () => {
    reset({ [name]: defaultValue });
    setIsEditing(false);
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
      <em className="block text-sm font-medium text-[var(--text)]">{label}</em>

      {!isEditing ? (
        <div className="flex items-center gap-5">
          <Input
            type="text"
            value={defaultValue}
            placeholder={placeholder}
            disabled
          />
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            설정
          </Button>
        </div>
      ) : (
        <>
          <Input
            type={isPhone ? 'text' : type}
            inputMode={isPhone ? 'numeric' : undefined}
            maxLength={isPhone ? 11 : undefined}
            placeholder={placeholder}
            {...register(name, rules)}
          />
          <FormErrorMessage message={errors[name]?.message as string} />

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
