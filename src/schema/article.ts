'use client';
import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  content: z.string().min(1, '내용을 입력하세요'),
  thumbnail: z
    .any()
    .refine(file => file instanceof FileList && file.length > 0, {
      message: '썸네일 이미지를 선택해주세요.',
    }),
});

export type ArticleRequest = z.infer<typeof articleSchema>;
