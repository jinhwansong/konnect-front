'use client';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaEye, FaHeart } from 'react-icons/fa';

import { ARTICLE_OPTIONS } from '@/contact/article';
import {
  useDeleteArticle,
  useGetArticleDetail,
  useLikeArticle,
  useLikedArticles,
} from '@/hooks/query/useArticle';
import { useToastStore } from '@/stores/useToast';
import { findOptionLabel } from '@/utils/getLabel';

import CommentSection from '../comment/CommentSection';
import Button from '../common/Button';

export default function ArticleDetail({ articleId }: { articleId: string }) {
  const { data: article, isLoading } = useGetArticleDetail(articleId);
  const { data: sessions } = useSession();

  const { show } = useToastStore();
  const router = useRouter();
  const { mutate: deleteArticle } = useDeleteArticle();
  const { mutate: likeMutate } = useLikeArticle();
  const { data: likedIds } = useLikedArticles([articleId]);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (!sessions?.user) {
      show('로그인 한 사람만 이용 할 수 있습니다.', 'error');
      return router.push('/login');
    }

    likeMutate(id);
  };

  // 삭제
  const handleDeleteArticle = () => {
    deleteArticle(
      {
        id: article?.id as string,
      },
      {
        onSuccess: () => {
          show('아티클 삭제를 완료했습니다.', 'success');
          router.push('/articles');
        },
        onError: () => {
          show('아티클 삭제를 실패했습니다.', 'error');
        },
      }
    );
  };
  if (isLoading) return null;

  return (
    <section className="mx-auto mt-10 mb-16 w-[768px]">
      <h1 className="mb-4 text-2xl leading-snug font-bold break-words text-[var(--text-bold)]">
        {article?.title}
      </h1>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Image
              src={article?.author.image ?? '/icon/IcPeople.avif'}
              width={28}
              height={28}
              alt="작성자"
              className="rounded-full"
            />
            <span className="text-[var(--text-sub)]">
              {article?.author.nickname}
            </span>
          </div>
          <span className="rounded-full bg-[var(--primary-sub02)] px-2 py-0.5 text-[var(--primary)]">
            <span>
              {findOptionLabel(article?.category as string, ARTICLE_OPTIONS)}
            </span>
          </span>
          <span className="text-[var(--text-sub)]">
            {article?.createdAt &&
              format(new Date(article?.createdAt), 'yyyy.MM.dd')}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm whitespace-nowrap text-[var(--text-sub)]">
          <span className="flex items-center gap-1">
            <FaEye />
            {article?.views}
          </span>
          <button
            type="button"
            onClick={e => handleLike(e, articleId)}
            className="flex items-center gap-1 hover:text-[var(--primary)]"
          >
            <FaHeart
              className={`transition-colors ${
                likedIds?.includes(articleId)
                  ? 'text-red-500'
                  : 'text-[var(--text-sub)]'
              }`}
            />
            {article?.likeCount}
          </button>
          {article?.author.nickname === sessions?.user?.nickname && (
            <div className="flex h-9 items-center gap-2 text-sm whitespace-nowrap text-[var(--text-sub)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/articles/edit/${articleId}`)}
              >
                수정
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteArticle}>
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: article?.content ?? '' }}
      />
      <CommentSection articleId={articleId} />
    </section>
  );
}
