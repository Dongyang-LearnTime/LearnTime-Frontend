import { useParams, useNavigate } from 'react-router-dom';
import ListContainer from '../../../components/common/ListContainer';
import ListItemCard from '../../../components/common/ListItemCard';
import Pagination from '../../../components/common/Pagination';
import { usePaginationFetch } from '../../../hooks/usePaginationFetch';
import { getQuizHistoryList } from '../api/StudyQuizApi';
import type { QuizHistoryInfoResponse } from '../types/StudyQuizTypes';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { formatDateUtil } from '../../../utils/formatDateUtil';

export default function QuizHistoryListPage() {
  usePageTitle('learn-time | 퀴즈 풀이 이력');
  const { studyQuizId } = useParams<{ studyQuizId: string }>();
  const navigate = useNavigate();

  const { data, page, totalPages, isLoading, error, changePage } = usePaginationFetch<QuizHistoryInfoResponse>({
    fetchData: (targetPage) => getQuizHistoryList(Number(studyQuizId), targetPage),
  });

  const handleHistoryClick = (quizHistoryId: number) => {
    navigate(`/study/quiz/history/${quizHistoryId}`);
  };

  return (
    <ListContainer 
      title="이전 풀이 이력" 
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
          이전 풀이 이력이 없습니다.
        </div>
      ) : (
        data.map((history) => {
          const accuracy = history.totalQuestionCount > 0 
            ? Math.round((history.correctCount / history.totalQuestionCount) * 100) 
            : 0;
            
          const accuracyColor = accuracy >= 80 ? 'emerald' : accuracy >= 50 ? 'amber' : 'rose';

          return (
            <ListItemCard 
              key={history.quizHistoryId} 
              title={`${history.attemptNumber}회차 풀이`}
              date={formatDateUtil(history.submittedAt)}
              statusText={`${accuracy}% 정답률`}
              statusColor={accuracyColor}
              content={`정답: ${history.correctCount}/${history.totalQuestionCount} | 획득 포인트: +${history.earnedPoints}`}
              onClick={() => handleHistoryClick(history.quizHistoryId)} 
            />
          );
        })
      )}
    </ListContainer>
  );
}
