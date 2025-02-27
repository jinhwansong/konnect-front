import React from "react";
import style from '@/styles/_common.module.scss';

export default function layout({
  children,
}: {
  children: React.ReactNode;
}){
  return (
    <>
      {children}
    </>
  );
}
