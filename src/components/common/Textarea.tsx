import clsx from 'clsx';
import React from 'react';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const textareaClass = clsx(
      'text-sm rounded-lg px-4 py-3 resize-none w-full min-h-28',
      'border  transition-colors duration-200',
      'bg-[var(--editor-bg)] text-[var(--text)] placeholder-[var(--text-sub)]',
      'hover:border-[var(--primary-sub01)]',
      'focus:outline-none focus:border-[var(--primary)]',
      error
        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] '
        : 'border-[var(--border-color)]',
      className
    );

    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-[var(--text-bold)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClass}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default React.memo(Textarea);
