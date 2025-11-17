'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode, ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200  disabled:opacity-50 text-sm',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--primary)] text-white hover:bg-[var(--primary-sub01)] ',
        secondary:
          'bg-[var(--card-bg-sub)] text-[var(--text)] hover:bg-[var(--hover-bg)] ',
        outline:
          'border border-[var(--border-color)] bg-[var(--background)] text-[var(--text)] hover:bg-[var(--hover-bg)] ',
        ghost: 'text-[var(--text)] hover:bg-[var(--hover-bg)] ',
        danger: 'bg-[var(--color-danger)] text-white hover:bg-red-600 ',
      },
      size: {
        sm: 'h-8 px-4 text-xs',
        md: 'h-11 px-4 text-sm',
        lg: 'h-10 px-6 text-sm',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  className = '',
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonVariants({ variant, size })} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>로딩 중...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
