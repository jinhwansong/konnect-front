'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({
  title = '결과가 없습니다.',
  description = '조건을 변경하거나 다시 시도해주세요.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-16 text-center shadow-sm">
      {icon && <div className="text-3xl text-[var(--text-sub)]">{icon}</div>}
      <h3 className="text-base font-semibold text-[var(--text-bold)]">
        {title}
      </h3>
      <p className="max-w-md text-sm text-[var(--text-sub)]">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
