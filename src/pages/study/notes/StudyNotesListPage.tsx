import { useParams, useNavigate } from 'react-router-dom';
import ListContainer from '../../../components/common/ListContainer';
import ListItemCard from '../../../components/common/ListItemCard';
import Pagination from '../../../components/common/Pagination';
import { usePaginationFetch } from '../../../hooks/usePaginationFetch';
import { getStudyNotesList} from '../api/studyNotesApi';
import type { StudyNotesResponse } from '../types/StudyNoteTypes';
import { usePageTitle } from '../../../hooks/usePageTitle';

export default function StudyNotesListPage() {
  usePageTitle('필기 목록');
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const { data, page, totalPages, isLoading, error, changePage } = usePaginationFetch<StudyNotesResponse>({
    fetchData: (targetPage) => getStudyNotesList(Number(studyId), targetPage),
  });

  const handleNoteClick = (noteId: number) => {
    navigate(`/study/notes/${noteId}`);
  };

  return (
    <ListContainer 
      title="내 필기 목록" 
      isLoading={isLoading} 
      error={error}
      actionButton={
        <button
          onClick={() => navigate(`/study/notes/write/${studyId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
        >
          필기 작성
        </button>
      }
      bottomElement={
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={changePage} 
        />
      }
    >
      {data.length === 0 && !isLoading && !error ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
          작성된 필기가 없습니다.
        </div>
      ) : (
        data.map((note) => (
          <ListItemCard 
            key={note.studyNotesId} 
            title={note.title}
            date={note.createdAt}
            onClick={() => handleNoteClick(note.studyNotesId)} 
          />
        ))
      )}
    </ListContainer>
  );
}
