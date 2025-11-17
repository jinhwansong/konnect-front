import clsx from 'clsx';
import React from 'react';

import { Option } from '@/types/apply';

interface CheckboxGroupProps<T = string> {
  value: T[] | T | undefined;
  onChange: (value: T[] | T) => void;
  options: Option<T>[];
  type: 'radio' | 'checkbox';
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
}

const CheckboxGroup = React.forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps<string>
>(
  (
    {
      value,
      onChange,
      options,
      type,
      label,
      error,
      disabled = false,
      className,
      name,
      ...props
    },
    ref
  ) => {
    const fieldsetId = name || `${type}-group`;
    const groupName = name || `checkbox-group-${type}`;

    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${fieldsetId}-error` : undefined}
        {...props}
      >
        {label && (
          <legend className="mb-2 text-sm font-medium text-[var(--text-bold)]">
            {label}
          </legend>
        )}
        <div className={clsx('flex flex-wrap gap-2', className)}>
          {options.map(item => {
            const isChecked =
              type === 'radio'
                ? value !== undefined && isEqual(value as string, item.value)
                : Array.isArray(value) &&
                  value.some(v => isEqual(v, item.value));

            const inputId = `${fieldsetId}-${item.value}`;
            return (
              <label
                key={JSON.stringify(item.value)}
                htmlFor={inputId}
                className={clsx(
                  'h-10 cursor-pointer rounded-lg border px-3 text-sm leading-10 transition-colors',
                  isChecked
                    ? 'hover:bg-[color-mix(in oklch,var(--primary),black_15%)] border-[var(--primary)] bg-[var(--primary)] text-white'
                    : 'border-[var(--border-color)] bg-[var(--editor-bg)] text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--primary)]',
                  disabled && 'cursor-not-allowed opacity-60'
                )}
              >
                <input
                  id={inputId}
                  type={type}
                  name={groupName}
                  hidden
                  checked={isChecked}
                  disabled={disabled}
                  onChange={e => {
                    const checked = e.target.checked;

                    if (type === 'radio') {
                      onChange(item.value);
                    } else {
                      const newValue = checked
                        ? ([
                            ...((value as string[]) ?? []),
                            item.value,
                          ] as string[])
                        : (value as string[]).filter(
                            v => !isEqual(v, item.value)
                          );
                      onChange(newValue);
                    }
                  }}
                />
                {item.label}
              </label>
            );
          })}
        </div>
        {error && (
          <p
            id={`${fieldsetId}-error`}
            className="mt-1 text-sm text-[var(--color-danger)]"
            role="alert"
          >
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

function isEqual<T>(a: T, b: T) {
  return JSON.stringify(a) === JSON.stringify(b);
}

CheckboxGroup.displayName = 'CheckboxGroup';

export default React.memo(CheckboxGroup);
