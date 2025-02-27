import React from "react";
import style from '@/styles/_common.module.scss';
import Nav from "../_component/Nav";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}){
  return (
    <main className={style.mypage}>
      <Nav />
      {children}
    </main>
  );
}
