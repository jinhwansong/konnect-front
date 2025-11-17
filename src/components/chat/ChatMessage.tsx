'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChatMessageProps {
  message: {
    id: string;
    userId: string;
    userName: string;
    userImage?: string;
    isMentor: boolean;
    message: string;
    timestamp: Date;
    type: 'text' | 'system' | 'file';
    fileUrl?: string;
    fileName?: string;
  };
  isCurrentUser: boolean;
}

export default function ChatMessage({
  message,
  isCurrentUser,
}: ChatMessageProps) {
  // 시스템 메시지 처리
  if (message.type === 'system') {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="rounded-full bg-[var(--card-bg-sub)] px-3 py-1 text-xs text-[var(--text-sub)]">
          {message.message}
        </div>
      </div>
    );
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️';
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📎';
    }
  };

  return (
    <div
      className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* 프로필 이미지 */}
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--card-bg-sub)]">
          {/* {message.userImage ? (
            <Image
              src={message.userImage}
              alt={message.userName}
              className="h-full w-full object-cover"
              width={32}
              height={32}
            />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-sub02)] text-xs font-medium text-[var(--text-sub)]">
              {message.userName.charAt(0)}
            </div>
          )} */}
          d
        </div>
      </div>

      {/* 메시지 컨텐츠 */}
      <div
        className={`flex max-w-[70%] flex-col gap-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}
      >
        {/* 사용자 이름 (다른 사람 메시지일 때만) */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--text)]">
              {message.userName}
            </span>
            {message.isMentor && (
              <span className="rounded-full bg-[var(--primary-sub02)] px-2 py-0.5 text-xs text-[var(--primary)]">
                멘토
              </span>
            )}
          </div>
        )}

        {/* 메시지 말풍선 */}
        <div
          className={`rounded-2xl px-3 py-2 text-sm break-all whitespace-pre-wrap ${
            isCurrentUser
              ? 'rounded-br-md bg-[var(--primary)] text-white'
              : message.isMentor
                ? 'rounded-bl-md border border-[var(--primary-sub02)] bg-[var(--primary-sub02)] text-[var(--text-bold)]'
                : 'rounded-bl-md bg-[var(--card-bg-sub)] text-[var(--text-bold)]'
          }`}
        >
          {/* 파일 메시지 처리 */}
          {message.type === 'file' && message.fileUrl && message.fileName ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFileIcon(message.fileName)}</span>
                <span className="text-sm font-medium">{message.fileName}</span>
              </div>
              {message.message && (
                <p className="text-sm leading-relaxed break-all whitespace-pre-wrap">
                  {message.message}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed break-all whitespace-pre-wrap">
              {message.message}
            </p>
          )}
        </div>

        {/* 시간 */}
        <div
          className={`text-xs text-[var(--text-sub)] ${isCurrentUser ? 'text-right' : 'text-left'}`}
        >
          {format(message.timestamp, 'HH:mm', { locale: ko })}
        </div>
      </div>
    </div>
  );
}
