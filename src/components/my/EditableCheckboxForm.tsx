'use client';
import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { findOptionLabel } from '@/utils/getLabel';

import Button from '../common/Button';
import CheckboxGroup from '../common/CheckboxGroup';
import FormErrorMessage from '../common/FormErrorMessage';
import Input from '../common/Input';

interface EditableCheckboxFormProps {
  label: string;
  name: string;
  defaultValue: string[];
  options: { label: string; value: string }[];
  onSubmit: (value: string[]) => Promise<void> | void;
}

export default function EditableCheckboxForm({
  label,
  name,
  defaultValue,
  options,
  onSubmit,
}: EditableCheckboxFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ [key: string]: string[] }>({
    defaultValues: { [name]: defaultValue },
  });

  const submitHandler: SubmitHandler<{
    [key: string]: string[];
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
            value={
              defaultValue.length > 0
                ? `${findOptionLabel(defaultValue[0], options)}${
                    defaultValue.length > 1
                      ? ` 외 ${defaultValue.length - 1}`
                      : ''
                  }`
                : '선택 없음'
            }
            placeholder="선택 없음"
            disabled
          />
          <Button
            type="button"
            size="md"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            설정
          </Button>
        </div>
      ) : (
        <>
          <Controller
            name={name}
            control={control}
            rules={{
              validate: value =>
                (value?.length ?? 0) > 0 || '최소 1개 이상 선택해야 합니다.',
            }}
            render={({ field }) => (
              <CheckboxGroup
                type="checkbox"
                options={options}
                value={field.value}
                onChange={field.onChange}
                className="flex flex-wrap gap-2"
              />
            )}
          />

          <FormErrorMessage message={errors[name]?.message as string} />

          <div className="flex justify-end gap-2">
            <Button type="submit" size="sm" variant="primary">
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
