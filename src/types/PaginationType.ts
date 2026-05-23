// 커서 기반 페이징 응답 인터페이스
export interface CursorResponse<T> {
  content: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 오프셋 기반 페이징 응답 인터페이스
export interface PageResponse<T> {
  content: T[];
  currentPage: number; // 현재 페이지 번호 (0-based)
  pageSize: number; // 페이지당 데이터 개수
  totalElements: number;   // 전체 데이터 개수
  totalPages: number; // 전체 페이지 개수
  hasNext: boolean; // 다음 페이지 존재 여부
}