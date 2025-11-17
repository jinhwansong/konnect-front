import Image from 'next/image';
import React, { useState } from 'react';

import { CommentItem } from '@/types/article';
import { formatToKoreanDate } from '@/utils/formatDate';
import { buildImageUrl } from '@/utils/getImageUrl';

import Button from '../common/Button';
import Textarea from '../common/Textarea';

import CommentChild from './CommentChild';
import CommentForm from './CommentForm';

interface CommentItemProps {
  data: CommentItem;
  isMine?: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
  onReply?: (parentId: string, content: string) => void;
}

export default function CommentItems({
  data,
  isMine,
  onDelete,
  onEdit,
  onReply,
}: CommentItemProps) {
  const [isEditing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.content);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSave = () => {
    if (editValue.trim().length === 0) return;
    onEdit?.(data.id, editValue.trim());
    setEditing(false);
  };
  return (
    <div className="group rounded-lg bg-[var(--card-bg-sub)] p-5 transition-colors">
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <Image
          src={buildImageUrl(data.author.image ?? '')}
          alt={data.author.nickname}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover"
        />

        <div className="flex-1">
          {/* 작성자 + 작성일 */}
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[var(--text)]">
              {data.author.nickname}
            </p>
            <span className="text-xs text-[var(--text-sub)]">
              {formatToKoreanDate(data.createdAt)}
            </span>
          </div>

          {/* 본문 / 수정 모드 */}
          <div className="mt-2">
            {isEditing ? (
              <div className="mt-3">
                <Textarea
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  rows={3}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setEditValue(data.content);
                      setEditing(false);
                    }}
                  >
                    취소
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleSave}>
                    저장
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-[var(--text)]">
                {data.content}
              </p>
            )}
          </div>

          {/* 액션 버튼 → hover 시에만 노출 */}
          {!isEditing && (
            <div className="mt-1 hidden gap-3 text-xs text-[var(--text-sub)] group-hover:flex">
              {isMine === data.author.nickname && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="transition-colors hover:text-[var(--primary)]"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete?.(data.id)}
                    className="transition-colors hover:text-red-500"
                  >
                    삭제
                  </button>
                </>
              )}
              <button
                className="transition-colors hover:text-[var(--primary)]"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                답글 달기
              </button>
            </div>
          )}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                onSubmit={({ content }) => {
                  onReply?.(data.id, content);
                  setShowReplyForm(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 */}
      {data.children && data.children.length > 0 && (
        <ul className="mt-4 ml-4 space-y-4">
          {data.children.map(child => (
            <CommentChild
              key={child.id}
              data={child}
              isMine={isMine}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
