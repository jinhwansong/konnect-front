'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import AdminShell from '@/components/common/AdminShell';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/common/PageHeader';
import { Toggle } from '@/components/common/Toggle';
import {
  fetchAdminSettings,
  updatePaymentKey,
  updateNotificationSetting,
  SettingsSummary,
} from '@/libs/settings';

export default function SettingsAdminPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = ['admin', 'settings'];
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: fetchAdminSettings,
    staleTime: 60_000,
  });

  const paymentMutation = useMutation({
    mutationFn: (index: number) => updatePaymentKey(index),
    onMutate: async index => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<SettingsSummary>(queryKey);
      queryClient.setQueryData<SettingsSummary | undefined>(queryKey, old =>
        old
          ? {
              ...old,
              paymentKeys: old.paymentKeys.map((key, idx) =>
                idx === index
                  ? {
                      ...key,
                      maskedKey: '갱신 중...',
                      lastUpdated: new Date().toISOString(),
                      status: 'active',
                    }
                  : key
              ),
            }
          : old
      );
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const notificationMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      updateNotificationSetting(id, enabled),
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<SettingsSummary>(queryKey);
      queryClient.setQueryData<SettingsSummary | undefined>(queryKey, old =>
        old
          ? {
              ...old,
              notifications: old.notifications.map(notification =>
                notification.id === id
                  ? { ...notification, enabled }
                  : notification
              ),
            }
          : old
      );
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <AdminShell title="설정">
      <PageHeader
        title="서비스 설정"
        description="결제 키와 알림, 관리자 권한 정보를 관리합니다."
      />

      {isError && !data ? (
        <EmptyState
          title="설정 정보를 불러오지 못했습니다."
          description={
            error instanceof Error ? error.message : '잠시 후 다시 시도하세요.'
          }
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--text-bold)]">
              결제 키 상태
            </h2>
            <p className="mt-1 text-xs text-[var(--text-sub)]">
              실제 키는 마스킹 처리되어 표시됩니다. 갱신을 통해 보안을
              유지하세요.
            </p>
            <div className="mt-4 space-y-4">
              {(data?.paymentKeys ?? []).map((key, index) => (
                <div
                  key={`${key.label}-${index}`}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-bold)]">
                      {key.label}
                    </p>
                    <p className="text-sm text-[var(--text-sub)]">
                      {key.maskedKey}
                    </p>
                    <p className="text-xs text-[var(--text-sub)]">
                      마지막 갱신: {key.lastUpdated}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    loading={paymentMutation.isPending}
                    onClick={() => paymentMutation.mutate(index)}
                  >
                    키 갱신
                  </Button>
                </div>
              ))}
              {isLoading && (
                <div className="h-20 animate-pulse rounded-lg bg-[var(--hover-bg)]" />
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--text-bold)]">
              알림 설정
            </h2>
            <p className="mt-1 text-xs text-[var(--text-sub)]">
              주요 이벤트에 대한 알림 채널을 설정하세요.
            </p>
            <div className="mt-4 space-y-4">
              {(data?.notifications ?? []).map(notification => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-bold)]">
                      {notification.label}
                    </p>
                    <p className="text-xs text-[var(--text-sub)]">
                      {notification.description}
                    </p>
                  </div>
                  <Toggle
                    checked={notification.enabled}
                    onCheckedChange={checked =>
                      notificationMutation.mutate({
                        id: notification.id,
                        enabled: checked,
                      })
                    }
                    aria-label={`${notification.label} 알림 토글`}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="h-20 animate-pulse rounded-lg bg-[var(--hover-bg)]" />
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm lg:col-span-2">
            <h2 className="text-base font-semibold text-[var(--text-bold)]">
              관리자 권한 요약
            </h2>
            <p className="mt-1 text-xs text-[var(--text-sub)]">
              관리자 접근은 역할 기반으로 제한됩니다. 상위 권한에서만 설정
              변경이 가능합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <div>
                <p className="text-xs tracking-wide text-[var(--text-sub)]">
                  전체 관리자
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-bold)]">
                  {data?.adminRoleSummary.totalAdmins ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide text-[var(--text-sub)]">
                  슈퍼 관리자
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-bold)]">
                  {data?.adminRoleSummary.superAdmins ?? 0}
                </p>
              </div>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(data?.adminRoleSummary.link ?? '/admin/roles')
                  }
                >
                  권한 관리 이동
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-xs text-[var(--text-sub)]">
              이 페이지는 관리자 전용입니다. 접근 권한이 필요하면 상위
              관리자에게 요청하세요.
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
