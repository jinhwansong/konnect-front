import { z } from 'zod';

import { MAX_FILE_SIZE, FILE_TYPES } from '../contact/constants';

// 공통 정규식
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  PHONE: /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/,
  NICKNAME: /^[가-힣a-zA-Z0-9]+$/,
  TIME: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
} as const;

// 페이지네이션 스키마
export const paginationSchema = z.object({
  page: z.number().min(1, '페이지는 1 이상이어야 합니다.'),
  limit: z.number().min(1).max(100, '한 번에 최대 100개까지 조회 가능합니다.'),
});
// ID 검증 스키마
export const idSchema = z.string().min(1, 'ID는 필수입니다.');

// 검색 파라미터 스키마
export const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['latest', 'popular', 'oldest']).default('latest'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// 공통 스키마
export const commonSchemas = {
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),

  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .regex(REGEX_PATTERNS.PASSWORD, '영문, 숫자, 특수문자를 포함해야 합니다.'),

  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(12, '닉네임은 12자 이하여야 합니다.')
    .regex(REGEX_PATTERNS.NICKNAME, '한글, 영문, 숫자만 사용 가능합니다'),

  phone: z
    .string()
    .regex(REGEX_PATTERNS.PHONE, '올바른 전화번호 형식을 입력해주세요'),

  time: z
    .string()
    .regex(REGEX_PATTERNS.TIME, '올바른 시간 형식이 아닙니다. (HH:mm)'),

  file: z
    .any()
    .refine(file => file instanceof FileList && file.length > 0, {
      message: '파일을 선택해주세요.',
    })
    .refine(file => file[0]?.size <= MAX_FILE_SIZE, {
      message: '파일 크기는 5MB 이하여야 합니다.',
    }),

  imageFile: z
    .any()
    .refine(file => file instanceof FileList && file.length > 0, {
      message: '이미지를 선택해주세요.',
    })
    .refine(file => file[0]?.size <= MAX_FILE_SIZE, {
      message: '이미지 크기는 5MB 이하여야 합니다.',
    })
    .refine(file => FILE_TYPES.IMAGE.includes(file[0]?.type), {
      message: 'JPEG, PNG, WebP, AVIF 형식만 지원됩니다.',
    }),
  pagination: paginationSchema,
  id: idSchema,
} as const;
