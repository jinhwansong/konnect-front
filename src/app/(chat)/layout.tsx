import React from 'react';
import RQProvider from '@/hooks/useRQProvider';

export default function layout({ children }: { children: React.ReactNode }) {
  return <RQProvider>{children}</RQProvider>;
}
