'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { useToastStore } from '@/stores/useToast';

const Toast = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { toasts } = useToastStore();

  return (
    <div
      ref={ref}
      className="fixed bottom-10 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2"
      role="region"
      aria-live="polite"
      aria-label="Toast notifications"
      {...props}
    >
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`min-w-[200px] rounded-lg px-4 py-3 text-sm shadow-md ${
              toast.type === 'success'
                ? 'bg-[var(--color-success)] text-white'
                : 'bg-[var(--color-danger)] text-white'
            }`}
            role="alert"
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

Toast.displayName = 'Toast';

export default React.memo(Toast);
