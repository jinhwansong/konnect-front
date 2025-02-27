'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { BiX } from 'react-icons/bi';
import style from './modal.module.scss';

interface IModal {
  children: React.ReactNode;
}
export default function Modal({ children }: IModal) {
  const router = useRouter();
  useEffect(() => {
    const handleRefresh = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        router.back();
      }
    };

    window.addEventListener('keydown', handleRefresh);
    return () => {
      window.removeEventListener('keydown', handleRefresh);
    };
  }, [router]);
  return (
    <div className={style.modalBg} onClick={() => router.back()}>
      <div className={style.modalback} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => router.back()}>
          <BiX />
        </button>
        {children}
      </div>
    </div>
  );
}
