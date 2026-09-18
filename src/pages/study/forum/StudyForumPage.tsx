import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useAuthStore } from '../../../store/useAuthStore';
import type { StudyForumMessage } from '../types/StudyForumTypes';
import { useStudyForum } from './hooks/useStudyForum';
import ForumComposer from './components/ForumComposer';
import ForumMessageList from './components/ForumMessageList';

export default function StudyForumPage() {
  usePageTitle('스터디 토론방');
  const { studyId } = useParams<{ studyId: string }>();
  const userId = useAuthStore(state => state.userId);
  const id = Number(studyId);
  if (!studyId || !/^\d+$/.test(studyId) || !Number.isSafeInteger(id) || id <= 0) {
    return <p role="alert">유효하지 않은 스터디 주소입니다. <Link to="/study" className="underline">내 스터디로 이동</Link></p>;
  }
  // 사용자나 스터디가 바뀌면 이전 대화와 입력값을 함께 폐기합니다.
  return <ForumRoom key={`${userId}:${id}`} studyId={id} userId={userId === null ? null : Number(userId)} />;
}

function ForumRoom({ studyId, userId }: { studyId: number; userId: number | null }) {
  const forum = useStudyForum(studyId);
  const [deleting, setDeleting] = useState<StudyForumMessage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = forum.operation !== null;

  useEffect(() => {
    if (deleting && !forum.denied) dialog.current?.showModal();
    else dialog.current?.close();
  }, [deleting, forum.denied]);

  return (
    <section aria-labelledby="forum-title" className="w-full max-w-7xl mx-auto py-2 text-gray-900 dark:text-gray-100">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{forum.membership?.studyTitle ?? '스터디'}</p>
          <h1 id="forum-title" className="text-3xl font-black">토론방</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">학습한 내용과 궁금한 점을 함께 나누세요.</p>
        </div>
        {!forum.denied && <button type="button" disabled={busy} onClick={() => void forum.refresh()} className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 disabled:opacity-50">{forum.operation === 'refresh' ? '불러오는 중…' : '새로고침'}</button>}
      </header>
      {forum.error && <p role="alert" className="p-4 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300">{forum.error}</p>}
      {forum.denied ? (
        <div role="status" className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5">
          <p>이 토론방은 활동 중이거나 수료한 스터디 멤버만 이용할 수 있습니다.</p>
          <Link to="/mypage" className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 underline">내 스터디 기록으로 이동</Link>
        </div>
      ) : forum.loading ? <p role="status" className="p-6">토론방을 불러오는 중입니다…</p> : forum.membership && (
        <div className="flex flex-col h-[70dvh] min-h-96 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm">
          <ForumMessageList messages={forum.page.content} userId={userId} busy={busy} hasNext={forum.page.hasNext} onOlder={forum.loadOlder} onDelete={setDeleting} />
          {(forum.membership.status === 'ACTIVE' || forum.membership.myStatus === 'ACTIVE') ? <ForumComposer busy={busy} sending={forum.operation === 'send'} onSend={async content => {
            const sent = await forum.send(content);
            if (sent) void forum.refresh();
            return sent;
          }} /> : <p role="status" className="p-4 border-t border-gray-100 dark:border-white/5 text-sm text-gray-500 dark:text-gray-400">수료한 스터디는 읽기 전용입니다. 본인이 작성한 메시지는 삭제할 수 있습니다.</p>}
        </div>
      )}
      <dialog ref={dialog} onCancel={event => { if (forum.operation === 'delete') event.preventDefault(); else setDeleting(null); }} onClose={() => setDeleting(null)} aria-labelledby="forum-delete-title" aria-describedby="forum-delete-description"
        className="m-auto w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 backdrop:bg-black/40">
        <h2 id="forum-delete-title" className="text-lg font-bold">메시지를 삭제하시겠습니까?</h2>
        <p id="forum-delete-description" className="text-sm text-gray-500 dark:text-gray-400 mt-2">삭제한 메시지는 복구할 수 없습니다.</p>
        <p className="text-sm whitespace-pre-wrap wrap-anywhere max-h-40 overflow-auto mt-4">{deleting?.content}</p>
        {forum.error && <p role="alert" className="text-sm text-rose-600 mt-2">{forum.error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" autoFocus disabled={forum.operation === 'delete'} onClick={() => setDeleting(null)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10">취소</button>
          <button type="button" disabled={busy} onClick={async () => { if (deleting && await forum.remove(deleting.messageId)) setDeleting(null); }} className="px-4 py-2 rounded-xl bg-rose-600 text-white disabled:opacity-50">{forum.operation === 'delete' ? '삭제 중…' : '삭제'}</button>
        </div>
      </dialog>
    </section>
  );
}
