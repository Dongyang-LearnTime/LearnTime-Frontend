import { useParams, useNavigate } from 'react-router-dom';
import { submitStudyNotesApi } from '../api/StudyNotesApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import { NotesEditor } from './tiptap/NotesEditor';
import { usePageTitle } from '../../../hooks/usePageTitle';

export default function NotesWritePage() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  // 페이지 제목 변경
  usePageTitle("learn-time | 필기 작성");

  const handleCreateSubmit = async (title: string, content: string) => {
    try {
      const dataToSave = {
        studyId,
        title,
        content,
      };
      const noteId = await submitStudyNotesApi(dataToSave);
      alert('저장 완료');
      navigate(`/study/notes/${noteId}`);
    } catch (error: unknown) {
      throw new Error(getApiErrorUtil(error)); // NotesEditor에 예외 던짐 -> 에러메세지 출력
    }
  };

  return (
    <NotesEditor
      onSubmit={handleCreateSubmit}
      submitButtonText="노트 저장"
    />
  );
}
