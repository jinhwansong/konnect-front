// 공통 상수 정의
export const API_ENDPOINTS = {
  ARTICLE: 'article',
  AUTH: 'auth',
  MENTOR: 'mentor',
  SESSION: 'session',
  PAYMENT: 'payment',
  RESERVATION: 'reservation',
  REVIEW: 'review',
  SCHEDULE: 'schedule',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const QUERY_KEYS = {
  ARTICLES: 'articles',
  ARTICLE_DETAIL: 'articleDetail',
  COMMENTS: 'comments',
  SESSIONS: 'sessions',
  SESSION_DETAIL: 'sessionDetail',
  MENTORS: 'mentors',
  MENTOR_DETAIL: 'mentorDetail',
  RESERVATIONS: 'reservations',
  REVIEWS: 'reviews',
  PAYMENTS: 'payments',
  SCHEDULES: 'schedules',
  USER_PROFILE: 'userProfile',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const TOAST_DURATION = 2500;
export const DEBOUNCE_DELAY = 300;

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
