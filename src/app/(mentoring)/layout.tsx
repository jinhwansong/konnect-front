import { ReactNode } from 'react';

import Toast from '@/components/common/Toast';

interface MentoringLayoutProps {
  children: ReactNode;
}

export default function MentoringLayout({ children }: MentoringLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-sm">
      <div className="flex h-screen flex-col">{children}</div>
      <Toast />
    </div>
  );
}
