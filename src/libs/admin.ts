import {
  AdminArticleRow,
  AdminNoticeRow,
  AdminPaymentRow,
  AdminReviewRow,
  AdminUserRow,
  ApplicationStatus,
  CreateNoticeParams,
  DashboardData,
  GetArticlesParams,
  GetMentorApplicationsParams,
  GetMentoringReservationsParams,
  GetMentoringSessionsParams,
  GetNoticesParams,
  GetPaymentsParams,
  GetReviewsParams,
  GetUsersParams,
  MentorApplicationDetail,
  MentorApplicationRow,
  MentoringSessionRow,
  PaginatedResponse,
  ReservationRow,
  ToggleSessionPublicParams,
  UpdateMentorApplicationStatusParams,
  UpdateNoticeParams,
  UpdateReservationStatusParams,
  UpdateUserStatusParams,
} from '@/types/admin';
import { fetcher } from '@/utils/fetcher';

// 대시보드
export const getAdminDashboard = () => {
  return fetcher<DashboardData>('admin/dashboard', {
    method: 'GET',
  });
};

// 사용자 관리
export const getAdminUsers = async (
  params: GetUsersParams
): Promise<PaginatedResponse<AdminUserRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    role = 'all',
    status = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (role && role !== 'all') queryParams.append('role', role);
  if (status && status !== 'all') queryParams.append('status', status);

  return fetcher<PaginatedResponse<AdminUserRow>>(
    `admin/users?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

export const updateUserStatus = async ({
  userId,
  suspended,
}: UpdateUserStatusParams) => {
  return fetcher<{ message: string }>(`admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ suspended }),
  });
};

// 결제 관리
export const getAdminPayments = async (
  params: GetPaymentsParams
): Promise<PaginatedResponse<AdminPaymentRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    status = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (status && status !== 'all') queryParams.append('status', status);

  return fetcher<PaginatedResponse<AdminPaymentRow>>(
    `admin/payments?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

// 멘토 신청 관리
export const getMentorApplications = async (
  params: GetMentorApplicationsParams
): Promise<PaginatedResponse<MentorApplicationRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    status = 'all',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (q) queryParams.append('q', q);
  if (status && status !== 'all') queryParams.append('status', status);

  const response = await fetcher<{
    data: Array<{
      id: string;
      name: string;
      email: string;
      expertise: string;
      status: ApplicationStatus;
      createdAt: string;
    }>;
    total: number;
    totalPage: number;
    message: string;
  }>(`admin/mentors?${queryParams.toString()}`, {
    method: 'GET',
  });

  return {
    data: response.data.map(item => ({
      id: item.id,
      applicantName: item.name,
      email: item.email,
      expertise: item.expertise,
      submittedAt: item.createdAt,
      status: item.status,
    })),
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalCount: response.total,
      totalPages: response.totalPage,
    },
  };
};

export const getMentorApplicationDetail = async (id: string) => {
  return fetcher<MentorApplicationDetail>(`admin/mentors/${id}`, {
    method: 'GET',
  });
};

export const updateMentorApplicationStatus = async ({
  id,
  status,
  reason,
}: UpdateMentorApplicationStatusParams) => {
  return fetcher<{ message: string }>(`admin/mentors/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(
      status === 'rejected'
        ? {
            status,
            reason,
          }
        : { status }
    ),
  });
};

// 아티클 관리
export const getAdminArticles = async (
  params: GetArticlesParams
): Promise<PaginatedResponse<AdminArticleRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    status = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (status && status !== 'all') queryParams.append('status', status);

  return fetcher<PaginatedResponse<AdminArticleRow>>(
    `admin/articles?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

// 리뷰 관리
export const getAdminReviews = async (
  params: GetReviewsParams
): Promise<PaginatedResponse<AdminReviewRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    reported = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (reported && reported !== 'all') queryParams.append('reported', reported);

  return fetcher<PaginatedResponse<AdminReviewRow>>(
    `admin/reviews?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

// 공지사항 관리
export const getAdminNotices = async (
  params: GetNoticesParams
): Promise<PaginatedResponse<AdminNoticeRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    published = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (published && published !== 'all')
    queryParams.append('published', published);

  return fetcher<PaginatedResponse<AdminNoticeRow>>(
    `admin/notices?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

export const createNotice = async (params: CreateNoticeParams) => {
  return fetcher<AdminNoticeRow>('admin/notices', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const updateNotice = async (params: UpdateNoticeParams) => {
  const { id, ...rest } = params;
  return fetcher<AdminNoticeRow>(`admin/notices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(rest),
  });
};

export const deleteNotice = async (id: string) => {
  return fetcher<void>(`admin/notices/${id}`, {
    method: 'DELETE',
  });
};

// 멘토링 세션 관리
export const getMentoringSessions = async (
  params: GetMentoringSessionsParams
): Promise<PaginatedResponse<MentoringSessionRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    status = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (status && status !== 'all') queryParams.append('status', status);

  return fetcher<PaginatedResponse<MentoringSessionRow>>(
    `admin/mentoring/sessions?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

export const toggleSessionPublic = async ({
  sessionId,
  isPublic,
}: ToggleSessionPublicParams) => {
  return fetcher<{ message: string }>(
    `admin/mentoring/sessions/${sessionId}/public`,
    {
      method: 'PATCH',
      body: JSON.stringify({ isPublic }),
    }
  );
};

// 멘토링 예약 관리
export const getMentoringReservations = async (
  params: GetMentoringReservationsParams
): Promise<PaginatedResponse<ReservationRow>> => {
  const {
    page = 1,
    limit = 10,
    q = '',
    status = 'all',
    sort = 'createdAt:desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (q) queryParams.append('q', q);
  if (status && status !== 'all') queryParams.append('status', status);

  return fetcher<PaginatedResponse<ReservationRow>>(
    `admin/mentoring/reservations?${queryParams.toString()}`,
    {
      method: 'GET',
    }
  );
};

export const updateReservationStatus = async ({
  reservationId,
  status,
}: UpdateReservationStatusParams) => {
  return fetcher<{ message: string }>(
    `admin/mentoring/reservations/${reservationId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
};
