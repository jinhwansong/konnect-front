import { z } from 'zod';

export const sessionSchema = z.object({
  title: z.string().min(1, '제목은 필수 입력입니다.'),
  price: z
    .number()
    .min(1000, '최소 1000원 이상이어야 합니다.')
    .max(10000000, '가격은 1000만원 이하로 입력해주세요.'),
  duration: z
    .number()
    .min(10, '최소 10분 이상이어야 합니다.')
    .max(600, '최대 600분까지 가능합니다.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  description: z.string().min(1, '설명은 필수 입력입니다.'),
});

export type SessionFormValues = z.infer<typeof sessionSchema>;
