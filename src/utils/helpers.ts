// 공통 헬퍼 함수들
import { type ClassValue, clsx } from 'clsx';

/**
 * 클래스명을 조건부로 결합하는 유틸리티
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * 숫자를 한국 원화 형식으로 포맷
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 날짜를 한국 형식으로 포맷 (YY.MM.DD)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear().toString().slice(-2);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 시간을 한국 형식으로 포맷 (HH:mm)
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 분을 한국 시간 형식으로 포맷
 */
export function formatDuration(minutes: number): string {
  return minutes % 60 === 0 ? `${minutes / 60}시간` : `${minutes}분`;
}

/**
 * 상대 시간 포맷 (예: 3시간 전, 2일 전)
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - target.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDate(target);
}

/**
 * 문자열을 안전하게 자르기
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 포맷
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * URL에서 이미지 URL을 생성
 */
export function buildImageUrl(
  url?: string,
  fallback = '/icon/IcPeople.avif'
): string {
  
  if (!url) return fallback;
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_AUTH_URL}/${url}`;
}

/**
 * 옵션 배열에서 라벨 찾기
 */
export function findOptionLabel<T extends { label: string; value: string }>(
  value: string,
  options: T[]
): string {
  return options.find(option => option.value === value)?.label ?? value;
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 스로틀 함수
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 객체에서 undefined 값 제거
 */
export function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

/**
 * 배열을 청크 단위로 나누기
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 깊은 복사
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}
