'use client'
import React from 'react'
import { useToastStore } from '@/store/useToastStore';
import style from './toast.module.scss';
export default function ToastPopup({}) {
  const toast = useToastStore((state)=>state.toast);
  if(!toast) return null;
  return (
    <div className={style.toast}>
      {toast.message}
    </div>
  );
}
