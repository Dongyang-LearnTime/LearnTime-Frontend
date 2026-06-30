import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NotesEditor } from './tiptap/NotesEditor';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { getStudyNoteDetailApi, updateStudyNoteApi } from '../api/studyNotesApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import { toast } from '../../../utils/toast';

export default function NotesEditPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();

  const [initialTitle, setInitialTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 제목 변경
  usePageTitle("learn-time | 필기 수정");

  // 수정 페이지 진입 시 기존 데이터 불러오기
  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;
      try {
        const data = await getStudyNoteDetailApi(noteId);
        setInitialTitle(data.title || '');
        setInitialContent(data.content || '');
      } catch (error) {
        toast.error('노트 정보를 불러오는데 실패했습니다.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [noteId, navigate]);

  const handleEditSubmit = async (title: string, content: string) => {
    if (!noteId) return;
    try {
      await updateStudyNoteApi(noteId, { title, content });
      toast.success('수정 완료');
      // 수정 완료 후 상세 보기 페이지로 이동
      navigate(`/study/notes/${noteId}`);
    } catch (error: unknown) {
      throw new Error(getApiErrorUtil(error));  // NotesEditor에 예외 던짐 -> 에러메세지 출력
    }
  };

  if (isLoading) {
    // 임시 로딩 UI
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex justify-center items-center">
        <p className="text-slate-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <NotesEditor
      initialTitle={initialTitle}
      initialContent={initialContent}
      onSubmit={handleEditSubmit}
      submitButtonText="노트 수정"
    />
  );
}
