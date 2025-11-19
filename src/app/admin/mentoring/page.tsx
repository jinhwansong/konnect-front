'use client';
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
import {
  useMentoringReservations,
  useMentoringSessions,
  useToggleSessionPublic,
  useUpdateReservationStatus,
} from '@/hooks/query/useAdmin';
import type { MentoringSessionRow, ReservationRow } from '@/types/admin';

const SESSION_STATUS_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '공개', value: 'published' },
  { label: '비공개', value: 'draft' },
] as const;

const RESERVATION_STATUS_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '대기', value: 'pending' },
  { label: '확정', value: 'confirmed' },
  { label: '취소', value: 'cancelled' },
] as const;

type SessionAction = { type: 'toggle'; session: MentoringSessionRow } | null;
type ReservationAction =
  | { type: 'confirm'; reservation: ReservationRow }
  | { type: 'cancel'; reservation: ReservationRow }
  | null;

export default function MentoringAdminPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="멘토링">
          <PageHeader
            title="멘토링 운영"
            description="멘토링 세션과 예약 현황을 모니터링하고 신속하게 조치하세요."
          />
          <div className="mt-6 h-48 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </AdminShell>
      }
    >
      <MentoringAdminPageInner />
    </Suspense>
  );
}

function MentoringAdminPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const sessionStatus = searchParams.get('sessionStatus') ?? 'all';
  const reservationStatus = searchParams.get('reservationStatus') ?? 'all';

  const sessionPage = Number(searchParams.get('sessionPage') ?? '1');
  const sessionLimit = Number(searchParams.get('sessionLimit') ?? '10');
  const sessionSort = searchParams.get('sessionSort') ?? 'startAt:desc';

  const reservationPage = Number(searchParams.get('reservationPage') ?? '1');
  const reservationLimit = Number(searchParams.get('reservationLimit') ?? '10');
  const reservationSort = searchParams.get('reservationSort') ?? 'time:desc';

  const [sessionAction, setSessionAction] = useState<SessionAction>(null);
  const [reservationAction, setReservationAction] =
    useState<ReservationAction>(null);

  const sessionColumns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'title', label: '세션', sortable: true },
      { key: 'mentorName', label: '멘토', sortable: true },
      { key: 'category', label: '카테고리', sortable: true },
      { key: 'isPublic', label: '공개 여부', sortable: true },
      { key: 'startAt', label: '시작일시', sortable: true },
      { key: 'price', label: '가격', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '140px' },
    ],
    []
  );

  const reservationColumns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'sessionTitle', label: '세션', sortable: true },
      { key: 'menteeName', label: '멘티', sortable: true },
      { key: 'time', label: '예약 시간', sortable: true },
      { key: 'status', label: '상태', sortable: true },
      { key: 'paid', label: '결제', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '140px' },
    ],
    []
  );

  const {
    data: sessionsData,
    isLoading: sessionLoading,
    isError: sessionError,
    error: sessionErrorObj,
  } = useMentoringSessions({
    q,
    status: sessionStatus,
    page: sessionPage,
    limit: sessionLimit,
    sort: sessionSort,
  });

  const {
    data: reservationsData,
    isLoading: reservationLoading,
    isError: reservationError,
    error: reservationErrorObj,
  } = useMentoringReservations({
    q,
    status: reservationStatus,
    page: reservationPage,
    limit: reservationLimit,
    sort: reservationSort,
  });

  const toggleSessionMutation = useToggleSessionPublic();
  const reservationStatusMutation = useUpdateReservationStatus();

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

  return (
    <AdminShell title="멘토링">
      <PageHeader
        title="멘토링 운영"
        description="멘토링 세션과 예약 현황을 모니터링하고 신속하게 조치하세요."
      />

      <AdminToolbar
        filters={
          <div className="flex">
            <FilterGroup
              legend="세션 상태"
              value={sessionStatus}
              options={SESSION_STATUS_FILTERS}
              onChange={value =>
                setParams({ sessionStatus: value, sessionPage: 1 })
              }
            />
            <FilterGroup
              legend="예약 상태"
              value={reservationStatus}
              options={RESERVATION_STATUS_FILTERS}
              onChange={value =>
                setParams({ reservationStatus: value, reservationPage: 1 })
              }
            />
          </div>
        }
      />

      {sessionError && !sessionsData ? (
        <EmptyState
          title="세션 정보를 불러오지 못했습니다."
          description={sessionErrorObj?.message ?? '잠시 후 다시 시도하세요.'}
        />
      ) : (
        <section className="mt-8 rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-bold)]">
                세션 목록
              </h2>
              <p className="text-xs text-[var(--text-sub)]">
                공개 토글과 세션 상세보기를 통해 콘텐츠를 관리하세요.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
              페이지당
              <select
                value={sessionLimit}
                onChange={event =>
                  setParams({
                    sessionLimit: Number(event.target.value),
                    sessionPage: 1,
                  })
                }
                className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs"
                aria-label="세션 페이지당 개수"
              >
                {[10, 20, 30].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <DataTable<MentoringSessionRow>
            columns={sessionColumns}
            data={sessionsData?.data ?? []}
            isLoading={sessionLoading}
            isError={sessionError}
            errorMessage={sessionErrorObj?.message}
            emptyMessage="조건에 맞는 세션이 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: sessionSort.split(':')[0],
              direction:
                (sessionSort.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            onSort={(key, direction) =>
              setParams({
                sessionSort:
                  direction === 'none' ? null : `${key}:${direction}`,
                sessionPage: 1,
              })
            }
            renderRow={row => (
              <>
                <td className="px-6 py-4 text-xs text-[var(--text-sub)]">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  {row.title}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text)]">
                  {row.mentorName}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.category}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusPill
                    label={row.isPublic ? '공개' : '비공개'}
                    tone={row.isPublic ? 'primary' : 'muted'}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.startAt}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  ₩{row.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSessionAction({ type: 'toggle', session: row })
                      }
                    >
                      {row.isPublic ? '비공개' : '공개'} 전환
                    </Button>
                    <Button type="button" size="sm" variant="ghost">
                      보기
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
          <Pagination
            page={sessionPage}
            totalPages={sessionsData?.meta?.totalPages ?? 1}
            onChange={nextPage => setParams({ sessionPage: nextPage })}
          />
        </section>
      )}

      {reservationError && !reservationsData ? (
        <EmptyState
          title="예약 정보를 불러오지 못했습니다."
          description={
            reservationErrorObj?.message ?? '잠시 후 다시 시도하세요.'
          }
        />
      ) : (
        <section className="mt-8 rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-bold)]">
                예약 목록
              </h2>
              <p className="text-xs text-[var(--text-sub)]">
                예약 상태를 확정하거나 취소하여 사용자를 지원하세요.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
              페이지당
              <select
                value={reservationLimit}
                onChange={event =>
                  setParams({
                    reservationLimit: Number(event.target.value),
                    reservationPage: 1,
                  })
                }
                className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs"
                aria-label="예약 페이지당 개수"
              >
                {[10, 20, 30].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <DataTable<ReservationRow>
            columns={reservationColumns}
            data={reservationsData?.data ?? []}
            isLoading={reservationLoading}
            isError={reservationError}
            errorMessage={reservationErrorObj?.message}
            emptyMessage="조건에 맞는 예약이 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: reservationSort.split(':')[0],
              direction:
                (reservationSort.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            onSort={(key, direction) =>
              setParams({
                reservationSort:
                  direction === 'none' ? null : `${key}:${direction}`,
                reservationPage: 1,
              })
            }
            renderRow={row => (
              <>
                <td className="px-6 py-4 text-xs text-[var(--text-sub)]">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  {row.sessionTitle}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text)]">
                  {row.menteeName}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.time}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusPill
                    label={
                      row.status === 'confirmed'
                        ? '확정'
                        : row.status === 'cancelled'
                          ? '취소'
                          : '대기'
                    }
                    tone={
                      row.status === 'confirmed'
                        ? 'primary'
                        : row.status === 'cancelled'
                          ? 'danger'
                          : 'muted'
                    }
                  />
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusPill
                    label={row.paid ? '결제완료' : '미결제'}
                    tone={row.paid ? 'primary' : 'muted'}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setReservationAction({
                          type: 'confirm',
                          reservation: row,
                        })
                      }
                      disabled={row.status === 'confirmed'}
                    >
                      확정
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setReservationAction({
                          type: 'cancel',
                          reservation: row,
                        })
                      }
                      disabled={row.status === 'cancelled'}
                    >
                      취소
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
          <Pagination
            page={reservationPage}
            totalPages={reservationsData?.meta?.totalPages ?? 1}
            onChange={nextPage => setParams({ reservationPage: nextPage })}
          />
        </section>
      )}

      <ConfirmDialog
        open={!!sessionAction}
        title="세션 공개 상태를 변경할까요?"
        description="변경 즉시 사용자에게 노출 상태가 반영됩니다."
        confirmText="변경"
        onConfirm={() => {
          if (!sessionAction) return;
          toggleSessionMutation.mutate({
            sessionId: sessionAction.session.id,
            isPublic: !sessionAction.session.isPublic,
          });
          setSessionAction(null);
        }}
        onCancel={() => setSessionAction(null)}
      />

      <ConfirmDialog
        open={!!reservationAction}
        title={
          reservationAction?.type === 'confirm'
            ? '예약을 확정할까요?'
            : '예약을 취소할까요?'
        }
        description={
          reservationAction?.type === 'confirm'
            ? '확정 시 멘티에게 확정 알림이 발송됩니다.'
            : '취소 시 멘티에게 취소 안내가 발송됩니다.'
        }
        confirmText={reservationAction?.type === 'confirm' ? '확정' : '취소'}
        confirmVariant={
          reservationAction?.type === 'cancel' ? 'danger' : 'primary'
        }
        onConfirm={() => {
          if (!reservationAction) return;
          reservationStatusMutation.mutate({
            reservationId: reservationAction.reservation.id,
            status:
              reservationAction.type === 'confirm' ? 'confirmed' : 'cancelled',
          });
          setReservationAction(null);
        }}
        onCancel={() => setReservationAction(null)}
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
  options: ReadonlyArray<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="mr-5 flex items-center gap-4">
      <em className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
        {legend}
      </em>
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
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: 'primary' | 'danger' | 'muted';
}) {
  const appearance =
    tone === 'primary'
      ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
      : tone === 'danger'
        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
        : 'bg-[var(--hover-bg)] text-[var(--text-sub)]';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${appearance}`}
    >
      {label}
    </span>
  );
}
