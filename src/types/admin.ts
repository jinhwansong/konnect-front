// 공통 타입
export interface PageParams {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    sort?: string;
  };
}

// 대시보드 타입
export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  delta?: number;
  trend?: 'up' | 'down' | 'neutral';
  subText?: string;
}

export interface MiniTrendPoint {
  date: string;
  signup: number;
  payment: number;
}

export interface DashboardRecentPayment extends Record<string, unknown> {
  id: string;
  userName: string;
  amount: number;
  status: '성공' | '환불';
  paidAt: string;
}

export interface DashboardRecentApplication extends Record<string, unknown> {
  id: string;
  applicantName: string;
  careerYears: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DashboardData {
  metrics: DashboardMetric[];
  recentPayments: DashboardRecentPayment[];
  recentApplications: DashboardRecentApplication[];
  trends: MiniTrendPoint[];
}

// 사용자 타입
export type UserRole = 'mentee' | 'mentor' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  status: UserStatus;
}

export interface GetUsersParams extends PageParams {
  role?: string;
  status?: string;
}

export interface UpdateUserStatusParams {
  userId: string;
  suspended: boolean;
}

// 결제 타입
export type PaymentStatus = '성공' | '실패' | '환불';

export interface AdminPaymentRow {
  id: string;
  orderId: string;
  userName: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
}

export interface GetPaymentsParams extends PageParams {
  status?: string;
}

// 멘토 신청 타입
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface MentorApplicationRow {
  id: string;
  applicantName: string;
  careerYears: number;
  portfolioUrl?: string;
  submittedAt: string;
  status: ApplicationStatus;
}

export interface GetMentorApplicationsParams extends PageParams {
  status?: string;
}

// 아티클 타입
export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface AdminArticleRow extends Record<string, unknown> {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  createdAt: string;
  status: ArticleStatus;
}

export interface GetArticlesParams extends PageParams {
  status?: string;
}

// 리뷰 타입
export interface AdminReviewRow extends Record<string, unknown> {
  id: string;
  targetSession: string;
  author: string;
  rating: number;
  createdAt: string;
  reported: boolean;
}

export interface GetReviewsParams extends PageParams {
  reported?: string;
}

// 공지사항 타입
export interface AdminNoticeRow {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetNoticesParams extends PageParams {
  published?: string;
}

export interface CreateNoticeParams {
  title: string;
  content: string;
  published: boolean;
}

export interface UpdateNoticeParams {
  id: string;
  title?: string;
  content?: string;
  published?: boolean;
}

// 멘토링 세션 타입
export interface MentoringSessionRow extends Record<string, unknown> {
  id: string;
  title: string;
  mentorName: string;
  category: string;
  isPublic: boolean;
  startAt: string;
  price: number;
}

export interface GetMentoringSessionsParams extends PageParams {
  status?: string;
}

export interface ToggleSessionPublicParams {
  sessionId: string;
  isPublic: boolean;
}

// 멘토링 예약 타입
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface ReservationRow extends Record<string, unknown> {
  id: string;
  sessionTitle: string;
  menteeName: string;
  time: string;
  status: ReservationStatus;
  paid: boolean;
}

export interface GetMentoringReservationsParams extends PageParams {
  status?: string;
}

export interface UpdateReservationStatusParams {
  reservationId: string;
  status: 'confirmed' | 'cancelled';
}
