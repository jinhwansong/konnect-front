'use client';

import clsx from 'clsx';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  variantSize?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      variantSize = 'lg',
      className,
      disabled = false,
      label,
      id,
      ...props
    },
    ref
  ) => {
    const inputClass = clsx(
      'text-sm h-12 rounded-lg px-4',
      'border transition-colors duration-200',
      'bg-[var(--editor-bg)] text-[var(--text)] placeholder-[var(--text-sub)]',
      'hover:border-[var(--primary-sub01)]',
      'focus:outline-none focus:border-[var(--primary)]',
      'disabled:bg-[var(--primary-sub02)] disabled:text-[var(--text-sub)] disabled:cursor-not-allowed',
      variantSize === 'lg' && 'w-full',
      variantSize === 'sm' && 'w-[150px]',
      error
        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[color-mix(in_oklch,var(--color-danger),transparent_70%)]'
        : 'border-[var(--border-color)]',
      className
    );

    const inputId = id || props.name;

    return (
      <div className="flex-1">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-[var(--text-bold)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClass}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default React.memo(Input);
