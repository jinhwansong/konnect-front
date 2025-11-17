'use client';

import clsx from 'clsx';
import * as React from 'react';

type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
}

const SIZE: Record<
  ToggleSize,
  { track: string; thumb: string; translate: string }
> = {
  sm: { track: 'h-5 w-9', thumb: 'h-4 w-4', translate: 'translate-x-[1rem]' },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-[1.3rem]',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-[1.5rem]',
  },
};

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      size = 'md',
      className,
      ...props
    },
    ref
  ) {
    const isControlled = typeof checked === 'boolean';
    const [internal, setInternal] = React.useState(Boolean(defaultChecked));
    const isOn = isControlled ? Boolean(checked) : internal;

    const handleToggle = (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    const s = SIZE[size];

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-disabled={disabled || undefined}
        onClick={handleToggle}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleToggle(e);
          }
        }}
        className={clsx(
          'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200',
          'outline-none',
          // ✅ 트랙 배경 색상
          isOn
            ? 'bg-[var(--primary)]'
            : 'bg-[var(--border-color)] dark:bg-[var(--border-color)]',
          disabled && 'cursor-not-allowed opacity-60',
          s.track,
          className
        )}
        {...props}
      >
        {/* ✅ 썸(thumb) */}
        <span
          className={clsx(
            'pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 transform rounded-full shadow',
            'transition-all duration-200',
            isOn ? s.translate : 'translate-x-[0.2rem]',
            'bg-[var(--card-bg)] dark:bg-[var(--card-bg)]',
            s.thumb
          )}
        />
      </button>
    );
  }
);
