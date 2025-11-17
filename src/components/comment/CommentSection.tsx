import { useSession } from 'next-auth/react';
import React from 'react';

import {
  useDeleteComment,
  useGetComment,
  usePatchComment,
  usePostComment,
} from '@/hooks/query/useArticle';
import { useToastStore } from '@/stores/useToast';
import { PatchComment } from '@/types/article';

import VirtualizedList from '../common/VirtualizedList';

import CommentForm from './CommentForm';
import CommentItems from './CommentItem';

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const {
    data: comment,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetComment(articleId);
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: patchComment } = usePatchComment();
  const { mutate: postComment } = usePostComment();
  const comments = comment?.pages.flatMap(page => page.data) ?? [];
  const { data: session } = useSession();
  const { show } = useToastStore();
  const handleDeleteComment = (id: string) => {
    deleteComment(
      {
        id,
      },
      {
        onSuccess: () => {
          show('댓글 삭제를 완료했습니다.', 'success');
        },
        onError: () => {
          show('댓글 삭제를 실패했습니다.', 'error');
        },
      }
    );
  };
  const handlePatchComment = ({ id, content }: PatchComment) => {
    patchComment(
      {
        id,
        content,
      },
      {
        onSuccess: () => {
          show('댓글 수정를 완료했습니다.', 'success');
        },
        onError: () => {
          show('댓글 수정를 실패했습니다.', 'error');
        },
      }
    );
  };
  const handleCreateComment = (data: {
    content: string;
    parentId?: string;
  }) => {
    postComment(
      {
        id: articleId,
        data,
      },
      {
        onSuccess: () => {
          show('댓글 작성을 완료했습니다.', 'success');
        },
        onError: () => {
          show('댓글 작성을 실패했습니다.', 'error');
        },
      }
    );
  };

  const handleReplyComment = (parentId: string, content: string) => {
    postComment(
      { id: articleId, data: { content, parentId } },
      {
        onSuccess: () => {
          show('답글을 작성했습니다.', 'success');
        },
        onError: () => {
          show('답글 작성에 실패했습니다.', 'error');
        },
      }
    );
  };
  return (
    <article className="mt-10">
      <h3 className="mb-4 text-lg font-semibold text-[var(--text-bold)]">
        댓글 {comment?.pages[0].totalAll}개
      </h3>
      <CommentForm onSubmit={handleCreateComment} />
      <div className="my-10 h-px bg-[var(--border-color)]" />
      <VirtualizedList
        data={comments}
        emptyText="아직 댓글이 없습니다."
        useWindowScroll={true}
        mode="feed"
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
        loading={isFetchingNextPage}
        error={isError ? '댓글을 불러오지 못했습니다.' : undefined}
        renderItem={item => (
          <CommentItems
            data={item}
            isMine={session?.user.nickname}
            onDelete={id => handleDeleteComment(id)}
            onEdit={(id, content) => handlePatchComment({ id, content })}
            onReply={(parentId, content) =>
              handleReplyComment(parentId, content)
            }
          />
        )}
      />
    </article>
  );
}
