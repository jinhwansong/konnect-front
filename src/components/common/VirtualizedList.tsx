'use client';

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  type ReactNode,
} from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

interface BaseVirtualizedListProps<T> {
  /** 렌더링할 데이터 리스트 */
  data: T[];
  /** 각 아이템 렌더 함수 */
  renderItem: (item: T, index: number) => ReactNode;
  /** className */
  className?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 빈 리스트 메시지 */
  emptyText?: string;
  /** 높이 */
  height?: number | string;
}

export interface ChatVirtualHandle {
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void;
  scrollToIndex: (index: number, behavior?: 'auto' | 'smooth') => void;
}

interface ChatListProps<T> extends BaseVirtualizedListProps<T> {
  mode: 'chat';
  /** 첫 번째 아이템의 인덱스 (prepend 지원) */
  firstItemIndex?: number;
  /** 스크롤이 최상단에 도달했을 때 호출 (이전 메시지 로드) */
  onLoadPrevious?: () => void;
  /** 더 불러올 이전 메시지가 있는지 */
  hasPrevious?: boolean;
  /** 이전 메시지 로딩 중 */
  loadingPrevious?: boolean;
  /** TanStack Virtual ref (외부에서 스크롤 제어용) */
  virtuosoRef?: React.RefObject<ChatVirtualHandle | null>;
  /** 스크롤이 하단에 있는지 상태 변경 콜백 */
  onAtBottomStateChange?: (isAtBottom: boolean) => void;
}

interface FeedListProps<T> extends BaseVirtualizedListProps<T> {
  mode: 'feed';
  loadMore?: () => void;
  hasMore?: boolean;
  useWindowScroll?: boolean;
}

type VirtualizedListProps<T> = ChatListProps<T> | FeedListProps<T>;

