import React from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import ToastPopup from '@/app/_component/ToastPopup';
import RQProvider from '@/hooks/useRQProvider';
import style from './layout.module.scss'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={style.mainwrapper}>
      <Nav />
      <section>
        <RQProvider>
          <Header />
          <article>{children}</article>
        </RQProvider>
        <ToastPopup />
      </section>
    </div>
  );
}
