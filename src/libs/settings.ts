// 간단한 지연 시뮬레이션 함수
const simulateLatency = <T>(data: T, delay: number): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export interface PaymentKeyState {
  label: string;
  maskedKey: string;
  lastUpdated: string;
  status: 'active' | 'expired';
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface SettingsSummary {
  paymentKeys: PaymentKeyState[];
  notifications: NotificationSetting[];
  adminRoleSummary: {
    totalAdmins: number;
    superAdmins: number;
    link: string;
  };
}

let notificationStore: NotificationSetting[] = [
  {
    id: 'email',
    label: '이메일 알림',
    description: '중요 이벤트 발생 시 이메일로 알림을 받습니다.',
    enabled: true,
  },
  {
    id: 'inapp',
    label: '인앱 알림',
    description: '관리자 콘솔 내에서 실시간 알림을 받습니다.',
    enabled: true,
  },
];

let paymentKeyStore: PaymentKeyState[] = [
  {
    label: '결제 Secret Key',
    maskedKey: 'sk_live_****_9a2f',
    lastUpdated: '2025-10-22 14:30',
    status: 'active',
  },
  {
    label: 'Webhook Signing Secret',
    maskedKey: 'whsec_****_33ce',
    lastUpdated: '2025-09-12 09:10',
    status: 'active',
  },
];

export async function fetchAdminSettings(): Promise<SettingsSummary> {
  return simulateLatency(
    {
      paymentKeys: paymentKeyStore,
      notifications: notificationStore,
      adminRoleSummary: {
        totalAdmins: 12,
        superAdmins: 3,
        link: '/admin/roles',
      },
    },
    500
  );
}

export async function updatePaymentKey(
  index: number
): Promise<PaymentKeyState> {
  const updated: PaymentKeyState = {
    ...paymentKeyStore[index],
    maskedKey: paymentKeyStore[index].maskedKey.replace(/\*{4}/, '****'),
    lastUpdated: new Date().toISOString(),
    status: 'active',
  };
  paymentKeyStore = paymentKeyStore.map((item, idx) =>
    idx === index ? updated : item
  );
  return simulateLatency(updated, 600);
}

export async function updateNotificationSetting(
  id: string,
  enabled: boolean
): Promise<NotificationSetting> {
  let updated: NotificationSetting | undefined;
  notificationStore = notificationStore.map(setting => {
    if (setting.id === id) {
      updated = { ...setting, enabled };
      return updated;
    }
    return setting;
  });
  if (!updated) throw new Error('Notification setting not found');
  return simulateLatency(updated, 400);
}
