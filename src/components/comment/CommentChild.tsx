import Image from 'next/image';
import React from 'react';
import { FiCornerDownRight } from 'react-icons/fi';

import { CommentItem } from '@/types/article';
import { formatToKoreanDate } from '@/utils/formatDate';
import { buildImageUrl } from '@/utils/getImageUrl';

import Button from '../common/Button';
import Textarea from '../common/Textarea';

interface CommentChildProps {
  data: CommentItem;
  isMine?: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export default function CommentChild({
  data,
  isMine,
  onDelete,
  onEdit,
}: CommentChildProps) {
  const [isEditing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(data.content);

  const handleSave = () => {
    if (!editValue.trim()) return;
    onEdit?.(data.id, editValue.trim());
    setEditing(false);
  };

  return (
    <li className="group flex gap-3">
      <FiCornerDownRight className="mt-1 text-[var(--text-sub)]" size={16} />
      {/* 아바타 */}
      <Image
        src={buildImageUrl(data.author.image ?? '')}
        alt={data.author.nickname || '익명'}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />

      <div className="flex-1">
        {/* 작성자 + 액션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[var(--text)]">
              {data.author.nickname}
            </p>
            <span className="text-xs text-[var(--text-muted)]">
              {formatToKoreanDate(data.createdAt)}
            </span>
          </div>

          {!isEditing && isMine === data.author.nickname && (
            <div className="hidden gap-2 text-xs text-[var(--text-sub)] group-hover:flex">
              <button
                onClick={() => setEditing(true)}
                className="hover:text-[var(--primary)]"
              >
                수정
              </button>
              <button
                onClick={() => onDelete?.(data.id)}
                className="hover:text-red-500"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 본문 / 수정 모드 */}
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="w-full resize-none rounded-md border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm text-[var(--text)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
              rows={2}
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
          <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-[var(--text)]">
            {data.content}
          </p>
        )}
      </div>
    </li>
  );
}
