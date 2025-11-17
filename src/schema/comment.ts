import { z } from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, '댓글을 입력해 주세요.')
    .max(500, `최대 500자까지 입력 가능합니다.`),
});

export type CommentRequest = z.infer<typeof commentSchema>;
