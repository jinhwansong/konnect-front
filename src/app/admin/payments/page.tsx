'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

import AdminShell from '@/components/common/AdminShell';
import AdminToolbar from '@/components/common/AdminToolbar';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import { useAdminPayments } from '@/hooks/query/useAdmin';
import type { AdminPaymentRow, PaymentStatus } from '@/types/admin';

const STATUS_FILTERS: Array<{ label: string; value: 'all' | PaymentStatus }> = [
  { label: '전체', value: 'all' },
  { label: '성공', value: '성공' },
  { label: '환불', value: '환불' },
  { label: '실패', value: '실패' },
];

export default function PaymentsAdminPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="결제">
          <PageHeader
            title="결제 내역"
            description="결제 기록을 모니터링하고 환불 요청을 처리하세요."
          />
          <div className="mt-6 h-48 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </AdminShell>
      }
    >
      <PaymentsAdminPageInner />
    </Suspense>
  );
}

function PaymentsAdminPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');
  const q = searchParams.get('q') ?? '';
  const status = (searchParams.get('status') ?? 'all') as 'all' | PaymentStatus;
  const sort = searchParams.get('sort') ?? 'paidAt:desc';
  const dateFrom = searchParams.get('dateFrom') ?? '';
  const dateTo = searchParams.get('dateTo') ?? '';

  const [refundTarget, setRefundTarget] = useState<AdminPaymentRow | null>(
    null
  );

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'orderId', label: '주문번호', sortable: true },
      { key: 'userName', label: '사용자', sortable: true },
      { key: 'amount', label: '금액', sortable: true },
      { key: 'status', label: '상태', sortable: true },
      { key: 'paidAt', label: '결제일시', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '120px' },
    ],
    []
  );

  const { data, isLoading, isError, error } = useAdminPayments({
    page,
    limit,
    q,
    status,
    sort,
  });

  const refundMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['admin', 'payments'],
      }),
  });

  const setParams = (
    updates: Record<string, string | number | null | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | 'none') => {
    setParams({
      sort: direction === 'none' ? null : `${key}:${direction}`,
      page: 1,
    });
  };

  return (
    <AdminShell title="결제">
      <PageHeader
        title="결제 내역"
        description="결제 기록을 모니터링하고 환불 요청을 처리하세요."
      />

      <AdminToolbar
        filters={
          <div className="grid gap-4 md:grid-cols-2">
            <FilterGroup
              legend="상태"
              value={status}
              options={STATUS_FILTERS}
              onChange={value => setParams({ status: value, page: 1 })}
            />
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
                기간
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={event =>
                    setParams({ dateFrom: event.target.value, page: 1 })
                  }
                  className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                />
                <span className="text-sm text-[var(--text-sub)]">~</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={event =>
                    setParams({ dateTo: event.target.value, page: 1 })
                  }
                  className="rounded-md border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        }
      />

      {isError && !data ? (
        <EmptyState
          title="결제 데이터를 불러오지 못했습니다."
          description={error?.message ?? '잠시 후 다시 시도하세요.'}
        />
      ) : (
        <>
          <DataTable<AdminPaymentRow>
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="조건에 맞는 결제 내역이 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: sort.split(':')[0],
              direction: (sort.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            onSort={handleSort}
            renderRow={row => (
              <>
                <td className="px-6 py-4 text-xs text-[var(--text-sub)]">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  {row.orderId}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text)]">
                  {row.userName}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  ₩{row.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.paidAt}
                </td>
                <td className="px-6 py-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setRefundTarget(row)}
                    disabled={row.status === '환불'}
                  >
                    환불 요청
                  </Button>
                </td>
              </>
            )}
          />

          <Pagination
            page={page}
            totalPages={data?.meta.totalPages ?? 1}
            onChange={nextPage => setParams({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        open={!!refundTarget}
        title="환불을 요청할까요?"
        description="환불 요청 시 정산팀에 알림이 전송됩니다."
        confirmText="환불 요청"
        confirmVariant="danger"
        onConfirm={() => {
          if (!refundTarget) return;
          refundMutation.mutate({ id: refundTarget.id });
          setRefundTarget(null);
        }}
        onCancel={() => setRefundTarget(null)}
      />
    </AdminShell>
  );
}

function FilterGroup<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:outline-none ${
                isActive
                  ? 'border-[var(--primary)] bg-[var(--primary-sub02)] text-[var(--primary)]'
                  : 'border-[var(--border-color)] text-[var(--text-sub)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const tone =
    status === '성공'
      ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
      : status === '환불'
        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
        : 'bg-[var(--hover-bg)] text-[var(--text-sub)]';
  return (
    <span
      className={`inline-flex min-w-[64px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}
