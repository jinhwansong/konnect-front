import type { Metadata } from "next";
import localFont from "next/font/local";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: '커넥트 - 한 걸음 더 나아가는 연결',
  description: '한 걸음 더 나아가는 연결, 커넥트',
  icons: {
    icon: '/favicon.svg',
  },
};
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard`}>
        {children}
      </body>
    </html>
  );
}
