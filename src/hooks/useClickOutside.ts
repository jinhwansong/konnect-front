import React, { useEffect } from 'react';

export default function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClick: () => void
) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClick();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, onClick]);
}
