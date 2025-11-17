import React, { useEffect } from 'react';

import IcClose from '@/assets/close.svg';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ children, onClose, title, size = 'md', className }, ref) => {
    const sizeClasses = {
      sm: ' w-[400px]',
      md: 'h-[600px] w-[500px]',
      lg: 'h-[700px] w-[600px]',
    };

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [onClose]);

    return (
      <section
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />
        <article
          ref={ref}
          className={`relative mx-auto box-border flex flex-col overflow-y-auto rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${sizeClasses[size]} ${className || ''}`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 ml-auto rounded-md p-1 hover:bg-[var(--hover-bg)]"
            aria-label="Close modal"
          >
            <IcClose className="stroke-[var(--text-bold)]" />
          </button>
          {children}
        </article>
      </section>
    );
  }
);

Modal.displayName = 'Modal';

export default React.memo(Modal);
