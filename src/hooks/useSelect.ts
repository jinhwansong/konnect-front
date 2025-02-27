'use client'
import React, { useCallback, useEffect, useState } from 'react'

export default function useSelect(
  initialValue: string,
  onPopup: () => void,
  closeOnSelect: boolean = true
) {
  const [value, setValue] = useState(initialValue);
  const onValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (closeOnSelect) {
        onPopup();
      }
    },
    [onPopup, closeOnSelect]
  );
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return [value, onValue] as const;
}
