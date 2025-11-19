'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import AdminShell from '@/components/common/AdminShell';
import AdminToolbar from '@/components/common/AdminToolbar';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import { Toggle } from '@/components/common/Toggle';
import {
  useAdminNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from '@/hooks/query/useAdmin';
import type { AdminNoticeRow } from '@/types/admin';

interface NoticeFormValues {
  title: string;
  content: string;
  published: boolean;
}

const PUBLISHED_FILTERS = [
  { label: '전체', value: 'all' },
  { label: '공개', value: 'true' },
  { label: '비공개', value: 'false' },
] as const;

export default function NoticesAdminPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="공지">
          <PageHeader
            title="공지 관리"
            description="서비스 공지를 등록하고 업데이트하세요."
          />
          <div className="mt-6 h-48 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </AdminShell>
      }
    >
      <NoticesAdminPageInner />
    </Suspense>
  );
}

function NoticesAdminPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '10');
  const q = searchParams.get('q') ?? '';
  const published = searchParams.get('published') ?? 'all';
  const sort = searchParams.get('sort') ?? 'createdAt:desc';

  const [editingNotice, setEditingNotice] = useState<AdminNoticeRow | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminNoticeRow | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<NoticeFormValues>({
    defaultValues: {
      title: '',
      content: '',
      published: true,
    },
  });

  const noticesQuery = useAdminNotices({
    page,
    limit,
    q,
    published,
    sort,
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

  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const deleteMutation = useDeleteNotice();

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'title', label: '제목', sortable: true },
      { key: 'published', label: '공개', sortable: true },
      { key: 'createdAt', label: '작성일', sortable: true },
      { key: 'updatedAt', label: '수정일', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '140px' },
    ],
    []
  );

  const onSubmit = async (values: NoticeFormValues) => {
    if (editingNotice) {
      await updateMutation.mutateAsync({
        id: editingNotice.id,
        ...values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    reset({ title: '', content: '', published: true });
    setEditingNotice(null);
  };

  return (
    <AdminShell title="공지">
      <PageHeader
        title="공지 관리"
        description="서비스 공지를 등록하고 업데이트하세요."
      />

      <AdminToolbar
        filters={
          <FilterBar
            value={published}
            onChange={value => setParams({ published: value, page: 1 })}
          />
        }
      />

      {noticesQuery.isError && !noticesQuery.data ? (
        <EmptyState
          title="공지를 불러오지 못했습니다."
          description={
            noticesQuery.error instanceof Error
              ? noticesQuery.error.message
              : '잠시 후 다시 시도해주세요.'
          }
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--text-bold)]">
                  공지 목록
                </h2>
                <p className="text-xs text-[var(--text-sub)]">
                  등록된 공지의 공개 상태를 확인하고 수정하세요.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
                정렬
                <select
                  value={sort}
                  onChange={event =>
                    setParams({ sort: event.target.value, page: 1 })
                  }
                  className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs"
                >
                  <option value="createdAt:desc">최신 작성순</option>
                  <option value="createdAt:asc">오래된 순</option>
                  <option value="title:asc">제목 오름차순</option>
                  <option value="title:desc">제목 내림차순</option>
                </select>
              </div>
            </header>
            <DataTable<AdminNoticeRow>
              columns={columns}
              data={noticesQuery.data?.data ?? []}
              isLoading={noticesQuery.isLoading}
              isError={noticesQuery.isError}
              errorMessage={
                noticesQuery.error instanceof Error
                  ? noticesQuery.error.message
                  : undefined
              }
              emptyMessage="등록된 공지가 없습니다."
              getRowKey={row => row.id}
              sortState={{
                key: sort.split(':')[0],
                direction: (sort.split(':')[1] as 'asc' | 'desc') ?? 'none',
              }}
              onSort={(key, direction) =>
                setParams({
                  sort: direction === 'none' ? null : `${key}:${direction}`,
                  page: 1,
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
                  <td className="px-6 py-4 text-sm">
                    <StatusTag
                      label={row.published ? '공개' : '비공개'}
                      tone={row.published ? 'primary' : 'muted'}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                    {row.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                    {row.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingNotice(
                            row.id === 'optimistic' ? null : row
                          );
                          reset({
                            title: row.title,
                            content: row.content,
                            published: row.published,
                          });
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          row.id !== 'optimistic' && setDeleteTarget(row)
                        }
                        disabled={row.id === 'optimistic'}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </>
              )}
            />

            <Pagination
              page={page}
              totalPages={noticesQuery.data?.meta.totalPages ?? 1}
              onChange={nextPage => setParams({ page: nextPage })}
            />
          </section>

          <section className="rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--text-bold)]">
              {editingNotice ? '공지 수정' : '공지 작성'}
            </h2>
            <p className="mt-1 text-xs text-[var(--text-sub)]">
              {editingNotice
                ? '선택한 공지를 수정하고 저장하세요.'
                : '새로운 공지를 작성해 운영팀과 사용자에게 공유하세요.'}
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-bold)]">
                  제목
                </label>
                <input
                  {...register('title', { required: true })}
                  placeholder="공지 제목을 입력하세요"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-bold)]">
                  내용
                </label>
                <textarea
                  {...register('content', { required: true })}
                  rows={8}
                  placeholder="공지 내용을 입력하세요"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--text-bold)]">
                    공개 여부
                  </p>
                  <p className="text-xs text-[var(--text-sub)]">
                    공개 시 즉시 사용자에게 노출됩니다.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="published"
                  render={({ field: { value, onChange } }) => (
                    <Toggle
                      checked={value}
                      onCheckedChange={onChange}
                      aria-label="공개 여부"
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    reset({ title: '', content: '', published: true });
                    setEditingNotice(null);
                  }}
                >
                  초기화
                </Button>
                <Button type="submit" size="sm" loading={isSubmitting}>
                  {editingNotice ? '공지 수정' : '공지 등록'}
                </Button>
              </div>

              <p className="text-xs text-[var(--text-sub)]">
                공지는 관리자 권한 계정만 접근할 수 있으며, 권한 변경은{' '}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-0 text-[var(--primary)]"
                  onClick={() => router.push('/admin/roles')}
                >
                  권한 관리 페이지
                </Button>
                에서 가능합니다.
              </p>
            </form>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="공지를 삭제할까요?"
        description="삭제된 공지는 복구할 수 없습니다."
        confirmText="삭제"
        confirmVariant="danger"
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}

function FilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold tracking-wide text-[var(--text-sub)]">
        공개 상태
      </legend>
      <div className="flex flex-wrap gap-2">
        {PUBLISHED_FILTERS.map(option => {
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

function StatusTag({
  label,
  tone,
}: {
  label: string;
  tone: 'primary' | 'muted';
}) {
  return (
    <span
      className={`inline-flex min-w-[64px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${
        tone === 'primary'
          ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
          : 'bg-[var(--hover-bg)] text-[var(--text-sub)]'
      }`}
    >
      {label}
    </span>
  );
}
