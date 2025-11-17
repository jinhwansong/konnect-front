import { useCallback } from 'react';

import { useToastStore } from '@/stores/useToast';
import { parseApiError } from '@/utils/error';

export function useQueryError() {
  const { show } = useToastStore();

  const handleError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      const parsedError = parseApiError(error, fallbackMessage);

      console.error('[QueryError]', {
        message: parsedError.message,
        status: parsedError.status,
        path: parsedError.path,
        code: parsedError.code,
        originalError: error,
      });

      show(parsedError.message, 'error');
    },
    [show]
  );

  return { handleError };
}
