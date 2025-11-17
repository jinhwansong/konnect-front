'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[var(--text-bold)]">
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-sub)]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
