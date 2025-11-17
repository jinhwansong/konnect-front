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
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import SearchInput from '@/components/common/SearchInput';
import { useAdminArticles, useAdminReviews } from '@/hooks/query/useAdmin';
import type { AdminArticleRow, AdminReviewRow } from '@/types/admin';

const ARTICLE_STATUS_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '발행', value: 'published' },
  { label: '임시', value: 'draft' },
  { label: '보관', value: 'archived' },
] as const;

const REVIEW_REPORT_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '신고됨', value: 'reported' },
  { label: '정상', value: 'clean' },
] as const;

type ArticleAction =
  | { type: 'toggle'; article: AdminArticleRow }
  | { type: 'delete'; article: AdminArticleRow }
  | null;

type ReviewAction =
  | { type: 'hide'; review: AdminReviewRow }
  | { type: 'restore'; review: AdminReviewRow }
  | null;

export default function ContentsAdminPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="콘텐츠">
          <PageHeader
            title="콘텐츠 관리"
            description="아티클과 후기 콘텐츠를 관리하고 신고된 항목을 처리하세요."
          />
          <div className="mt-6 h-48 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </AdminShell>
      }
    >
      <ContentsAdminPageInner />
    </Suspense>
  );
}

function ContentsAdminPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const q = searchParams.get('q') ?? '';
  const articleStatus = searchParams.get('articleStatus') ?? 'all';
  const reviewReported = searchParams.get('reviewReported') ?? 'all';
  const articlePage = Number(searchParams.get('articlePage') ?? '1');
  const articleLimit = Number(searchParams.get('articleLimit') ?? '10');
  const articleSort = searchParams.get('articleSort') ?? 'createdAt:desc';
  const reviewPage = Number(searchParams.get('reviewPage') ?? '1');
  const reviewLimit = Number(searchParams.get('reviewLimit') ?? '10');
  const reviewSort = searchParams.get('reviewSort') ?? 'createdAt:desc';

  const [searchTerm, setSearchTerm] = useState(q);
  const [articleAction, setArticleAction] = useState<ArticleAction>(null);
  const [reviewAction, setReviewAction] = useState<ReviewAction>(null);

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  const articleColumns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'title', label: '제목', sortable: true },
      { key: 'author', label: '작성자', sortable: true },
      { key: 'views', label: '조회수', sortable: true },
      { key: 'likes', label: '좋아요', sortable: true },
      { key: 'createdAt', label: '작성일', sortable: true },
      { key: 'status', label: '상태', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '180px' },
    ],
    []
  );

  const reviewColumns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'targetSession', label: '세션', sortable: true },
      { key: 'author', label: '작성자', sortable: true },
      { key: 'rating', label: '평점', sortable: true },
      { key: 'createdAt', label: '작성일', sortable: true },
      { key: 'reported', label: '신고', sortable: true },
      { key: 'actions', label: '액션', sortable: false, width: '140px' },
    ],
    []
  );

  const articlesQuery = useAdminArticles({
    q,
    status: articleStatus,
    page: articlePage,
    limit: articleLimit,
    sort: articleSort,
  });

  const reviewsQuery = useAdminReviews({
    q,
    reported: reviewReported,
    page: reviewPage,
    limit: reviewLimit,
    sort: reviewSort,
  });

  const articleMutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: 'toggle' | 'delete';
    }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'contents', 'articles'],
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: 'hide' | 'restore';
    }) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { id, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'contents', 'reviews'],
      });
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setParams({
      q: searchTerm || null,
      articlePage: 1,
      reviewPage: 1,
    });
  };

  return (
    <AdminShell title="콘텐츠">
      <PageHeader
        title="콘텐츠 관리"
        description="아티클과 후기 콘텐츠를 관리하고 신고된 항목을 처리하세요."
      />

      <AdminToolbar
        search={
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="아티클 제목, 작성자, 세션명 검색"
                label="콘텐츠 검색"
              />
            </div>
            <Button type="submit" size="sm">
              검색
            </Button>
          </form>
        }
        filters={
          <div className="grid gap-4 md:grid-cols-2">
            <FilterButtons
              legend="아티클 상태"
              value={articleStatus}
              options={ARTICLE_STATUS_OPTIONS}
              onChange={value =>
                setParams({ articleStatus: value, articlePage: 1 })
              }
            />
            <FilterButtons
              legend="후기 신고 상태"
              value={reviewReported}
              options={REVIEW_REPORT_OPTIONS}
              onChange={value =>
                setParams({ reviewReported: value, reviewPage: 1 })
              }
            />
          </div>
        }
      />

      {articlesQuery.isError && !articlesQuery.data ? (
        <EmptyState
          title="아티클 정보를 불러오지 못했습니다."
          description={
            articlesQuery.error instanceof Error
              ? articlesQuery.error.message
              : '잠시 후 다시 시도하세요.'
          }
        />
      ) : (
        <section className="mt-8 rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-bold)]">
                아티클
              </h2>
              <p className="text-xs text-[var(--text-sub)]">
                발행 상태와 노출을 관리하고 필요한 경우 콘텐츠를 제거하세요.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
              페이지당
              <select
                value={articleLimit}
                onChange={event =>
                  setParams({
                    articleLimit: Number(event.target.value),
                    articlePage: 1,
                  })
                }
                className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs"
              >
                {[10, 20, 30].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <DataTable<AdminArticleRow>
            columns={articleColumns}
            data={articlesQuery.data?.data ?? []}
            isLoading={articlesQuery.isLoading}
            isError={articlesQuery.isError}
            errorMessage={
              articlesQuery.error instanceof Error
                ? articlesQuery.error.message
                : undefined
            }
            emptyMessage="조건에 맞는 아티클이 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: articleSort.split(':')[0],
              direction:
                (articleSort.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            onSort={(key, direction) =>
              setParams({
                articleSort:
                  direction === 'none' ? null : `${key}:${direction}`,
                articlePage: 1,
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
                  {row.author}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.likes.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.createdAt}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge
                    tone={
                      row.status === 'published'
                        ? 'primary'
                        : row.status === 'archived'
                          ? 'muted'
                          : 'info'
                    }
                    label={
                      row.status === 'published'
                        ? '발행'
                        : row.status === 'archived'
                          ? '보관'
                          : '임시'
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setArticleAction({ type: 'toggle', article: row })
                      }
                    >
                      {row.status === 'published' ? '비공개' : '발행'}
                    </Button>
                    <Button type="button" size="sm" variant="ghost">
                      미리보기
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setArticleAction({ type: 'delete', article: row })
                      }
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
          <Pagination
            page={articlePage}
            totalPages={articlesQuery.data?.meta?.totalPages ?? 1}
            onChange={nextPage => setParams({ articlePage: nextPage })}
          />
        </section>
      )}

      {reviewsQuery.isError && !reviewsQuery.data ? (
        <EmptyState
          title="후기 정보를 불러오지 못했습니다."
          description={
            reviewsQuery.error instanceof Error
              ? reviewsQuery.error.message
              : '잠시 후 다시 시도하세요.'
          }
        />
      ) : (
        <section className="mt-8 rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
          <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-bold)]">
                후기
              </h2>
              <p className="text-xs text-[var(--text-sub)]">
                신고된 후기를 검토하고 숨김/복구 처리하세요.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-sub)]">
              페이지당
              <select
                value={reviewLimit}
                onChange={event =>
                  setParams({
                    reviewLimit: Number(event.target.value),
                    reviewPage: 1,
                  })
                }
                className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs"
              >
                {[10, 20, 30].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <DataTable<AdminReviewRow>
            columns={reviewColumns}
            data={reviewsQuery.data?.data ?? []}
            isLoading={reviewsQuery.isLoading}
            isError={reviewsQuery.isError}
            errorMessage={
              reviewsQuery.error instanceof Error
                ? reviewsQuery.error.message
                : undefined
            }
            emptyMessage="조건에 맞는 후기가 없습니다."
            getRowKey={row => row.id}
            sortState={{
              key: reviewSort.split(':')[0],
              direction: (reviewSort.split(':')[1] as 'asc' | 'desc') ?? 'none',
            }}
            onSort={(key, direction) =>
              setParams({
                reviewSort: direction === 'none' ? null : `${key}:${direction}`,
                reviewPage: 1,
              })
            }
            renderRow={row => (
              <>
                <td className="px-6 py-4 text-xs text-[var(--text-sub)]">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text)]">
                  {row.targetSession}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-bold)]">
                  {row.author}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  ★ {row.rating}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-sub)]">
                  {row.createdAt}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge
                    tone={row.reported ? 'danger' : 'muted'}
                    label={row.reported ? '신고' : '정상'}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setReviewAction({
                          type: row.reported ? 'restore' : 'hide',
                          review: row,
                        })
                      }
                    >
                      {row.reported ? '복구' : '숨김'}
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
          <Pagination
            page={reviewPage}
            totalPages={reviewsQuery.data?.meta?.totalPages ?? 1}
            onChange={nextPage => setParams({ reviewPage: nextPage })}
          />
        </section>
      )}

      <ConfirmDialog
        open={!!articleAction}
        title={
          articleAction?.type === 'delete'
            ? '아티클을 삭제할까요?'
            : '아티클 공개 상태를 변경할까요?'
        }
        description={
          articleAction?.type === 'delete'
            ? '삭제 후에는 되돌릴 수 없습니다.'
            : '즉시 노출 상태가 변경됩니다.'
        }
        confirmText={articleAction?.type === 'delete' ? '삭제' : '변경'}
        confirmVariant={articleAction?.type === 'delete' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (!articleAction) return;
          articleMutation.mutate({
            id: articleAction.article.id,
            action: articleAction.type === 'delete' ? 'delete' : 'toggle',
          });
          setArticleAction(null);
        }}
        onCancel={() => setArticleAction(null)}
      />

      <ConfirmDialog
        open={!!reviewAction}
        title={
          reviewAction?.type === 'hide'
            ? '후기를 숨길까요?'
            : '후기를 복구할까요?'
        }
        description="조치 즉시 사용자에게 반영됩니다."
        confirmText={reviewAction?.type === 'hide' ? '숨김' : '복구'}
        confirmVariant={reviewAction?.type === 'hide' ? 'danger' : 'primary'}
        onConfirm={() => {
          if (!reviewAction) return;
          reviewMutation.mutate({
            id: reviewAction.review.id,
            action: reviewAction.type === 'hide' ? 'hide' : 'restore',
          });
          setReviewAction(null);
        }}
        onCancel={() => setReviewAction(null)}
      />
    </AdminShell>
  );
}

function FilterButtons<T extends string>({
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
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold tracking-wide text-[var(--text-sub)] uppercase">
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

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: 'primary' | 'danger' | 'muted' | 'info';
}) {
  const appearance =
    tone === 'primary'
      ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
      : tone === 'danger'
        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
        : tone === 'info'
          ? 'bg-[var(--primary-sub04)]/10 text-[var(--primary-sub04)]'
          : 'bg-[var(--hover-bg)] text-[var(--text-sub)]';
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${appearance}`}
    >
      {label}
    </span>
  );
}
