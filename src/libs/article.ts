import { ArticleCategoryTabType } from '@/contact/article';
import {
  ArticleCardItem,
  ArticleRequest,
  ArticleResponse,
  CommentRequest,
  PatchComment,
  PostComment,
} from '@/types/article';
import { fetcher } from '@/utils/fetcher';

export const fetchArticles = async (
  page: number,
  category: ArticleCategoryTabType = 'all',
  limit: number,
  sort: string = 'latest'
): Promise<ArticleResponse> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: String(sort),
  });
  if (category !== 'all') {
    searchParams.append('category', category);
  }
  return fetcher<ArticleResponse>(`article?${searchParams.toString()}`, {
    method: 'GET',
  });
};

export const createArticle = async (data: ArticleRequest) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  formData.append('category', data.category);
  const file = data.thumbnail?.[0];
  if (file) {
    formData.append('thumbnail', file);
  }
  return fetcher<ArticleRequest>(`article`, {
    method: 'POST',
    body: formData,
  });
};

export const uploadArticleImage = (
  formData: FormData
): Promise<{ image: string[] }> => {
  return fetcher<{ image: string[] }>('article/upload-image', {
    method: 'POST',
    body: formData,
  });
};

export const toggleArticleLike = async (id: string) => {
  return fetcher<ArticleRequest>(`article/${id}/like`, {
    method: 'PATCH',
  });
};

export const fetchLikedArticleIds = async (ids: string[]) => {
  const query = ids.map(id => `ids=${id}`).join('&');
  return fetcher<string[]>(`article/liked?${query}`, {
    method: 'GET',
  });
};

export const fetchArticleDetail = async (
  id: string
): Promise<ArticleCardItem> => {
  return fetcher<ArticleCardItem>(`article/${id}`, {
    method: 'GET',
  });
};

export const deleteArticle = async (id: string) => {
  return fetcher(`article/${id}`, {
    method: 'DELETE',
  });
};

export const updateArticle = async (id: string, data: ArticleRequest) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  formData.append('category', data.category);
  const file = data.thumbnail?.[0];
  if (file) {
    formData.append('thumbnail', file);
  }
  return fetcher<ArticleRequest>(`article/${id}`, {
    method: 'PATCH',
    body: formData,
  });
};

export const fetchComments = async (
  articleId: string,
  page: number = 1,
  limit = 10
) => {
  return fetcher<CommentRequest>(
    `article/${articleId}/comment?page=${page}&limit=${limit}`,
    {
      method: 'GET',
    }
  );
};

export const deleteComment = async (id: string) => {
  return fetcher(`article/comment/${id}`, {
    method: 'DELETE',
  });
};

export const updateComment = async ({ id, content }: PatchComment) => {
  return fetcher<ArticleRequest>(`article/comment/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
};

export const createComment = async (id: string, data: PostComment) => {
  return fetcher(`article/${id}/comment/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
