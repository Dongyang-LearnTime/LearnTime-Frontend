import { useParams, useNavigate } from 'react-router-dom';
import ListContainer from '../../../components/common/ListContainer';
import ListItemCard from '../../../components/common/ListItemCard';
import Pagination from '../../../components/common/Pagination';
import { usePaginationFetch } from '../../../hooks/usePaginationFetch';
import { getStudyQuizList } from '../api/studyQuizApi';
import type { StudyQuizInfoResponse } from '../types/studyQuizTypes';
import { usePageTitle } from '../../../hooks/usePageTitle';

export default function StudyQuizListPage() {
  usePageTitle('learn-time | 퀴즈 목록');
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const { data, page, totalPages, isLoading, error, changePage } = usePaginationFetch<StudyQuizInfoResponse>({
    fetchData: (targetPage) => getStudyQuizList(Number(studyId), targetPage),
  });

  const handleQuizClick = (quizId: number) => {
    // 퀴즈 상세 또는 퀴즈 풀이 화면으로 이동
    navigate(`/study/quiz/${quizId}`);
  };

  const getStatusText = (status: string) => {
    if (status === 'COMPLETED') return '완료';
    if (status === 'PENDING') return '대기중';
    if (status === 'NOT_STARTED') return '미완료';
    if (status === 'IN_PROGRESS') return '진행중';
    return status;
  };

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'emerald';
    if (status === 'PENDING') return 'amber';
    if (status === 'NOT_STARTED') return 'gray';
    if (status === 'IN_PROGRESS') return 'indigo';
    return 'gray';
  };

  return (
    <ListContainer 
      title="퀴즈 목록" 
      isLoading={isLoading} 
      error={error}
      bottomElement={
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={changePage} 
        />
      }
    >
      {data.length === 0 && !isLoading && !error ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
          생성된 퀴즈가 없습니다.
        </div>
      ) : (
        data.map((quiz) => (
          <ListItemCard 
            key={quiz.studyQuizId} 
            title={quiz.quizTitle}
            date={quiz.createdAt}
            statusText={getStatusText(quiz.quizStatus)}
            statusColor={getStatusColor(quiz.quizStatus)}
            content={`완료 횟수: ${quiz.completedCount}회`}
            onClick={() => handleQuizClick(quiz.studyQuizId)} 
          />
        ))
      )}
    </ListContainer>
  );
}
