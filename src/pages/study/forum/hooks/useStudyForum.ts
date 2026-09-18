import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getApiErrorCode, getApiErrorUtil } from '../../../../utils/getApiErrorUtil';
import { createForumMessage, deleteForumMessage, getForumMembership, getForumMessages } from '../../api/studyForumApi';
import type { StudyArchiveResponse } from '../../api/studyApi';
import type { CursorResponse } from '../../../../types/PaginationType';
import type { StudyForumMessage } from '../../types/StudyForumTypes';
import { mergeForumMessages, readForumRange } from './forumPagination';

const emptyPage: CursorResponse<StudyForumMessage> = { content: [], nextCursor: null, hasNext: false };
// 최신 30개뿐 아니라 표시 중인 범위를 재검증하므로 과도한 반복 요청을 피합니다.
const REFRESH_INTERVAL_MS = 15_000;
type Operation = 'refresh' | 'older' | 'send' | 'delete';

export function useStudyForum(studyId: number) {
  const [page, setPage] = useState(emptyPage);
  const pageRef = useRef(emptyPage);
  const [membership, setMembership] = useState<StudyArchiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const blocked = useRef(false);
  const busy = useRef(false);
  const controller = useRef<AbortController | null>(null);

  const commit = useCallback((next: CursorResponse<StudyForumMessage>) => {
    pageRef.current = next;
    setPage(next);
  }, []);

  const handleError = useCallback((cause: unknown) => {
    if (axios.isCancel(cause)) return;
    const code = getApiErrorCode(cause);
    if (code === 'STUDY-FORUM-002') {
      setMembership(previous => previous ? { ...previous, status: 'COMPLETED' } : previous);
    } else if (code === 'STUDY-FORUM-001' || (axios.isAxiosError(cause)
      && cause.response?.status === 403 && code !== 'STUDY-FORUM-004')) {
      blocked.current = true;
      setDenied(true);
      commit(emptyPage);
    }
    setError(getApiErrorUtil(cause, '토론방 요청에 실패했습니다. 다시 시도해 주세요.'));
  }, [commit]);

  // 모든 목록 변경을 직렬화해 늦은 조회 응답이 작성·삭제 결과를 덮지 않게 합니다.
  const run = useCallback(async (kind: Operation, work: (signal: AbortSignal) => Promise<void>) => {
    const activeController = controller.current;
    if (busy.current || blocked.current || !activeController || activeController.signal.aborted) return false;
    busy.current = true;
    setOperation(kind);
    setError(null);
    try {
      await work(activeController.signal);
      return !activeController.signal.aborted;
    } catch (cause) {
      if (!activeController.signal.aborted) handleError(cause);
      return false;
    } finally {
      if (!activeController.signal.aborted) {
        busy.current = false;
        setOperation(null);
        setLoading(false);
      }
    }
  }, [handleError]);

  const refresh = useCallback(() => run('refresh', async signal => {
    const member = await getForumMembership(studyId, signal);
    if (signal.aborted) return;
    setMembership(member);
    if (!member || !['ACTIVE', 'COMPLETED'].includes(member.status)) {
      blocked.current = true;
      setDenied(true);
      commit(emptyPage);
      return;
    }
    const next = await readForumRange(before => getForumMessages(studyId, signal, before), pageRef.current.content.at(-1)?.messageId);
    if (!signal.aborted) commit(next);
  }), [commit, run, studyId]);

  useEffect(() => {
    controller.current = new AbortController();
    busy.current = false;
    blocked.current = false;
    void refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    const timer = window.setInterval(onVisible, REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);
    return () => {
      controller.current?.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onVisible);
    };
  }, [refresh]);

  const loadOlder = () => run('older', async signal => {
    const current = pageRef.current;
    if (!current.hasNext || current.nextCursor === null) return;
    const older = await getForumMessages(studyId, signal, current.nextCursor);
    if (!signal.aborted) commit({ ...older, content: mergeForumMessages([...current.content, ...older.content]) });
  });

  const send = (content: string) => run('send', async signal => {
    const message = await createForumMessage(studyId, content, signal);
    if (!signal.aborted) commit({ ...pageRef.current, content: mergeForumMessages([message, ...pageRef.current.content]) });
  });

  const remove = (messageId: number) => run('delete', async signal => {
    try {
      await deleteForumMessage(studyId, messageId, signal);
    } catch (cause) {
      // 다른 탭에서 이미 삭제한 메시지도 현재 목록에서 제거합니다.
      if (getApiErrorCode(cause) !== 'STUDY-FORUM-003') throw cause;
    }
    if (!signal.aborted) commit({ ...pageRef.current, content: pageRef.current.content.filter(row => row.messageId !== messageId) });
  });

  return { page, membership, loading, operation, error, denied, refresh, loadOlder, send, remove };
}
