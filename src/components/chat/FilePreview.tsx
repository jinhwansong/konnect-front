'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export default function FilePreview({ files, onRemove }: FilePreviewProps) {
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>(
    {}
  );

  // 이미지 파일인지 확인
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  // 파일 아이콘 가져오기
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
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

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 이미지 미리보기 생성
  const createImagePreview = (file: File, index: number) => {
    if (isImageFile(file) && !imagePreviews[index]) {
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreviews(prev => ({
          ...prev,
          [index]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-2 mb-3 flex max-h-24 gap-2 overflow-x-auto">
      {files.map((file, index) => {
        const isImage = isImageFile(file);

        // 이미지 미리보기 생성
        if (isImage && !imagePreviews[index]) {
          createImagePreview(file, index);
        }

        return (
          <div key={index} className="group relative flex-shrink-0">
            {isImage && imagePreviews[index] ? (
              // 이미지 썸네일
              <div className="h-16 w-16 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-bg-sub)]">
                <Image
                  src={imagePreviews[index]}
                  alt={file.name}
                  className="h-full w-full object-cover"
                  width={64}
                  height={64}
                />
                <button
                  onClick={() => onRemove(index)}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-danger)] text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ) : (
              // 파일 아이콘
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--card-bg-sub)] p-2">
                <div className="mb-1 text-lg">{getFileIcon(file)}</div>
                <div className="w-full truncate text-center text-xs text-[var(--text)]">
                  {file.name}
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-danger)] text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* 파일 정보 툴팁 */}
            <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded bg-[var(--primary-sub03)] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              <div className="font-medium">{file.name}</div>
              <div className="text-gray-300">{formatFileSize(file.size)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
