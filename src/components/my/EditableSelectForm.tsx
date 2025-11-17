'use client';
import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { findOptionLabel } from '@/utils/getLabel';

import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface EditableSelectFormProps {
  label: string;
  name: string;
  defaultValue: string;
  options: { label: string; value: string }[];
  onSubmit: (value: string) => Promise<void> | void;
  placeholder?: string;
}

export default function EditableSelectForm({
  label,
  name,
  defaultValue,
  options,
  onSubmit,
  placeholder,
}: EditableSelectFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, reset } = useForm<{ [key: string]: string }>({
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
            value={findOptionLabel(defaultValue, options) || placeholder}
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
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={options}
                placeholder={placeholder}
              />
            )}
          />
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
