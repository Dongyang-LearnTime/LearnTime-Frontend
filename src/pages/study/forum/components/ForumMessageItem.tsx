import type { StudyForumMessage } from '../../types/StudyForumTypes';

interface Props {
  message: StudyForumMessage;
  mine: boolean;
  busy: boolean;
  onDelete: (message: StudyForumMessage) => void;
}

export default function ForumMessageItem({ message, mine, busy, onDelete }: Props) {
  return (
    <li data-message-id={message.messageId} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <article className={`min-w-0 max-w-full rounded-2xl p-4 border ${mine ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
        <header className="flex flex-wrap items-center gap-2 text-xs mb-2">
          <span className="font-bold">{message.authorName}{mine ? ' (나)' : ''}</span>
          <time dateTime={message.createdAt} className="text-gray-500 dark:text-gray-400">{message.createdAt.replace('T', ' ').slice(0, 16)}</time>
          {mine && <button type="button" disabled={busy} onClick={() => onDelete(message)} aria-label={`${message.authorName}의 메시지 삭제`} className="text-gray-500 hover:text-rose-600 underline disabled:opacity-50">삭제</button>}
        </header>
        {/* 서버 본문을 텍스트 노드로 출력해 HTML 실행을 방지합니다. */}
        <p className="whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed">{message.content}</p>
      </article>
    </li>
  );
}
