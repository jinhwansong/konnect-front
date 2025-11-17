import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createNotice,
  deleteNotice,
  getAdminArticles,
  getAdminDashboard,
  getAdminNotices,
  getAdminPayments,
  getAdminReviews,
  getAdminUsers,
  getMentorApplications,
  getMentoringReservations,
  getMentoringSessions,
  toggleSessionPublic,
  updateNotice,
  updateReservationStatus,
  updateUserStatus,
} from '@/libs/admin';
import {
  CreateNoticeParams,
  GetArticlesParams,
  GetMentorApplicationsParams,
  GetMentoringReservationsParams,
  GetMentoringSessionsParams,
  GetNoticesParams,
  GetPaymentsParams,
  GetReviewsParams,
  GetUsersParams,
  ToggleSessionPublicParams,
  UpdateNoticeParams,
  UpdateReservationStatusParams,
  UpdateUserStatusParams,
} from '@/types/admin';

// 대시보드
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });
}

// 사용자 관리
export function useAdminUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getAdminUsers(params),
    staleTime: 30 * 1000, // 30초
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateUserStatusParams) => updateUserStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// 결제 관리
export function useAdminPayments(params: GetPaymentsParams) {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: () => getAdminPayments(params),
    staleTime: 30 * 1000, // 30초
  });
}

// 멘토 신청 관리
export function useMentorApplications(params: GetMentorApplicationsParams) {
  return useQuery({
    queryKey: ['admin', 'mentorApplications', params],
    queryFn: () => getMentorApplications(params),
    staleTime: 30 * 1000, // 30초
  });
}

// 아티클 관리
export function useAdminArticles(params: GetArticlesParams) {
  return useQuery({
    queryKey: ['admin', 'articles', params],
    queryFn: () => getAdminArticles(params),
    staleTime: 30 * 1000, // 30초
  });
}

// 리뷰 관리
export function useAdminReviews(params: GetReviewsParams) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => getAdminReviews(params),
    staleTime: 30 * 1000, // 30초
  });
}

// 공지사항 관리
export function useAdminNotices(params: GetNoticesParams) {
  return useQuery({
    queryKey: ['admin', 'notices', params],
    queryFn: () => getAdminNotices(params),
    staleTime: 30 * 1000, // 30초
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateNoticeParams) => createNotice(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
    },
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateNoticeParams) => updateNotice(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
    },
  });
}

// 멘토링 세션 관리
export function useMentoringSessions(params: GetMentoringSessionsParams) {
  return useQuery({
    queryKey: ['admin', 'mentoring', 'sessions', params],
    queryFn: () => getMentoringSessions(params),
    staleTime: 30 * 1000, // 30초
    placeholderData: previousData => previousData,
  });
}

export function useToggleSessionPublic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ToggleSessionPublicParams) =>
      toggleSessionPublic(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'mentoring', 'sessions'],
      });
    },
  });
}

// 멘토링 예약 관리
export function useMentoringReservations(
  params: GetMentoringReservationsParams
) {
  return useQuery({
    queryKey: ['admin', 'mentoring', 'reservations', params],
    queryFn: () => getMentoringReservations(params),
    staleTime: 30 * 1000, // 30초
    placeholderData: previousData => previousData,
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateReservationStatusParams) =>
      updateReservationStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'mentoring', 'reservations'],
      });
    },
  });
}
