import React from 'react';

import FormErrorMessage from './FormErrorMessage';

interface FormFieldWrapperProps {
  label: string;
  name: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  description?: string;
}

const FormFieldWrapper = React.forwardRef<
  HTMLDivElement,
  FormFieldWrapperProps
>(
  (
    {
      label,
      name,
      children,
      error,
      required = false,
      className,
      description,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`relative flex flex-col gap-2 ${className || ''}`}
        {...props}
      >
        <label
          htmlFor={name}
          className="text-sm font-medium text-[var(--text-bold)]"
        >
          {label}
          {required && (
            <span
              className="ml-1 text-[var(--color-danger)]"
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
        {description && (
          <p className="text-xs text-[var(--text-sub)]">{description}</p>
        )}
        {children}
        <FormErrorMessage message={error} id={`${name}-error`} />
      </div>
    );
  }
);

FormFieldWrapper.displayName = 'FormFieldWrapper';

export default React.memo(FormFieldWrapper);
