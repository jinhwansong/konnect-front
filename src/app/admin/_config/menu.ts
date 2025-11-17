export interface AdminMenuItem {
  href: string;
  label: string;
  children?: AdminMenuItem[];
}

export const adminMenu: AdminMenuItem[] = [
  { href: '/admin/dashboard', label: '대시보드' },
  { href: '/admin/users', label: '사용자' },
  { href: '/admin/mentor-applications', label: '멘토 신청' },
  { href: '/admin/mentoring', label: '멘토링' },
  { href: '/admin/payments', label: '결제' },
  { href: '/admin/contents', label: '콘텐츠' },
  { href: '/admin/notices', label: '공지' },
  { href: '/admin/settings', label: '설정' },
];