// Chat 모드 컴포넌트 (react-virtuoso 기반 양방향 가상화)
function ChatList<T>({
  data,
  renderItem,
  className = '',
  onLoadPrevious,
  hasPrevious = false,
  loadingPrevious = false,
  virtuosoRef: externalRef,
  onAtBottomStateChange,
}: Omit<
  ChatListProps<T>,
  'mode' | 'loading' | 'error' | 'emptyText' | 'height'
>) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const isLoadingPreviousRef = useRef(false);
  const scrollRestorationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoadTimeRef = useRef<number>(0);
  const hasInitializedRef = useRef(false);

  // 외부 ref에 스크롤 제어 메서드 노출
  useImperativeHandle(
    externalRef,
    () => ({
      scrollToBottom: (behavior = 'smooth') => {
        virtuosoRef.current?.scrollToIndex({
          index: data.length - 1,
          align: 'end',
          behavior: behavior === 'smooth' ? 'smooth' : 'auto',
        });
      },
      scrollToIndex: (index, behavior = 'smooth') => {
        virtuosoRef.current?.scrollToIndex({
          index,
          align: 'start',
          behavior: behavior === 'smooth' ? 'smooth' : 'auto',
        });
      },
    }),
    [data.length]
  );

  // startReached 핸들러 (상단 도달 시 이전 메시지 로드)
  const handleStartReached = () => {
    const now = Date.now();

    // 디바운싱: 마지막 로드로부터 1초 이내면 무시
    if (now - lastLoadTimeRef.current < 1000) {
      // ('⏱️ 디바운싱: 1초 이내');
      return;
    }

    // loadingPrevious는 React Query의 isFetchingNextPage와 연동됨
    // 이미 로딩 중이거나 플래그가 설정되어 있으면 무시
    if (!hasPrevious || loadingPrevious || isLoadingPreviousRef.current) {
      // ('🚫 조건 불충족');
      return;
    }

    // 즉시 플래그 설정 및 시간 기록
    isLoadingPreviousRef.current = true;
    lastLoadTimeRef.current = now;

    // 1. 스크롤 컨테이너에서 현재 위치 저장
    const scrollEl = scrollerRef.current;
    if (!scrollEl) {
      isLoadingPreviousRef.current = false;
      return;
    }

    const beforeScrollHeight = scrollEl.scrollHeight;
    const beforeScrollTop = scrollEl.scrollTop;

    // 기존 타임아웃 취소
    if (scrollRestorationTimeoutRef.current) {
      clearTimeout(scrollRestorationTimeoutRef.current);
    }

    // 2. 이전 메시지 로드 (비동기)
    Promise.resolve()
      .then(() => {
        if (onLoadPrevious) {
          return onLoadPrevious();
        }
      })
      .then(() => {
        // 3. scrollHeight 차이 기반 스크롤 위치 복원 (즉시 + 2단계 보정)
        // 첫 번째: 즉시 대략적인 복원 (튐 방지)
        const immediateAfterHeight = scrollEl.scrollHeight;
        const immediateHeightDiff = immediateAfterHeight - beforeScrollHeight;
        if (immediateHeightDiff > 0) {
          scrollEl.scrollTop = beforeScrollTop + immediateHeightDiff;
        }

        // 두 번째: RAF로 정확한 복원
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const afterScrollHeight = scrollEl.scrollHeight;
            const heightDiff = afterScrollHeight - beforeScrollHeight;

            if (heightDiff > 0) {
              // 추가된 높이만큼 스크롤 위치를 아래로 이동
              scrollEl.scrollTop = beforeScrollTop + heightDiff;
            }

            // 스크롤 복원 완료 후 500ms 대기 (안정화 감소)
            scrollRestorationTimeoutRef.current = setTimeout(() => {
              isLoadingPreviousRef.current = false;
              scrollRestorationTimeoutRef.current = null;
            }, 500);
          });
        });
      })
      .catch(_ => {
        // 에러 발생 시에도 플래그 해제
        scrollRestorationTimeoutRef.current = setTimeout(() => {
          isLoadingPreviousRef.current = false;
          scrollRestorationTimeoutRef.current = null;
        }, 700);
      });
  };

  // 초기 로딩 시 최신 메시지로 스크롤
  useEffect(() => {
    if (data.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Virtuoso의 렌더링 완료 대기 후 스크롤
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const scrollEl = scrollerRef.current;
              if (scrollEl) {
                // 스크롤을 맨 아래로 강제 이동
                scrollEl.scrollTop =
                  scrollEl.scrollHeight - scrollEl.clientHeight;
              }
            });
          });
        });
      }, 200);
    }
  }, [data.length]);

  // cleanup
  useEffect(() => {
    return () => {
      if (scrollRestorationTimeoutRef.current) {
        clearTimeout(scrollRestorationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`flex-1 ${className}`}
      style={{
        height: '100%',
        overflow: 'hidden',
        willChange: 'scroll-position',
      }}
    >
      <Virtuoso
        ref={virtuosoRef}
        scrollerRef={ref => {
          if (ref instanceof HTMLElement) {
            scrollerRef.current = ref;
          }
        }}
        data={data}
        // message.id 기반 고유 키
        computeItemKey={(index, item) => {
          const chatItem = item as { id?: string };
          return chatItem.id || `item-${index}`;
        }}
        // 양방향 가상화 설정
        initialTopMostItemIndex={data.length - 1}
        alignToBottom
        // 스크롤 동작
        followOutput={isAtBottom => (isAtBottom ? 'smooth' : false)}
        // 무한 스크롤 트리거 - rangeChanged로 변경
        rangeChanged={range => {
          // 초기화 완료 전에는 무시
          if (!hasInitializedRef.current) {
            return;
          }

          // 상단 아주 가까이 도달하면 이전 메시지 로드 (2개 이하)
          if (
            range.startIndex <= 2 &&
            hasPrevious &&
            !loadingPrevious &&
            !isLoadingPreviousRef.current
          ) {
            handleStartReached();
          }
        }}
        atTopThreshold={200}
        atBottomThreshold={100}
        atBottomStateChange={atBottom => {
          onAtBottomStateChange?.(atBottom);
        }}
        // 성능 최적화
        overscan={{ main: 500, reverse: 500 }}
        increaseViewportBy={{ top: 500, bottom: 500 }}
        // 아이템 렌더링
        itemContent={(index, item) => {
          const chatItem = item as { id?: string };
          return (
            <div data-id={chatItem.id} data-index={index}>
              {renderItem(item, index)}
            </div>
          );
        }}
        // 컴포넌트
        components={{
          Header: () =>
            loadingPrevious ? (
              <div
                className="flex animate-pulse justify-center py-3"
                style={{ minHeight: '60px' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            ) : hasPrevious ? (
              <div
                className="flex justify-center py-2 opacity-0 transition-opacity hover:opacity-50"
                style={{ minHeight: '40px' }}
              >
                <p className="text-xs text-[var(--text-sub)]">
                  위로 스크롤하여 이전 메시지 보기
                </p>
              </div>
            ) : null,
        }}
        style={{ height: '100%' }}
      />
    </div>
  );
}

// 메인 VirtualizedList 컴포넌트
export default function VirtualizedList<T>({
  data,
  renderItem,
  className = '',
  loading = false,
  error,
  emptyText = '데이터가 없습니다.',
  height = '100%',
  ...rest
}: VirtualizedListProps<T>) {
  const mode = 'mode' in rest ? rest.mode : 'chat';

  /** 공통 에러 처리 */
  if (error) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  /** 공통 빈 데이터 처리 */
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--text-sub)]">
        {loading ? '로딩 중...' : emptyText}
      </div>
    );
  }

  // FEED 모드 (댓글, 피드, 무한스크롤)
  if (mode === 'feed') {
    const {
      loadMore,
      hasMore = false,
      useWindowScroll = true,
    } = rest as FeedListProps<T>;

    return (
      <div className={`${className || ''}`}>
        <Virtuoso
          useWindowScroll={useWindowScroll}
          data={data}
          style={{ height }}
          endReached={() => {
            if (hasMore && loadMore && !loading) loadMore();
          }}
          itemContent={(index, item) => (
            <div className={index !== data.length - 1 ? 'pb-6' : ''}>
              {renderItem(item, index)}
            </div>
          )}
          components={{
            Footer: () =>
              loading ? (
                <div className="flex justify-center py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
                </div>
              ) : null,
          }}
        />
      </div>
    );
  }

  // CHAT 모드 (TanStack Virtual 기반 채팅, 하단 고정)
  if (mode === 'chat') {
    const chatProps = rest as ChatListProps<T>;

    return (
      <ChatList
        data={data}
        renderItem={renderItem}
        className={className}
        onLoadPrevious={chatProps.onLoadPrevious}
        hasPrevious={chatProps.hasPrevious}
        loadingPrevious={chatProps.loadingPrevious}
        virtuosoRef={chatProps.virtuosoRef}
        onAtBottomStateChange={chatProps.onAtBottomStateChange}
      />
    );
  }

  return null;
}
