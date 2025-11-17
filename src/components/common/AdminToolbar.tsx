'use client';

import { ReactNode } from 'react';

interface AdminToolbarProps {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function AdminToolbar({
  search,
  filters,
  actions,
  className,
}: AdminToolbarProps) {
  return (
    <section
      className={`mt-6 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-5 shadow-sm ${className || ''}`}
      aria-label="검색 및 필터 바"
    >
      <div className="flex flex-col gap-4 lg:items-center lg:justify-between">
        <div
          className="flex w-full flex-col gap-3 lg:flex-1"
          data-slot="toolbar-filters"
        >
          {filters}
        </div>
        {actions && (
          <div
            className="flex w-full justify-end gap-3 lg:w-auto"
            data-slot="toolbar-actions"
          >
            {actions}
          </div>
        )}
        {search && (
          <div className="w-full lg:flex-1" data-slot="toolbar-search">
            {search}
          </div>
        )}
      </div>
    </section>
  );
}
