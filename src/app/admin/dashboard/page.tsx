'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

import AdminShell from '@/components/common/AdminShell';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { useAdminDashboard } from '@/hooks/query/useAdmin';
import type {
  DashboardMetric,
  DashboardRecentPayment,
  DashboardRecentApplication,
} from '@/types/admin';

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboard();

  const metrics = data?.metrics ?? [];
  const trends = data?.trends ?? [];
  const payments = data?.recentPayments ?? [];
  const applications = data?.recentApplications ?? [];

  const paymentColumns = [
    { key: 'userName', label: '사용자', sortable: false },
    { key: 'amount', label: '금액', sortable: false },
    { key: 'status', label: '상태', sortable: false },
    { key: 'paidAt', label: '결제일시', sortable: false },
  ];

  const applicationColumns = [
    { key: 'applicantName', label: '신청자', sortable: false },
    { key: 'careerYears', label: '경력', sortable: false },
    { key: 'submittedAt', label: '신청일시', sortable: false },
    { key: 'status', label: '상태', sortable: false },
  ];

  return (
    <AdminShell title="대시보드">
      <PageHeader
        title="운영 현황"
        description="하루 단위 주요 지표와 최근 활동을 확인하고 플랫폼 상태를 빠르게 파악하세요."
      />

      {isError && !data ? (
        <EmptyState
          title="대시보드 데이터를 불러오지 못했어요."
          description={error?.message ?? '잠시 후 다시 시도해주세요.'}
        />
      ) : (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric: DashboardMetric) => (
              <StatCard
                key={metric.id}
                title={metric.label}
                value={
                  metric.value >= 1000
                    ? metric.value.toLocaleString()
                    : metric.value
                }
                changeLabel={
                  typeof metric.delta === 'number'
                    ? `${metric.delta >= 0 ? '+' : ''}${metric.delta}%`
                    : undefined
                }
                trend={metric.trend}
                subText={metric.subText}
              />
            ))}
            {isLoading && metrics.length === 0 && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`metric-skeleton-${index}`}
                    className="h-32 animate-pulse rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]"
                  />
                ))}
              </>
            )}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-bold)]">
                    7일 가입/결제 트렌드
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-sub)]">
                    가입자 및 결제 건수 추이를 간단하게 확인하세요.
                  </p>
                </div>
              </header>
              <MiniTrendChart points={trends} isLoading={isLoading} />
            </article>

            <article className="rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-bold)]">
                    최근 멘토 신청
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-sub)]">
                    신규 멘토 풀을 빠르게 검토하세요.
                  </p>
                </div>
              </header>
              <DataTable<DashboardRecentApplication>
                columns={applicationColumns}
                data={applications}
                isLoading={isLoading}
                isError={isError}
                errorMessage={error?.message}
                emptyMessage="최근 멘토 신청이 없습니다."
                getRowKey={row => row.id}
                renderRow={row => (
                  <>
                    <td className="px-6 py-3 text-sm font-medium text-[var(--text-bold)]">
                      {row.applicantName}
                    </td>
                    <td className="px-6 py-3 text-sm text-[var(--text)]">
                      {row.careerYears}년
                    </td>
                    <td className="px-6 py-3 text-sm text-[var(--text-sub)]">
                      {row.submittedAt}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <StatusPill status={row.status} />
                    </td>
                  </>
                )}
              />
            </article>
          </section>

          <section className="mt-8 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-bold)]">
                  최근 결제 5건
                </h3>
                <p className="mt-1 text-xs text-[var(--text-sub)]">
                  최신 결제 건을 확인하고 이상 거래를 빠르게 대응하세요.
                </p>
              </div>
            </header>
            <DataTable<DashboardRecentPayment>
              columns={paymentColumns}
              data={payments}
              isLoading={isLoading}
              isError={isError}
              errorMessage={error?.message}
              emptyMessage="최근 결제 내역이 없습니다."
              getRowKey={row => row.id}
              renderRow={row => (
                <>
                  <td className="px-6 py-3 text-sm font-medium text-[var(--text-bold)]">
                    {row.userName}
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-semibold text-[var(--text-bold)]">
                    ₩{row.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-6 py-3 text-sm text-[var(--text-sub)]">
                    {row.paidAt}
                  </td>
                </>
              )}
            />
          </section>
        </>
      )}
    </AdminShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized =
    status === 'pending'
      ? '검토중'
      : status === 'approved'
        ? '승인'
        : status === 'rejected'
          ? '거절'
          : status;
  const appearance =
    normalized === '성공' || normalized === '승인'
      ? 'bg-[var(--primary-sub02)] text-[var(--primary)]'
      : normalized === '환불' || normalized === '거절'
        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
        : 'bg-[var(--hover-bg)] text-[var(--text-sub)]';

  return (
    <span
      className={`inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${appearance}`}
    >
      {normalized}
    </span>
  );
}

function MiniTrendChart({
  points,
  isLoading,
}: {
  points: { date: string; signup: number; payment: number }[];
  isLoading: boolean;
}) {
  if (isLoading && points.length === 0) {
    return (
      <div className="h-48 animate-pulse rounded-md bg-[var(--hover-bg)]" />
    );
  }

  if (!points.length) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed border-[var(--border-color)] text-sm text-[var(--text-sub)]">
        데이터가 충분하지 않습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-[var(--border-color)] bg-[var(--background)] p-3">
        <div
          style={{ width: '100%', height: 200 }}
          aria-label="7일 가입 및 결제 추이"
          role="img"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={points}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                stroke="var(--border-color)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-sub)' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                tick={{ fill: 'var(--text-sub)' }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickLine={{ stroke: 'var(--border-color)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: `1px solid var(--border-color)`,
                  color: 'var(--text)',
                }}
                labelStyle={{ color: 'var(--text-sub)' }}
                formatter={(value: number, name: string) => [
                  value,
                  name === 'signup' ? '가입자' : '결제',
                ]}
              />
              <Legend
                wrapperStyle={{ color: 'var(--text-sub)' }}
                formatter={(value: string) =>
                  value === 'signup' ? '가입자' : '결제'
                }
              />
              <Line
                type="monotone"
                dataKey="signup"
                stroke="var(--primary-sub04)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="payment"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
