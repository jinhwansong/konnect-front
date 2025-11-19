'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, ReactNode, Suspense, useMemo, useState } from 'react';

import AdminShell from '@/components/common/AdminShell';
import AdminToolbar from '@/components/common/AdminToolbar';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import {
  useMentorApplicationDetail,
  useMentorApplications,
  useUpdateMentorApplicationStatus,
} from '@/hooks/query/useAdmin';
import type {
  MentorApplicationDetail,
  MentorApplicationRow,
  ApplicationStatus,
} from '@/types/admin';
import { formatDate } from '@/utils/helpers';

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

  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');
  const q = searchParams.get('q') ?? '';
  const status = (searchParams.get('status') ?? 'all') as
    | 'all'
    | ApplicationStatus;

  const [actionTarget, setActionTarget] = useState<{
    type: ActionType;
    application: MentorApplicationRow;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      { key: 'applicantName', label: '신청자', sortable: false },
      { key: 'email', label: '이메일', sortable: false },
      { key: 'expertise', label: '전문 분야', sortable: false },
      { key: 'submittedAt', label: '신청 일시', sortable: false },
      { key: 'status', label: '상태', sortable: false },
      { key: 'actions', label: '관리', sortable: false, width: '200px' },
    ],
    []
  );

  const CELL_PADDING_CLASS = 'px-4 py-3';
  const HEADER_PADDING_CLASS = 'px-4 py-3';

  const { data, isLoading, isError, error } = useMentorApplications({
    page,
    limit,
    q,
    status,
  });
  const mentorDetailQuery = useMentorApplicationDetail(detailId);
  const updateApplicationStatus = useUpdateMentorApplicationStatus();

  const totalPages = data?.meta.totalPages ?? 1;

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

  const handleStatusFilter = (value: 'all' | ApplicationStatus) => {
    setParams({ status: value === 'all' ? null : value, page: 1 });
  };

  const openAction = (type: ActionType, application: MentorApplicationRow) => {
    setActionTarget({ type, application });
    if (type === 'reject') {
      setRejectReason('');
    }
  };

  const closeAction = () => setActionTarget(null);

  const handleApprove = () => {
    if (!actionTarget || updateApplicationStatus.isPending) return;
    updateApplicationStatus.mutate(
      { id: actionTarget.application.id, status: 'approved' },
      {
        onSuccess: () => {
          closeAction();
        },
      }
    );
  };

  const handleReject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!actionTarget || updateApplicationStatus.isPending) return;
    updateApplicationStatus.mutate(
      {
        id: actionTarget.application.id,
        status: 'rejected',
        reason: rejectReason || '거절 사유 미입력',
      },
      {
        onSuccess: () => {
          closeAction();
          setRejectReason('');
        },
      }
    );
  };

  return (
    <AdminShell title="멘토 신청">
      <PageHeader
        title="멘토 신청 관리"
        description="신규 멘토 신청을 검토하고 승인 또는 거절 처리하세요."
      />

      <AdminToolbar
        filters={
          <FilterTabs
            label="상태"
            value={status}
            options={[{ label: '전체', value: 'all' }, ...STATUS_OPTIONS]}
            onChange={handleStatusFilter}
          />
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
            headerPaddingClassName={HEADER_PADDING_CLASS}
            cellPaddingClassName={CELL_PADDING_CLASS}
            renderRow={row => (
              <>
                <td
                  className={`${CELL_PADDING_CLASS} text-sm font-semibold text-[var(--text-bold)]`}
                >
                  {row.applicantName}
                </td>
                <td
                  className={`${CELL_PADDING_CLASS} text-sm text-[var(--text-sub)]`}
                >
                  {row.email}
                </td>
                <td
                  className={`${CELL_PADDING_CLASS} text-sm text-[var(--text)]`}
                >
                  {row.expertise || '—'}
                </td>
                <td
                  className={`${CELL_PADDING_CLASS} text-sm text-[var(--text-sub)]`}
                >
                  {formatDate(row.submittedAt)}
                </td>
                <td className={`${CELL_PADDING_CLASS} text-sm`}>
                  <ApplicationStatusBadge status={row.status} />
                </td>
                <td className={CELL_PADDING_CLASS}>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setDetailId(row.id)}
                    >
                      상세 보기
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openAction('approve', row)}
                    >
                      승인
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openAction('reject', row)}
                    >
                      거절
                    </Button>
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
        open={!!actionTarget && actionTarget.type === 'approve'}
        title="신청을 승인할까요?"
        description={`"${actionTarget?.application.applicantName}"님의 신청을 승인하면 멘토 권한이 부여됩니다.`}
        confirmText={updateApplicationStatus.isPending ? '처리 중...' : '승인'}
        onConfirm={() => {
          handleApprove();
        }}
        onCancel={closeAction}
      />

      {actionTarget && actionTarget.type === 'reject' && (
        <Modal title="거절 사유 입력" onClose={closeAction} size="md">
          <form className="flex h-full flex-col gap-4" onSubmit={handleReject}>
            <p className="text-sm text-[var(--text-sub)]">
              {actionTarget.application.applicantName}님의 신청에 대한 거절
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
                onClick={closeAction}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                loading={updateApplicationStatus.isPending}
              >
                거절 확정
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {detailId && (
        <MentorDetailModal
          mentorId={detailId}
          onClose={() => setDetailId(null)}
          isLoading={mentorDetailQuery.isLoading}
          detail={mentorDetailQuery.data}
        />
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
    <div className="mr-5 flex items-center gap-4">
      <em className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
        {label}
      </em>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
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

function MentorDetailModal({
  mentorId,
  detail,
  isLoading,
  onClose,
}: {
  mentorId: string;
  detail?: MentorApplicationDetail;
  isLoading: boolean;
  onClose: () => void;
}) {
  return (
    <Modal title="멘토 신청 상세" onClose={onClose} size="lg">
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <div className="h-5 w-32 animate-pulse rounded bg-[var(--background-sub)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--background-sub)]" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--background-sub)]" />
          </div>
        ) : detail ? (
          <>
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--background)] p-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs tracking-wide text-[var(--text-sub)]">
                  신청자
                </p>
                <p className="text-xs text-[var(--text-sub)]">
                  ID: {detail.id}
                </p>
                <p className="text-lg font-semibold text-[var(--text-bold)]">
                  {detail.applicantName}
                </p>
                <p className="text-sm text-[var(--text-sub)]">{detail.email}</p>
                {detail.phone && (
                  <p className="text-sm text-[var(--text-sub)]">
                    연락처: {detail.phone}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <DetailRow label="전문 분야" value={detail.expertise} />
              <DetailRow
                label="회사 / 직무"
                value={
                  detail.company || detail.position
                    ? `${detail.company ?? ''} ${detail.position ?? ''}`.trim()
                    : '—'
                }
              />
              <DetailRow label="경력" value={detail.career || '—'} />
              <DetailRow
                label="소개"
                value={detail.introduce || '—'}
                multiline
              />
              <DetailRow
                label="포트폴리오"
                value={
                  detail.portfolio ? (
                    <a
                      href={detail.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] underline"
                    >
                      링크 열기
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailRow
                label="신청 일시"
                value={formatDate(detail.createdAt)}
              />
              <DetailRow
                label="상태"
                value={<ApplicationStatusBadge status={detail.status} />}
              />
            </section>
          </>
        ) : (
          <EmptyState
            title="상세 정보를 불러오지 못했습니다."
            description={`멘토 ID ${mentorId} 정보를 잠시 후 다시 시도해주세요.`}
          />
        )}

        <Button type="button" variant="outline" onClick={onClose}>
          닫기
        </Button>
      </div>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: ReactNode;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
      <p className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
        {label}
      </p>
      <div
        className={`mt-2 text-sm text-[var(--text)] ${multiline ? 'whitespace-pre-line' : ''}`}
      >
        {value ?? '—'}
      </div>
    </div>
  );
}
