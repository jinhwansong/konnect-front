import { format, isToday, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaEye, FaHeart } from 'react-icons/fa';

import { ARTICLE_OPTIONS } from '@/contact/article';
import { useLikeArticle } from '@/hooks/query/useArticle';
import { useToastStore } from '@/stores/useToast';
import { ArticleCardItem } from '@/types/article';
import { buildImageUrl } from '@/utils/getImageUrl';
import { findOptionLabel } from '@/utils/getLabel';

interface ArticleCardProps extends ArticleCardItem {
  type?: 'main' | 'other';
  number?: number;
}

export default function ArticleCard({
  number,
  type,
  ...props
}: ArticleCardProps) {
  const { show } = useToastStore();
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: likeMutate } = useLikeArticle();
  const handleLike = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (!session) {
      show('로그인 한 사람만 이용 할 수 있습니다.', 'error');
      return router.push('/login');
    }

    likeMutate(id);
  };
  return (
    <Link
      href={`/articles/${props.id}`}
      className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-5 sm:flex-row"
    >
      {/* 순번 + NEW */}
      {type === 'main' && (
        <div className="shrink-0 text-center">
          <p className="text-base font-semibold text-[var(--text-bold)] sm:text-lg">
            {number}
          </p>
          {isToday(parseISO(props.createdAt)) && (
            <span className="block text-xs font-semibold text-[var(--primary)]">
              NEW
            </span>
          )}
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:gap-6">
          <div className="flex-1">
            <h3 className="line-clamp-1 font-semibold text-[var(--text-bold)] sm:text-xl">
              {props.title}
            </h3>
            <p className="mt-2.5 line-clamp-2 text-sm sm:text-base">
              {props.content}
            </p>
          </div>

          <div className="aspect-[16/9] w-full shrink-0 overflow-hidden rounded-lg sm:aspect-auto sm:h-[110px] sm:w-[110px]">
            <Image
              src={buildImageUrl(props.thumbnail)}
              alt="썸네일"
              width={110}
              height={110}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-sm sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={buildImageUrl(props.author.image)}
              width={32}
              height={32}
              alt="프로필"
              className="h-8 w-8 rounded-full"
            />
            <span>{props.author.nickname}</span>
            <Divider />
            <span>{findOptionLabel(props.category, ARTICLE_OPTIONS)}</span>
          </div>

          {/* 날짜 + 조회수 + 좋아요 */}
          <div className="flex flex-wrap items-center gap-3 text-[var(--text-sub)]">
            <span>{format(new Date(props.createdAt), 'yyyy.MM.dd')}</span>
            <Divider />
            <span className="flex items-center gap-1">
              <FaEye />
              {props.views}
            </span>
            <Divider />
            <button
              type="button"
              onClick={e => handleLike(e, props.id)}
              className="flex items-center gap-1 hover:text-[var(--primary)]"
            >
              <FaHeart
                className={`transition-colors ${
                  props.liked ? 'text-red-500' : 'text-[var(--text-sub)]'
                }`}
              />
              {props.likeCount}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Divider() {
  return (
    <div className="flex h-3 w-px flex-shrink-0 bg-[var(--border-color)]" />
  );
}
