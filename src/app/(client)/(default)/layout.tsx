import React from "react";
import style from '@/styles/_common.module.scss';
import Nav from "../_component/Nav";

export default function layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}){
  return (
    <main className={style.container}>
      {children}
      {modal}
    </main>
  );
}
