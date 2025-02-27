import React from "react";
import Header from './_component/Header';
import Footer from './_component/Footer';
import ToastPopup from '../_component/ToastPopup';
import RQProvider from '@/hooks/useRQProvider';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RQProvider>
        <Header />
        {children}
        <Footer />
      </RQProvider>
      <ToastPopup />
    </>
  );
}
