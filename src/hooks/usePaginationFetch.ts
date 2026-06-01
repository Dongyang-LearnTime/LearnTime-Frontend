import { useState, useEffect, useCallback } from 'react';
import type { PageResponse } from '../types/paginationType';

interface UsePaginationFetchProps<T> {
  fetchData: (page: number) => Promise<PageResponse<T>>;
  initialPage?: number;
}

export function usePaginationFetch<T>({ fetchData, initialPage = 0 }: UsePaginationFetchProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchData(targetPage);
      setData(res.content);
      setTotalPages(res.totalPages);
      setPage(res.currentPage);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  // 마운트 또는 page 변경 시(직접적인 요청이 아닐 때) 초기 로드용
  // 하지만 여기서는 onChange 시 loadPage를 직접 호출하므로 마운트 시 1회만 호출하도록 제어합니다.
  useEffect(() => {
    loadPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePage = (newPage: number) => {
    if (newPage === page || newPage < 0 || newPage >= totalPages) return;
    loadPage(newPage);
  };

  return { data, page, totalPages, isLoading, error, changePage, refresh: () => loadPage(page) };
}
