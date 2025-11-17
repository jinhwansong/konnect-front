import '@/styles/globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import NotificationInitializer from '@/hooks/useNotificationInitializer';

import Providers from './providers';
import WebVitalsReporter from './reportWebVitals';

export const metadata: Metadata = {
  title: 'Konnect - 취준생을 위한 멘토링 플랫폼',
  description:
    'Konnect는 취준생을 위한 멘토링 플랫폼입니다. 신뢰할 수 있는 멘토와 연결되어 실질적인 취업 준비를 함께하세요.',
  keywords:
    '멘토링, 취준생, 커리어 상담, 진로 멘토, 취업 준비, 경력 개발, 포트폴리오 피드백, 온라인 멘토링',
  openGraph: {
    title: 'Konnect - 취준생을 위한 멘토링 플랫폼',
    description:
      'Konnect는 취준생을 위한 멘토링 플랫폼입니다. 멘토와 함께하는 실전 준비, 지금 시작해보세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Konnect',
  },
  robots: 'index, follow',
  twitter: {
    card: 'summary_large_image',
    title: 'Konnect - 취준생을 위한 멘토링 플랫폼',
    description:
      'Konnect는 취준생을 위한 멘토링 플랫폼입니다. 멘토와 함께하는 실전 준비, 지금 시작해보세요.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <Providers>{children}</Providers>
          <WebVitalsReporter />
          <NotificationInitializer />
        </SessionProvider>
      </body>
    </html>
  );
}
