import { useLayoutEffect, useRef, useState } from 'react';
import type { StudyForumMessage } from '../../types/StudyForumTypes';
import ForumMessageItem from './ForumMessageItem';

interface Props {
  messages: StudyForumMessage[];
  userId: number | null;
  busy: boolean;
  hasNext: boolean;
  onOlder: () => Promise<boolean>;
  onDelete: (message: StudyForumMessage) => void;
}

export default function ForumMessageList({ messages, userId, busy, hasNext, onOlder, onDelete }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const initial = useRef(true);
  const lastNewest = useRef<number | undefined>(undefined);
  const anchor = useRef<{ id: string; offset: number } | null>(null);
  const [unseen, setUnseen] = useState(false);

  // ID를 앵커로 사용하여 이전 대화 추가 및 서버 재조회 후 읽던 위치를 복원합니다.
  useLayoutEffect(() => {
    const container = viewport.current;
    if (!container) return;
    const newest = messages[0];
    const added = newest && lastNewest.current !== undefined && newest.messageId > lastNewest.current;
    if (initial.current || atBottom.current || (added && newest.authorUserId === userId)) {
      container.scrollTop = container.scrollHeight;
      setUnseen(false);
    } else {
      const saved = anchor.current;
      const item = saved && container.querySelector<HTMLElement>(`[data-message-id="${saved.id}"]`);
      if (item && saved) container.scrollTop += item.getBoundingClientRect().top - container.getBoundingClientRect().top - saved.offset;
      if (added) setUnseen(true);
    }
    initial.current = false;
    lastNewest.current = newest?.messageId;
  }, [messages, userId]);

  const recordPosition = () => {
    const container = viewport.current;
    if (!container) return;
    atBottom.current = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;
    if (atBottom.current) setUnseen(false);
    const top = container.getBoundingClientRect().top;
    const first = [...container.querySelectorAll<HTMLElement>('[data-message-id]')]
      .find(item => item.getBoundingClientRect().bottom > top);
    anchor.current = first ? { id: first.dataset.messageId!, offset: first.getBoundingClientRect().top - top } : null;
  };

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={viewport} onScroll={recordPosition} role="region" aria-label="토론 메시지" tabIndex={0} className="h-full overflow-y-auto p-4 [overflow-anchor:none]">
        {hasNext && <div className="text-center mb-4"><button type="button" disabled={busy} onClick={() => { recordPosition(); atBottom.current = false; void onOlder(); }} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 underline disabled:opacity-50">이전 메시지 더 보기</button></div>}
        {messages.length === 0 ? <p className="py-20 text-center text-sm text-gray-500">아직 메시지가 없습니다. 첫 대화를 시작해 보세요.</p>
          : <ol className="space-y-3">{[...messages].reverse().map(message => <ForumMessageItem key={message.messageId} message={message} mine={userId !== null && message.authorUserId === userId} busy={busy} onDelete={onDelete} />)}</ol>}
      </div>
      {unseen && <button type="button" onClick={() => { const container = viewport.current; if (container) container.scrollTop = container.scrollHeight; setUnseen(false); atBottom.current = true; }} className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm shadow-sm">새 메시지 보기 ↓</button>}
    </div>
  );
}
