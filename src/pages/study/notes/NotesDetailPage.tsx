import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudyNoteDetailApi, deleteStudyNoteApi } from '../api/StudyNotesApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import '../../../styles/NotesEditor.css';
import DOMPurify from 'dompurify';

import type { StudyNoteDetail } from '../api/StudyNotesApi';

export default function NotesDetailPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  
  const [ noteDetail, setNoteDetail ] = useState<StudyNoteDetail | null>(null);
  const [ error, setError ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  useEffect(() => {
    const fetchNoteDetail = async () => {
      if (!noteId) return;
      
      try {
        setIsLoading(true);
        const data = await getStudyNoteDetailApi(noteId);
        setNoteDetail(data);
      } catch (err) {
        const errorMessage = getApiErrorUtil(err);
        setError(errorMessage);
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


  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!noteDetail) return <div>필기 데이터를 찾을 수 없습니다.</div>;

  return (
    <article>
      <header>
        <h1>{noteDetail.title}</h1>
        <div>
          <span>생성일: {noteDetail.createdAt}</span>
          <br />
          <span>수정일: {noteDetail.updatedAt}</span>
        </div>
        {/* <div>
          <span>공부필기 ID: {noteDetail.noteId}</span>
          <br />
          <span>공부 ID: {noteDetail.studyId}</span>
        </div> */}

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

          {/* 임시 */}
          <button
            className="px-3 py-1.5 bg-white border border-slate-300 text-indigo-600 text-sm rounded hover:bg-indigo-50 transition-colors"
            onClick={() => {}}
          >
            퀴즈 생성
          </button>

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
