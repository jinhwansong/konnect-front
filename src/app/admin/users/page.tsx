'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

import AdminShell from '@/components/common/AdminShell';
import AdminToolbar from '@/components/common/AdminToolbar';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/query/useAdmin';
import type { AdminUserRow, UserRole, UserStatus } from '@/types/admin';
import { formatDate } from '@/utils/helpers';

const ROLE_FILTERS: Array<{ label: string; value: 'all' | UserRole }> = [
  { label: '전체', value: 'all' },
  { label: '멘티', value: 'mentee' },
  { label: '멘토', value: 'mentor' },
  { label: '관리자', value: 'admin' },
];

const STATUS_FILTERS: Array<{ label: string; value: 'all' | UserStatus }> = [
  { label: '전체', value: 'all' },
  { label: '활성', value: 'active' },
  { label: '정지', value: 'suspended' },
];

type UserActionType = 'suspend' | 'restore';

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="사용자">
          <PageHeader
            title="사용자 관리"
            description="플랫폼의 모든 사용자를 조회하고 상태를 관리하세요."
          />
          <div className="mt-6 h-48 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </AdminShell>
      }
    >
      <AdminUsersPageInner />
    </Suspense>
  );
}

function AdminUsersPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');
  const q = searchParams.get('q') ?? '';
  const role = (searchParams.get('role') ?? 'all') as 'all' | UserRole;
  const status = (searchParams.get('status') ?? 'all') as 'all' | UserStatus;
  const sortParam = searchParams.get('sort') ?? 'createdAt:desc';

  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    type: UserActionType;
    user: AdminUserRow;
  } | null>(null);

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: '이름', sortable: true },
      { key: 'email', label: '이메일', sortable: true },
      { key: 'role', label: '역할', sortable: true },
      { key: 'createdAt', label: '가입일', sortable: true },
      { key: 'status', label: '상태', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '160px' },
    ],
    []
  );

  const { data, isLoading, isError, error } = useAdminUsers({
    page,
    limit,
    q,
    role,
    status,
    sort: sortParam,
  });

  const totalPages = data?.meta.totalPages ?? 1;

  const updateStatusMutation = useUpdateUserStatus();

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

  const handleFilterChange = (key: 'role' | 'status', value: string) => {
    setParams({ [key]: value, page: 1 });
  };

  const handleRowAction = (type: UserActionType, user: AdminUserRow) => {
    setActionTarget({ type, user });
  };

  return (
    <AdminShell title="사용자">
      <PageHeader
        title="사용자 관리"
        description="플랫폼의 모든 사용자를 조회하고 상태를 관리하세요."
      />

      <AdminToolbar
        filters={
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <FilterGroup
              label="역할"
              value={role}
              options={ROLE_FILTERS}
              onChange={value => handleFilterChange('role', value)}
            />
            <FilterGroup
              label="상태"
              value={status}
              options={STATUS_FILTERS}
              onChange={value => handleFilterChange('status', value)}
            />
          </div>
        }
      />

      {isError && !data ? (
        <EmptyState
          title="사용자 목록을 불러오지 못했습니다."
          description={error?.message ?? '새로고침 후 다시 시도해주세요.'}
        />
      ) : (
        <>
          <DataTable<AdminUserRow>
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="조건에 맞는 사용자가 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: sortParam.split(':')[0],
              direction: (sortParam.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            renderRow={row => (
              <>
                <td className="px-6 py-4 text-xs font-medium text-[var(--text-sub)]">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text)]">
                  {row.email}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.role}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {formatDate(row.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(row)}
                    >
                      상세보기
                    </Button>
                    {row.status === 'active' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRowAction('suspend', row)}
                      >
                        정지
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRowAction('restore', row)}
                      >
                        복구
                      </Button>
                    )}
                  </div>
                </td>
              </>
            )}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={nextPage => setParams({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        open={!!actionTarget}
        title={
          actionTarget?.type === 'suspend'
            ? '해당 사용자를 정지할까요?'
            : '해당 사용자를 복구할까요?'
        }
        description={
          actionTarget?.type === 'suspend'
            ? '정지된 사용자는 로그인 및 예약 기능이 제한됩니다.'
            : '복구 시 사용자가 다시 서비스를 이용할 수 있습니다.'
        }
        confirmText={actionTarget?.type === 'suspend' ? '정지' : '복구'}
        confirmVariant={actionTarget?.type === 'suspend' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (!actionTarget) return;
          updateStatusMutation.mutate({
            userId: actionTarget.user.id,
            suspended: actionTarget.type === 'suspend',
          });
          setActionTarget(null);
        }}
        onCancel={() => setActionTarget(null)}
      />

      {selectedUser && (
        <Modal
          title="사용자 상세"
          onClose={() => setSelectedUser(null)}
          size="lg"
        >
          <div className="space-y-4">
            <header>
              <h3 className="text-lg font-semibold text-[var(--text-bold)]">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-[var(--text-sub)]">
                {selectedUser.email}
              </p>
            </header>
            <dl className="space-y-3 text-sm text-[var(--text)]">
              <div className="flex justify-between">
                <dt className="text-[var(--text-sub)]">사용자 ID</dt>
                <dd>{selectedUser.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--text-sub)]">역할</dt>
                <dd>{selectedUser.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--text-sub)]">가입일</dt>
                <dd>{selectedUser.createdAt}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--text-sub)]">상태</dt>
                <dd>
                  <StatusBadge status={selectedUser.status} />
                </dd>
              </div>
            </dl>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSelectedUser(null)}
            >
              닫기
            </Button>
          </div>
        </Modal>
      )}
    </AdminShell>
  );
}

function FilterGroup<T extends string>({
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
    <div className="mr-5 flex items-center gap-4">
      <em className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
        {label}
      </em>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isActive = value === option.value;
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
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const label = status === 'active' ? '활성' : '정지';
  const appearance =
    status === 'active'
      ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
      : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]';

  return (
    <span
      className={`inline-flex min-w-[64px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${appearance}`}
    >
      {label}
    </span>
  );
}
