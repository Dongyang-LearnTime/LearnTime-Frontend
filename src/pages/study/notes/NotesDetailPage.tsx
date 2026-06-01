import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudyNoteDetailApi, deleteStudyNoteApi } from '../api/studyNotesApi';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import { formatDateUtil } from '../../../utils/formatDateUtil';
import '../../../styles/NotesEditor.css';
import DOMPurify from 'dompurify';
import { generateQuizApi } from '../api/studyQuizApi';

import type { StudyNoteDetail } from '../api/studyNotesApi';

export default function NotesDetailPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  
  const [ noteDetail, setNoteDetail ] = useState<StudyNoteDetail | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  
  const [ isGeneratingQuiz, setIsGeneratingQuiz ] = useState<boolean>(false);
  const [ quizError, setQuizError ] = useState<string>('');

  // 페이지 제목 변경
  usePageTitle("learn-time | 필기 상세 보기");

  useEffect(() => {
    const fetchNoteDetail = async () => {
      if (!noteId) return;
      setIsLoading(true);
      try {
        const data = await getStudyNoteDetailApi(noteId);
        setNoteDetail(data);
      } catch (err) {
        const errorMessage = getApiErrorUtil(err);
        alert(errorMessage);
        navigate(-1); // 이전 페이지로
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoteDetail();
  }, [noteId]);

  const fetchDeleteNote = async () => {
    if (!noteId) return;

    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await deleteStudyNoteApi(noteId);
      alert('삭제 완료');
      navigate(`/`); // 임시 링크
    } catch (error: unknown) {
      throw new Error(getApiErrorUtil(error)); // NotesEditor에 예외 던짐 -> 에러메세지 출력
    }
  };

  const fetchQuizCreate = async () => {
    if (!noteId || !noteDetail) return;
    
    try {
      setIsGeneratingQuiz(true);
      setQuizError('');
      const quizId = await generateQuizApi(noteDetail.studyId, noteDetail.studyNotesId);
      alert('퀴즈 생성이 완료되었습니다.');
      navigate(`/study/quiz/${quizId}`);
    } catch (err) {
      const errorMessage = getApiErrorUtil(err);
      setQuizError(errorMessage);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-bold text-gray-500 animate-pulse">
        로딩 중...
      </div>
    );
  }

  if (!noteDetail) return <div>필기 데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 font-sans">
      <article className="bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-10 transition-colors duration-300">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {noteDetail.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                생성일: {formatDateUtil(noteDetail.createdAt)}
              </span>
              {noteDetail.updatedAt && noteDetail.updatedAt !== noteDetail.createdAt && (
                <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full">
                  수정일: {formatDateUtil(noteDetail.updatedAt)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-2">
            <div className="flex gap-2">
              <button
                className="px-5 py-2.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm"
                onClick={() => navigate(`/study/notes/edit/${noteId}`)}
              >
                수정
              </button>

              <button
                className="px-5 py-2.5 bg-white dark:bg-[#222] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                onClick={fetchDeleteNote}
              >
                삭제
              </button>

              <button
                className={`px-5 sm:px-6 py-2.5 sm:py-3 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center min-w-[100px] shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 bg-linear-to-r from-violet-500 to-indigo-500
                  ${isGeneratingQuiz ? 'opacity-70 cursor-wait' : 'hover:from-violet-600 hover:to-indigo-600 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}`}
                onClick={fetchQuizCreate}
                disabled={isGeneratingQuiz}
              >
                {isGeneratingQuiz ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    생성 중...
                  </>
                ) : (
                  '퀴즈 생성'
                )}
              </button>
            </div>
            {quizError && (
              <p className="text-xs text-red-500 font-medium">
                {quizError}
              </p>
            )}
          </div>
        </header>

        {/* 본문 렌더링 영역 */}
        <section 
          className="prose prose-slate dark:prose-invert max-w-none tiptap-editor mt-8 min-h-[300px]" 
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(noteDetail.content) }} 
        />
      </article>
    </div>
  );
}
