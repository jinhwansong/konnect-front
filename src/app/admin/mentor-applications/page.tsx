'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react';

import AdminShell from '@/components/common/AdminShell';
import AdminToolbar from '@/components/common/AdminToolbar';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import { useMentorApplications } from '@/hooks/query/useAdmin';
import type { MentorApplicationRow, ApplicationStatus } from '@/types/admin';

const STATUS_OPTIONS: Array<{
  label: string;
  value: 'all' | ApplicationStatus;
}> = [
  { label: '대기', value: 'pending' },
  { label: '승인', value: 'approved' },
  { label: '거절', value: 'rejected' },
];

type ActionType = 'approve' | 'reject';

export default function MentorApplicationsPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="멘토 신청">
          <PageHeader
            title="멘토 신청 관리"
            description="신규 멘토 신청을 검토하고 승인 또는 거절 처리하세요."
          />
          <div className="mt-6 h-48 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </AdminShell>
      }
    >
      <MentorApplicationsPageInner />
    </Suspense>
  );
}

function MentorApplicationsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');
  const q = searchParams.get('q') ?? '';
  const status = (searchParams.get('status') ?? 'pending') as
    | 'all'
    | ApplicationStatus;
  const sortParam = searchParams.get('sort') ?? 'submittedAt:desc';

  const [searchTerm, setSearchTerm] = useState(q);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionTarget, setActionTarget] = useState<{
    type: ActionType;
    applications: MentorApplicationRow[];
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  const columns = useMemo(
    () => [
      { key: 'select', label: '선택', sortable: false, width: '48px' },
      { key: 'id', label: 'ID', sortable: true },
      { key: 'applicantName', label: '신청자', sortable: true },
      { key: 'careerYears', label: '경력', sortable: true },
      { key: 'portfolioUrl', label: '포트폴리오', sortable: false },
      { key: 'submittedAt', label: '신청일시', sortable: true },
      { key: 'status', label: '상태', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '160px' },
    ],
    []
  );

  const { data, isLoading, isError, error } = useMentorApplications({
    page,
    limit,
    q,
    status,
    sort: sortParam,
  });

  const totalPages = data?.meta.totalPages ?? 1;

  const approveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'mentor-applications'],
      });
      setSelectedIds([]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (payload: { ids: string[]; reason: string }) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'mentor-applications'],
      });
      setSelectedIds([]);
      setRejectReason('');
    },
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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setParams({ q: searchTerm || null, page: 1 });
  };

  const handleStatusFilter = (value: 'all' | ApplicationStatus) => {
    setParams({ status: value, page: 1 });
    setSelectedIds([]);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | 'none') => {
    const nextSort = direction === 'none' ? null : `${key}:${direction}`;
    setParams({ sort: nextSort, page: 1 });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const ids = data?.data.map(item => item.id) ?? [];
    if (!ids.length) return;
    const allSelected = ids.every(id => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  };

  const openAction = (
    type: ActionType,
    applications: MentorApplicationRow[]
  ) => {
    setActionTarget({ type, applications });
    if (type === 'reject') {
      setRejectReason('');
    }
  };

  return (
    <AdminShell title="멘토 신청">
      <PageHeader
        title="멘토 신청 관리"
        description="신규 멘토 신청을 검토하고 승인 또는 거절 처리하세요."
      />

      <AdminToolbar
        search={
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3"
          >
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="신청자, 포트폴리오 URL 검색"
                label="멘토 신청 검색"
              />
            </div>
            <Button type="submit" size="sm">
              검색
            </Button>
          </form>
        }
        filters={
          <FilterTabs
            label="상태"
            value={status}
            options={[{ label: '전체', value: 'all' }, ...STATUS_OPTIONS]}
            onChange={handleStatusFilter}
          />
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!selectedIds.length}
              onClick={() =>
                openAction(
                  'approve',
                  (data?.data ?? []).filter(item =>
                    selectedIds.includes(item.id)
                  )
                )
              }
            >
              선택 승인
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!selectedIds.length}
              onClick={() =>
                openAction(
                  'reject',
                  (data?.data ?? []).filter(item =>
                    selectedIds.includes(item.id)
                  )
                )
              }
            >
              선택 거절
            </Button>
          </div>
        }
      />

      {isError && !data ? (
        <EmptyState
          title="멘토 신청 정보를 가져오지 못했어요."
          description={error?.message ?? '다시 시도해주세요.'}
        />
      ) : (
        <>
          <DataTable<MentorApplicationRow>
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="조건에 맞는 멘토 신청이 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: sortParam.split(':')[0],
              direction: (sortParam.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            onSort={handleSort}
            renderRow={row => (
              <>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    aria-label={`${row.applicantName} 신청 선택`}
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelection(row.id)}
                    className="h-4 w-4 rounded border border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[var(--text-sub)]">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  {row.applicantName}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text)]">
                  {row.careerYears}년
                </td>
                <td className="px-6 py-4 text-sm text-[var(--primary-sub03)] underline">
                  <a
                    href={row.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    포트폴리오 보기
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.submittedAt}
                </td>
                <td className="px-6 py-4 text-sm">
                  <ApplicationStatusBadge status={row.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openAction('approve', [row])}
                    >
                      승인
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openAction('reject', [row])}
                    >
                      거절
                    </Button>
                  </div>
                </td>
              </>
            )}
          />

          <div className="mt-3 flex items-center gap-3 px-1">
            <input
              type="checkbox"
              aria-label="현재 페이지 전체 선택"
              checked={
                data?.data.length
                  ? data.data.every(item => selectedIds.includes(item.id))
                  : false
              }
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-xs text-[var(--text-sub)]">
              현재 페이지 {selectedIds.length}건 선택됨
            </span>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={nextPage => setParams({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        open={!!actionTarget && actionTarget.type === 'approve'}
        title="신청을 승인할까요?"
        description="선택한 신청을 승인하면 멘토가 활동을 시작할 수 있습니다."
        confirmText="승인"
        onConfirm={() => {
          if (!actionTarget) return;
          approveMutation.mutate(actionTarget.applications.map(app => app.id));
          setActionTarget(null);
        }}
        onCancel={() => setActionTarget(null)}
      />

      {actionTarget && actionTarget.type === 'reject' && (
        <Modal
          title="거절 사유 입력"
          onClose={() => setActionTarget(null)}
          size="md"
        >
          <form
            className="flex h-full flex-col gap-4"
            onSubmit={event => {
              event.preventDefault();
              rejectMutation.mutate({
                ids: actionTarget.applications.map(app => app.id),
                reason: rejectReason || '사유 미입력',
              });
              setActionTarget(null);
            }}
          >
            <p className="text-sm text-[var(--text-sub)]">
              선택한 신청 {actionTarget.applications.length}건에 대한 거절
              사유를 입력해주세요.
            </p>
            <textarea
              value={rejectReason}
              onChange={event => setRejectReason(event.target.value)}
              rows={6}
              placeholder="거절 사유를 작성하세요."
              className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--background)] p-3 text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActionTarget(null)}
              >
                취소
              </Button>
              <Button type="submit" variant="danger" size="sm">
                거절 확정
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminShell>
  );
}

function FilterTabs<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xs font-semibold tracking-wide text-[var(--text-sub)] uppercase">
        {label}
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

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const appearance =
    status === 'approved'
      ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
      : status === 'rejected'
        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
        : 'bg-[var(--hover-bg)] text-[var(--text-sub)]';
  const label =
    status === 'approved' ? '승인' : status === 'rejected' ? '거절' : '대기';

  return (
    <span
      className={`inline-flex min-w-[64px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${appearance}`}
    >
      {label}
    </span>
  );
}
