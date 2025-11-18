import z from 'zod';

export const applySchema = z.object({
  company: z.string().min(1, '회사명은 필수 입력입니다.'),
  position: z.string().min(1, '직무를 선택해주세요.'),
  career: z.string().min(1, '연차를 선택해주세요.'),
  expertise: z.array(z.string()).min(1, '전문 분야를 선택해주세요.'),
  introduce: z.string().min(1, '자기소개는 필수 입력입니다.').max(500),
  portfolio: z.string().url('유효한 URL을 입력해주세요.'),
});

export type ApplyRequest = z.infer<typeof applySchema>;
