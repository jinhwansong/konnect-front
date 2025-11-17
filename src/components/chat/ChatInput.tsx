'use client';

import { useState, useRef, KeyboardEvent, DragEvent } from 'react';
import { FiSend, FiPaperclip, FiImage } from 'react-icons/fi';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import FilePreview from './FilePreview';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;

    onSendMessage(message, files.length > 0 ? files : undefined);
    setMessage('');
    setFiles([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div
      className={`p-4 transition-colors ${isDragOver ? 'bg-[var(--primary-sub02)]' : 'bg-[var(--card-bg)]'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 파일 미리보기 */}
      {files.length > 0 && (
        <FilePreview files={files} onRemove={handleRemoveFile} />
      )}

      {/* 입력 영역 */}
      <div className="flex items-center gap-3">
        {/* 파일 첨부 버튼 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2 text-[var(--text-sub)] transition-colors hover:text-[var(--text)]"
        >
          <FiPaperclip className="h-4 w-4" />
        </button>

        {/* 메시지 입력 */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="메시지를 입력하세요..."
            className="rounded-full"
          />
        </div>

        {/* 전송 버튼 */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() && files.length === 0}
          className="h-8 w-8 flex-shrink-0 rounded-full p-0"
          size="icon"
          variant={message.trim() || files.length > 0 ? 'primary' : 'secondary'}
        >
          <FiSend className="h-4 w-4" />
        </Button>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
      />

      {/* 드래그 앤 드롭 안내 */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--primary)] bg-[var(--primary-sub02)]/80 backdrop-blur-sm">
          <div className="text-center">
            <FiImage className="mx-auto mb-2 h-8 w-8 text-[var(--primary)]" />
            <p className="text-sm font-medium text-[var(--primary)]">
              파일을 여기에 놓으세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
