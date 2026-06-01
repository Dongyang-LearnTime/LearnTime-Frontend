import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { StudyFeedbackResponse } from '../../types/studyFeedBackTypes';
import { updateFeedbackTitle, deleteFeedback } from '../../api/studyFeedbackApi';


interface FeedbackDetailDrawerProps {
  isOpen: boolean;
  feedback: StudyFeedbackResponse | null;
  onClose: () => void;
  onUpdateTitle: (feedbackId: number, newTitle: string) => void;
  onDelete: (feedbackId: number) => void;
}

export default function FeedbackDetailDrawer({
  isOpen,
  feedback,
  onClose,
  onUpdateTitle,
  onDelete,
}: FeedbackDetailDrawerProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 피드백 데이터가 변경되면 수정용 타이틀 인풋값을 동기화
  useEffect(() => {
    if (feedback) {
      setEditTitleValue(feedback.feedbackTitle);
    }
    setIsEditingTitle(false);
  }, [feedback]);

  if (!isOpen || !feedback) return null;

  // 제목 수정 API 요청 처리
  const handleSaveTitle = async () => {
    if (!editTitleValue.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (editTitleValue === feedback.feedbackTitle) {
      setIsEditingTitle(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // DTO 접미사 제외한 요청 구조 전달
      await updateFeedbackTitle({
        feedbackId: feedback.feedbackId,
        feedbackTitle: editTitleValue.trim(),
      });
      onUpdateTitle(feedback.feedbackId, editTitleValue.trim());
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Failed to update feedback title:', error);
      alert('제목 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 피드백 삭제 API 요청 처리
  const handleDeleteFeedback = async () => {
    if (!window.confirm('정말로 이 AI 피드백 기록을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFeedback(feedback.feedbackId);
      onDelete(feedback.feedbackId);
      onClose();
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('피드백 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* 백드롭 오버레이 (클릭 시 닫힘) */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 우측 슬라이드 패널 */}
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#121212] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-[#222222]">
        
        {/* 상단 헤더 영역 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#222222]">
          <div className="flex-1 mr-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editTitleValue}
                  onChange={(e) => setEditTitleValue(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-lg font-bold border border-gray-200 dark:border-[#333333] rounded-xl bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={150}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleSaveTitle}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? '저장중' : '저장'}
                </button>
                <button
                  onClick={() => {
                    setEditTitleValue(feedback.feedbackTitle);
                    setIsEditingTitle(false);
                  }}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {feedback.feedbackTitle}
                </h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                  title="제목 수정"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              작성일: {new Date(feedback.createdAt).toLocaleString()}
            </p>
          </div>
          
          {/* 드로어 닫기 버튼 */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">AI 학습 피드백 가이드</h4>
              <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                해당 스터디 세션의 최근 학습 기록을 바탕으로 분석된 맞춤 피드백입니다. 취약점을 보완하는 가이드로 활용해보세요.
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            <ReactMarkdown>
              {feedback.feedbackContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* 하단 푸터 영역 (삭제 등 제어 버튼) */}
        <div className="p-6 border-t border-gray-100 dark:border-[#222222] bg-gray-50 dark:bg-[#151515] flex justify-between items-center">
          <button
            onClick={handleDeleteFeedback}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            피드백 기록 삭제
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222222] rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
