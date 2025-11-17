import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { ArticleCategoryTabType } from '@/contact/article';
import { withQueryDefaults } from '@/hooks/query/options';
import {
  fetchArticles,
  fetchArticleDetail,
  fetchLikedArticleIds,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '@/libs/article';
import {
  ArticleCardItem,
  ArticleRequest,
  ArticleResponse,
  PatchArticle,
  PatchComment,
  PostComment,
} from '@/types/article';

export const useGetArticle = (
  page: number,
  category: ArticleCategoryTabType = 'all',
  limit: number = 6,
  sort: string = 'latest'
) => {
  return useQuery<ArticleResponse>(
    withQueryDefaults({
      queryKey: ['article', page, category, limit, sort],
      queryFn: () => fetchArticles(page, category, limit, sort),
    })
  );
};

export const useGetArticleDetail = (id: string) => {
  return useQuery<ArticleCardItem>(
    withQueryDefaults({
      queryKey: ['article-detail', id],
      queryFn: () => fetchArticleDetail(id),
    })
  );
};

export const usePostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArticleRequest) => createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
    },
  });
};

export const useLikeArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleArticleLike(id),
    onMutate: async (articleId: string) => {
      await queryClient.cancelQueries({ queryKey: ['article'] });

      const previousArticle = queryClient.getQueriesData<ArticleResponse>({
        queryKey: ['article'],
      });

      const previousLiked =
        queryClient.getQueryData<string[]>(['article-liked']) || [];

      const previousDetail = queryClient.getQueryData<ArticleCardItem>([
        'article-detail',
        articleId,
      ]);

      // article 리스트 좋아요 카운트 조작
      queryClient.setQueriesData<ArticleResponse>(
        { queryKey: ['article'] },
        old => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map(article =>
              article.id === articleId
                ? {
                    ...article,
                    likeCount: article.liked
                      ? article.likeCount - 1
                      : article.likeCount + 1,
                  }
                : article
            ),
          };
        }
      );

      queryClient.setQueryData<ArticleCardItem>(
        ['article-detail', articleId],
        old => {
          if (!old) return old;
          return {
            ...old,
            likeCount: old.liked ? old.likeCount - 1 : old.likeCount + 1,
            liked: !old.liked,
          };
        }
      );

      // likedArticles 쿼리 조작
      const isLiked = previousLiked.includes(articleId);
      const newLiked = isLiked
        ? previousLiked.filter(id => id !== articleId)
        : [...previousLiked, articleId];
      queryClient.setQueryData(['article-liked'], newLiked);

      return { previousArticle, previousLiked, previousDetail, articleId };
    },
    onError: (err, _, context) => {
      if (context?.previousArticle) {
        for (const [queryKey, data] of context.previousArticle) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      if (context?.previousLiked) {
        queryClient.setQueryData(['article-liked'], context.previousLiked);
      }
      if (context?.previousDetail && context?.articleId) {
        queryClient.setQueryData(
          ['article-detail', context.articleId],
          context.previousDetail
        );
      }
    },
    onSettled: (_, __, ___, context) => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
      queryClient.invalidateQueries({ queryKey: ['article-liked'] });
      if (context?.articleId) {
        queryClient.invalidateQueries({
          queryKey: ['article-detail', context.articleId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['article-detail'] });
      }
    },
  });
};

export const useLikedArticles = (ids: string[]) => {
  const { data: session } = useSession();
  return useQuery<string[]>(
    withQueryDefaults({
      queryKey: ['article-liked', ids],
      queryFn: () => fetchLikedArticleIds(ids),
      enabled: !!session?.user && ids.length > 0,
    })
  );
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: PatchArticle) => updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article-detail'] });
      queryClient.invalidateQueries({ queryKey: ['article'] });
    },
  });
};

export const useGetComment = (articleId: string) => {
  return useInfiniteQuery({
    queryKey: ['comment', articleId],
    queryFn: ({ pageParam = 1 }) => fetchComments(articleId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPage ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};

export const usePatchComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: PatchComment) =>
      updateComment({ id, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};

export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostComment }) =>
      createComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};
