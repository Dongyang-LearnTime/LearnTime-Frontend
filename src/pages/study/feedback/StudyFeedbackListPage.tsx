import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ListContainer from '../../../components/common/ListContainer';
import ListItemCard from '../../../components/common/ListItemCard';
import Pagination from '../../../components/common/Pagination';
import { usePaginationFetch } from '../../../hooks/usePaginationFetch';
import { getStudyFeedbackList, generateStudyFeedback } from '../api/StudyFeedbackApi';
import type { StudyFeedbackResponse } from '../types/StudyFeedBackTypes';
import FeedbackDetailDrawer from './components/FeedbackDetailDrawer';

export default function StudyFeedbackListPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // usePaginationFetch 훅을 사용해 피드백 목록 페이징 처리 및 리프레시 획득
  const { data, page, totalPages, isLoading, error, changePage, refresh } = usePaginationFetch<StudyFeedbackResponse>({
    fetchData: (targetPage) => getStudyFeedbackList(Number(studyId), targetPage),
  });

  // 피드백 카드 클릭 시 드로어 오픈
  const handleFeedbackClick = (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId);
    setIsDrawerOpen(true);
  };

  // AI 피드백 생성 요청 처리
  const handleCreateFeedback = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const newFeedback = await generateStudyFeedback(Number(studyId));
      alert('AI 피드백이 생성되었습니다.');
      // 목록을 리프레시하여 새 아이템 노출
      refresh();
      // 생성 완료된 피드백의 상세 드로어를 바로 노출
      setSelectedFeedbackId(newFeedback.feedbackId);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error('Failed to generate AI feedback:', err);
      alert('AI 피드백 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 현재 열린 피드백의 상세 데이터 매핑
  const selectedFeedback = data.find((f) => f.feedbackId === selectedFeedbackId) || null;

  return (
    <ListContainer 
      title="AI 피드백 목록" 
      isLoading={isLoading || isGenerating} 
      error={error}
      actionButton={
        <button
          onClick={handleCreateFeedback}
          disabled={isGenerating}
          className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              생성 중...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              새 피드백 생성
            </>
          )}
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
          수신된 피드백이 없습니다.
        </div>
      ) : (
        data.map((feedback) => (
          <ListItemCard 
            key={feedback.feedbackId} 
            title={feedback.feedbackTitle}
            date={feedback.createdAt}
            onClick={() => handleFeedbackClick(feedback.feedbackId)} 
          />
        ))
      )}

      {/* 우측 슬라이딩 피드백 상세 드로어 컴포넌트 */}
      <FeedbackDetailDrawer
        isOpen={isDrawerOpen}
        feedback={selectedFeedback}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedFeedbackId(null);
        }}
        onUpdateTitle={() => {
          refresh();
        }}
        onDelete={() => {
          refresh();
        }}
      />
    </ListContainer>
  );
}

