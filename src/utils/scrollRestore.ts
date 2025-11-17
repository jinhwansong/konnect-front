// 스크롤 위치 복원 유틸리티
// prepend 시 스크롤 위치를 정확하게 유지하기 위한 헬퍼 함수들

export interface ScrollAnchor {
  id: string;
  offsetTop: number;
  scrollTop: number;
}

export function captureScrollAnchor(
  scrollContainer: HTMLElement | null
): ScrollAnchor | null {
  if (!scrollContainer) return null;
  const firstVisible = scrollContainer.querySelector('[data-id]');
  if (!firstVisible) return null;

  const rect = firstVisible.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  return {
    id: (firstVisible as HTMLElement).dataset.id!,
    offsetTop: rect.top - containerRect.top,
    scrollTop: scrollContainer.scrollTop,
  };
}

export function restoreScrollAnchor(
  scrollContainer: HTMLElement | null,
  anchor: ScrollAnchor | null,
  onComplete?: () => void
) {
  if (!scrollContainer || !anchor) {
    onComplete?.();
    return;
  }

  const restore = (phase = 1) => {
    try {
      const anchorElement = scrollContainer.querySelector(
        `[data-id="${anchor.id}"]`
      ) as HTMLElement | null;
      if (!anchorElement) return onComplete?.();

      const rect = anchorElement.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const diff = rect.top - containerRect.top - anchor.offsetTop;
      if (Math.abs(diff) > 1) scrollContainer.scrollTop -= diff;

      if (phase < 3) requestAnimationFrame(() => restore(phase + 1));
      else onComplete?.();
    } catch {
      onComplete?.();
    }
  };

  requestAnimationFrame(() => restore(1));
}

// scrollHeight diff 기반 보정 (fallback)
export function restoreScrollByHeightDiff(
  scrollContainer: HTMLElement | null,
  beforeHeight: number,
  beforeScrollTop: number
): void {
  if (!scrollContainer) return;

  requestAnimationFrame(() => {
    const afterHeight = scrollContainer.scrollHeight;
    const heightDiff = afterHeight - beforeHeight;

    if (heightDiff > 0) {
      scrollContainer.scrollTop = beforeScrollTop + heightDiff;
    }
  });
}
