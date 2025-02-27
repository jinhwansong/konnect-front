import React from "react";
import style from '@/styles/_common.module.scss';

export default function layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}){
  return (
    <>
      {children}
      {modal}
    </>
  );
}
