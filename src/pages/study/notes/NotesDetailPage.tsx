import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudyNoteDetailApi, deleteStudyNoteApi } from '../api/StudyNotesApi';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import { formatDateUtil } from '../../../utils/formatDateUtil';
import '../../../styles/NotesEditor.css';
import DOMPurify from 'dompurify';
import { generateQuizApi } from '../api/StudyQuizApi';

import type { StudyNoteDetail } from '../api/StudyNotesApi';

export default function NotesDetailPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  
  const [ noteDetail, setNoteDetail ] = useState<StudyNoteDetail | null>(null);
  
  const [ isGeneratingQuiz, setIsGeneratingQuiz ] = useState<boolean>(false);
  const [ quizError, setQuizError ] = useState<string>('');

  // 페이지 제목 변경
  usePageTitle("learn-time | 필기 상세 보기");

  useEffect(() => {
    const fetchNoteDetail = async () => {
      if (!noteId) return;
      
      try {
        const data = await getStudyNoteDetailApi(noteId);
        setNoteDetail(data);
      } catch (err) {
        const errorMessage = getApiErrorUtil(err);
        alert(errorMessage);
        navigate(-1); // 이전 페이지로
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


  if (!noteDetail) return <div>필기 데이터를 찾을 수 없습니다.</div>;

  return (
    <article>
      <header>
        <h1>{noteDetail.title}</h1>
        <div className="flex flex-col gap-1 mt-2 text-sm text-slate-500">
          <span>생성: {formatDateUtil(noteDetail.createdAt)}</span>
          {noteDetail.updatedAt && noteDetail.updatedAt !== noteDetail.createdAt && (
            <span>수정: {formatDateUtil(noteDetail.updatedAt)}</span>
          )}
        </div>

        <div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
              onClick={() => navigate(`/study/notes/edit/${noteId}`)}
            >
              수정
            </button>

            <button
              className="px-3 py-1.5 bg-white border border-slate-300 text-red-600 text-sm rounded hover:bg-red-50 transition-colors"
              onClick={() => fetchDeleteNote()}
            >
              삭제
            </button>

            <button
              className="px-3 py-1.5 bg-white border border-slate-300 text-indigo-600 text-sm rounded hover:bg-indigo-50 transition-colors flex items-center justify-center min-w-[80px] disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={fetchQuizCreate}
              disabled={isGeneratingQuiz}
            >
              {isGeneratingQuiz ? <Loader2 className="animate-spin w-4 h-4" /> : '퀴즈 생성'}
            </button>
          </div>
          {quizError && (
            <p className="text-xs sm:text-sm text-red-500 font-medium mt-2">
              {quizError}
            </p>
          )}
        </div>
      </header>

      <hr />

      {/* Tiptap에서 작성된 HTML 콘텐츠를 렌더링하기 위해 dangerouslySetInnerHTML 사용 */}
      <section 
        className="prose prose-slate max-w-none tiptap-editor mt-6" 
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(noteDetail.content) }} 
      />
    </article>
  );
}
