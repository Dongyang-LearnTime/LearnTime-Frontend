import type { CursorResponse } from '../../../../types/PaginationType';
import type { StudyForumMessage } from '../../types/StudyForumTypes';

/** 표시 중인 가장 오래된 ID까지 다시 읽어 삭제·차단과 신규 대화의 빈 구간을 함께 반영합니다. */
export async function readForumRange(
  fetchPage: (beforeId?: number) => Promise<CursorResponse<StudyForumMessage>>,
  oldestId?: number,
): Promise<CursorResponse<StudyForumMessage>> {
  let page = await fetchPage();
  const rows = [...page.content];
  const cursors = new Set<number>();
  while (oldestId !== undefined && page.hasNext && page.nextCursor !== null
    && (rows.at(-1)?.messageId ?? 0) > oldestId) {
    if (cursors.has(page.nextCursor)) throw new Error('메시지 조회 커서가 반복되었습니다. 다시 시도해 주세요.');
    cursors.add(page.nextCursor);
    page = await fetchPage(page.nextCursor);
    rows.push(...page.content);
  }
  if (oldestId === undefined) return { ...page, content: mergeForumMessages(rows) };
  // 경계를 찾으려고 추가 조회한 과거 행은 노출하지 않아 자동 갱신마다 목록이 늘어나는 것을 방지합니다.
  const content = mergeForumMessages(rows.filter(row => row.messageId >= oldestId));
  const hasNext = page.hasNext || rows.some(row => row.messageId < oldestId);
  return { content, hasNext, nextCursor: hasNext ? content.at(-1)?.messageId ?? oldestId : null };
}

/** 서버 ID 순서를 유지하며 페이지 경계의 중복을 제거합니다. */
export function mergeForumMessages(rows: StudyForumMessage[]): StudyForumMessage[] {
  return [...new Map(rows.map(row => [row.messageId, row])).values()]
    .sort((a, b) => b.messageId - a.messageId);
}
