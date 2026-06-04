import { useState, useEffect, useCallback } from 'react';
import type { PageResponse } from '../types/PaginationType';

interface UseOffsetInfiniteScrollProps<T> {
  fetchData: (page: number) => Promise<PageResponse<T>>;
}

export function useOffsetInfiniteScroll<T>({ fetchData }: UseOffsetInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (!hasNext || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetchData(page);
      setData((prev) => {
        // 중복 방지를 위한 Map 처리 (단순 배열 합치기보다 안정적)
        // 여기서는 오프셋 페이징이므로 단순 병합함.
        return [...prev, ...res.content];
      });
      setHasNext(res.hasNext);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, hasNext, isLoading, page]);

  // 마운트 시 첫 페이지 로드
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, hasNext, isLoading, error, loadMore };
}
