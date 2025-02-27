'use client';
import React, { useCallback, useEffect, useState } from 'react';

export default function useInput(initialValue: string) {
  const [name, setName] = useState(initialValue);
  
  const onName = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setName(e.target.value);
    },
    []
  );
  useEffect(() => {
    setName(initialValue);
  }, [initialValue]);
  return [name, onName, setName] as const;
}
