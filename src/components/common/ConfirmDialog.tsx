'use client';

import React, { useEffect } from 'react';

import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'outline' | 'danger' | 'secondary' | 'ghost';
  cancelVariant?: 'primary' | 'outline' | 'danger' | 'secondary' | 'ghost';
  className?: string;
}

const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open,
      title = '정말 탈퇴하시겠습니까?',
      description = '탈퇴 후에는 계정을 복구할 수 없으며 모든 데이터가 삭제됩니다.',
      confirmText = '탈퇴하기',
      cancelText = '취소',
      onConfirm,
      onCancel,
      confirmVariant = 'danger',
      cancelVariant = 'outline',
      className,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [open, onCancel]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
          aria-hidden="true"
        />

        {/* dialog */}
        <div
          ref={ref}
          className={`relative z-10 w-[90%] max-w-sm rounded-xl border border-[var(--border-color)] bg-[var(--editor-bg)] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${className || ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
          {...props}
        >
          <h2
            id="confirm-dialog-title"
            className="mb-2 text-lg font-semibold text-[var(--text-bold)]"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-description"
            className="mb-6 text-sm text-[var(--text-sub)]"
          >
            {description}
          </p>

          <div className="flex justify-end gap-3">
            <Button onClick={onCancel} variant={cancelVariant} size="sm">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} variant={confirmVariant} size="sm">
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';

export default React.memo(ConfirmDialog);
