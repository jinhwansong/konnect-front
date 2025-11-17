import { z } from 'zod';

import { commonSchemas } from '@/utils/validation';

export const PHONE_REGEX = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
export const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]+$/;
export const signSchema = z
  .object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    passwordConfirm: z.string(),
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    nickname: commonSchemas.nickname,
    phone: commonSchemas.phone,
    code: z.string().min(1, '인증 코드를 입력해주세요.'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

export type SignForm = z.infer<typeof signSchema>;
