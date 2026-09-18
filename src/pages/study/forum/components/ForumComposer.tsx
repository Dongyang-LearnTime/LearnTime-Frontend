import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  busy: boolean;
  sending: boolean;
  onSend: (content: string) => Promise<boolean>;
}

export default function ForumComposer({ busy, sending, onSend }: Props) {
  const [content, setContent] = useState('');
  const submitting = useRef(false);
  const valid = content.trim().length > 0 && content.length <= 1000;
  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (busy || submitting.current || !valid) return;
    submitting.current = true;
    const submitted = content;
    try {
      if (await onSend(submitted)) setContent('');
    } finally {
      submitting.current = false;
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-gray-100 dark:border-white/5 p-4 bg-white dark:bg-[#111] rounded-b-2xl">
      <label htmlFor="forum-content" className="block text-sm font-bold mb-2">메시지 작성</label>
      <textarea id="forum-content" value={content} rows={3} maxLength={1000} disabled={sending}
        onChange={event => setContent(event.target.value)}
        onKeyDown={event => {
          // 한국어 IME 확정용 Enter는 전송 키로 취급하지 않습니다.
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
            event.preventDefault();
            void submit();
          }
        }}
        aria-describedby="forum-input-help"
        placeholder="학습한 내용이나 궁금한 점을 나눠 보세요."
        className="w-full resize-y rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 text-sm focus:outline-indigo-500 disabled:opacity-60" />
      <div className="flex items-center justify-between gap-3 mt-2">
        <p id="forum-input-help" className="text-xs text-gray-500 dark:text-gray-400">Enter 전송 · Shift+Enter 줄바꿈 · {content.length}/1,000</p>
        <button type="submit" disabled={busy || !valid} className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">
          {sending ? '전송 중…' : '전송'}
        </button>
      </div>
    </form>
  );
}
