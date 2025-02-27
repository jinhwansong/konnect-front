'use client';
import React from 'react';
import { BiX } from 'react-icons/bi';
import style from './modal.module.scss';

interface IModal {
  children: React.ReactNode;
  closePop: () => void;
  title:string;
}
export default function RejectModal({ children, closePop,title }: IModal) {
  return (
    <div className={style.modalBg} onClick={() => closePop()}>
      <div className={style.modalback} onClick={(e) => e.stopPropagation()}>
        <div className={style.rejict_title}>
          <p>{title}</p>
          <button onClick={() => closePop()}>
            <BiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
