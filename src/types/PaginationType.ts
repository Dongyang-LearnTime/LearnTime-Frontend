// 커서 기반 페이징 응답 인터페이스
export interface CursorResponse<T> {
  content: T[];
  nextCursor: number | null;
  hasNext: boolean;
}
