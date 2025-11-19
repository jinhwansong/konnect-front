// 기본 useQuery 옵션 프리셋
export const defaultQueryOptions = {
  retry: false,
  staleTime: 1000 * 60 * 5,
  refetchOnMount: 'always',
  refetchOnReconnect: 'always',
  refetchOnWindowFocus: 'always',
} as const;

export function withQueryDefaults<
  TOptions extends Record<string, unknown> = Record<string, unknown>,
>(options: TOptions): TOptions & typeof defaultQueryOptions {
  return {
    ...defaultQueryOptions,
    ...options,
  } as TOptions & typeof defaultQueryOptions;
}
