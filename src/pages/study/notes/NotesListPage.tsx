import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudyNoteListApi, type StudyNoteListItem } from '../api/studyNotesApi';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { formatDateUtil } from '../../../utils/formatDateUtil';
import { NoteIcon, PlusIcon } from '../../../components/ui/Icons';

export default function NotesListPage() {
  usePageTitle('learn-time | 필기 목록');
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<StudyNoteListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studyId) return;
    let isMounted = true;
    setIsLoading(true);
    getStudyNoteListApi(studyId)
      .then((data) => {
        if (isMounted) setNotes(data);
      })
      .catch(() => {
        if (isMounted) setError('필기 목록을 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, [studyId]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6 text-gray-900 dark:text-white">
            필기 목록
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium ml-2">
            작성한 필기를 조회하고 퀴즈를 생성하세요.
          </p>
        </div>
        <button
          onClick={() => navigate(`/study/notes/write/${studyId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl font-bold text-sm hover:border-indigo-500 transition-all shadow-sm cursor-pointer text-gray-800 dark:text-gray-200 shrink-0"
        >
          <PlusIcon size={16} /> 새 필기 작성
        </button>
      </header>

      {/* 본문 */}
      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-[#1a1a1a]" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-500 font-bold text-sm">{error}</div>
      ) : notes.length === 0 ? (
        /* 빈 화면 */
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-dashed border-gray-200 dark:border-[#222] text-center px-4">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-5 text-indigo-400">
            <NoteIcon size={36} />
          </div>
          <h2 className="text-xl font-black mb-2 text-gray-800 dark:text-gray-200">아직 작성된 필기가 없습니다.</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">필기를 작성하면 AI가 자동으로 퀴즈를 생성해 드립니다.</p>
          <button
            onClick={() => navigate(`/study/notes/write/${studyId}`)}
            className="flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-base hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer"
          >
            <PlusIcon size={18} /> 필기 작성하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <button
              key={note.studyNotesId}
              onClick={() => navigate(`/study/notes/${note.studyNotesId}`)}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-[#1a1a1a] hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                  <NoteIcon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{note.title}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">작성일: {formatDateUtil(note.createdAt)}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">보기 →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
