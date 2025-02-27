'use client';
import React, { useEffect, useRef } from 'react'
import { usePopupStore } from '@/store/usePopupStore';

export default function usePopup() {
  const popupRef = useRef<HTMLDivElement>(null);
  const { closePop } = usePopupStore();
  useEffect(() => {
    const closePopup = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePop();
      }
    };
    window?.addEventListener('mousedown', closePopup);
    return () => {
      window?.removeEventListener('mousedown', closePopup);
    };
  }, [closePop]);
  return { popupRef };
}
