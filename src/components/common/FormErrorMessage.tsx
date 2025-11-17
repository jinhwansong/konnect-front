import React from 'react';

interface FormErrorMessageProps {
  message?: string;
  className?: string;
  id?: string;
}

const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(({ message, className, id, ...props }, ref) => {
  if (!message) return null;

  return (
    <p
      ref={ref}
      id={id}
      className={`text-sm text-[var(--color-danger)] ${className || ''}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {message}
    </p>
  );
});

FormErrorMessage.displayName = 'FormErrorMessage';

export default React.memo(FormErrorMessage);
