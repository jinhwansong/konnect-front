import {
  ArticleRequest,
  ArticleResponse,
  ArticleCardItem,
} from '@/types/article';
import { fetcher } from '@/utils/fetcher';

import {
  fetchArticles,
  fetchArticleDetail,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
  createComment,
  updateComment,
  deleteComment,
} from '../article';

jest.mock('@/utils/fetcher');
const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('article API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchArticles', () => {
    it('should fetch articles with default params', async () => {
      const mockResponse: ArticleResponse = {
        data: [],

        totalPages: 0,
      };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await fetchArticles(1, 'all', 10);

      expect(mockFetcher).toHaveBeenCalledWith(
        expect.stringContaining('article?page=1&limit=10&sort=latest'),
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('fetchArticleDetail', () => {
    it('should fetch article detail', async () => {
      const mockArticle: ArticleCardItem = {
        id: '1',
        title: 'Test',
        content: 'Content',
        category: 'general',
        likeCount: 0,
        liked: false,
        createdAt: new Date().toISOString(),
        thumbnail: 'd',
        views: 3,
        author: {
          id: 'd',
          nickname: 'dd',
          image: 'd',
        },
      };
      mockFetcher.mockResolvedValueOnce(mockArticle);

      const result = await fetchArticleDetail('1');

      expect(mockFetcher).toHaveBeenCalledWith('article/1', { method: 'GET' });
      expect(result).toEqual(mockArticle);
    });
  });

  describe('createArticle', () => {
    it('should create article using FormData', async () => {
      const articleData: ArticleRequest = {
        title: 'New',
        content: 'Content',
        category: 'general',
        thumbnail: undefined,
      };
      const mockResponse = { id: '1', title: 'New' };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await createArticle(articleData);

      expect(mockFetcher).toHaveBeenCalledWith('article', {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateArticle', () => {
    it('should update article using FormData', async () => {
      const articleData: ArticleRequest = {
        title: 'Updated',
        content: 'Updated content',
        category: 'general',
        thumbnail: undefined,
      };
      const mockResponse = { id: '1', title: 'Updated' };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await updateArticle('1', articleData);

      expect(mockFetcher).toHaveBeenCalledWith('article/1', {
        method: 'PATCH',
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteArticle', () => {
    it('should call delete API', async () => {
      mockFetcher.mockResolvedValueOnce({ success: true });

      await deleteArticle('1');

      expect(mockFetcher).toHaveBeenCalledWith('article/1', {
        method: 'DELETE',
      });
    });
  });

  describe('toggleArticleLike', () => {
    it('should call like toggle API', async () => {
      mockFetcher.mockResolvedValueOnce({ success: true });

      await toggleArticleLike('1');

      expect(mockFetcher).toHaveBeenCalledWith('article/1/like', {
        method: 'PATCH',
      });
    });
  });

  describe('createComment', () => {
    it('should post comment', async () => {
      const data = { content: 'Nice!' };
      const mockResponse = { id: 'c1', content: 'Nice!' };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await createComment('1', data);

      expect(mockFetcher).toHaveBeenCalledWith('article/1/comment/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateComment', () => {
    it('should patch comment', async () => {
      const mockResponse = { id: 'c1', content: 'Updated' };
      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await updateComment({ id: 'c1', content: 'Updated' });

      expect(mockFetcher).toHaveBeenCalledWith('article/comment/c1', {
        method: 'PATCH',
        body: JSON.stringify({ content: 'Updated' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      mockFetcher.mockResolvedValueOnce({ success: true });

      await deleteComment('c1');

      expect(mockFetcher).toHaveBeenCalledWith('article/comment/c1', {
        method: 'DELETE',
      });
    });
  });
});
