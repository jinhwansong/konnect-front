'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import FlexibleTable from '@/components/common/FlexibleTable';
import Pagination from '@/components/common/Pagination';
import { sessionsColumns } from '@/contact/session';
import { useGetSession } from '@/hooks/query/useSession';
import { SessionItem } from '@/types/session';

export default function SessionsPage() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data: sessions } = useGetSession(page);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowClick = useCallback(
    (row: SessionItem) => {
      router.push(`/my/sessions/${row.id}`);
    },
    [router]
  );

  return (
    <section className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-2xl font-bold text-[var(--text-bold)]">
          내 세션 목록
        </h4>
        <Link
          href="/my/sessions/create"
          className="block rounded-md bg-[var(--primary-sub01)] px-4 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--primary)]"
          aria-label="새 세션 등록"
        >
          + 세션 등록
        </Link>
      </div>
      <FlexibleTable
        data={sessions?.data as SessionItem[]}
        columns={sessionsColumns}
        onRowClick={handleRowClick}
      />
      <Pagination
        page={page}
        totalPages={sessions?.totalPages || 1}
        onChange={handlePageChange}
      />
    </section>
  );
}
