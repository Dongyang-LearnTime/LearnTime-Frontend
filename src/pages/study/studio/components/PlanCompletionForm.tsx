import React, { useState } from "react";
import type { CompletionStatus } from "../../../../types/studyEnums";
import { completeStudyDailyPlanApi } from "../../api/studyStudioApi";
import { getApiErrorUtil } from "../../../../utils/getApiErrorUtil";

interface PlanCompletionFormProps {
  /** 공부 진도 ID */
  studyDailyPlanId: number;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 진도 완료 성공 시 콜백 */
  onCompleteSuccess: () => void;
  /** 폼 내부에서 상위 모달의 닫기 가능 여부 제어를 위한 콜백 */
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

/**
 * 일일 공부 진도 완료를 처리하는 폼 컴포넌트입니다.
 * 비즈니스 로직(이정도 점수, 성공/실패 여부 선택 및 API 전송)을 내장합니다.
 */
export default function PlanCompletionForm({
  studyDailyPlanId,
  onClose,
  onCompleteSuccess,
  onSubmittingChange,
}: PlanCompletionFormProps) {
  const [status, setStatus] = useState<CompletionStatus>("SUCCESS");
  const [score, setScore] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 제출 처리 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    onSubmittingChange?.(true);

    try {
      // API 전송
      const resultMsg = await completeStudyDailyPlanApi({
        studyDailyPlanId,
        completionStatus: status,
        understandingScore: score,
      });

      setSuccessMessage(resultMsg || "공부 완료 처리가 되었습니다.");
      
      // 2초 대기 후 성공 핸들러 호출 및 닫기
      setTimeout(() => {
        onCompleteSuccess();
        onClose();
        onSubmittingChange?.(false);
      }, 2000);
    } catch (err: unknown) {
      setError(getApiErrorUtil(err) || "공부 완료 처리 중 오류가 발생했습니다.");
      setIsLoading(false);
      onSubmittingChange?.(false);
    }
  };

  // 성공 처리 시 포인트 지급 완료 화면 노출
  if (successMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center" id="completion-success-container">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1" id="completion-success-title">완료되었습니다!</h3>
        <p className="text-sm text-gray-600" id="completion-success-message">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-2" id="plan-completion-form">
      <div>
        <h2 className="text-xl font-bold text-gray-900" id="form-title">오늘 공부 완료</h2>
        <p className="text-sm text-gray-500 mt-1" id="form-description">오늘의 공부 결과를 기록하고 완료 처리합니다.</p>
      </div>

      {/* 성공/실패 여부 선택 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">목표 완료 여부</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStatus("SUCCESS")}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
              status === "SUCCESS"
                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            id="status-success-button"
          >
            성공
          </button>
          <button
            type="button"
            onClick={() => setStatus("FAILURE")}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
              status === "FAILURE"
                ? "bg-rose-50 border-rose-500 text-rose-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            id="status-failure-button"
          >
            실패
          </button>
        </div>
      </div>

      {/* 이해도 별점 선택 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">오늘의 이해도</label>
        <div className="flex gap-2 items-center justify-center py-2" id="star-rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setScore(star)}
              disabled={isLoading}
              className="text-amber-400 hover:scale-110 transition-transform focus:outline-none"
              aria-label={`이해도 ${star}점`}
              id={`star-${star}-button`}
            >
              <svg
                className="w-8 h-8"
                fill={star <= score ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.178 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z"
                />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">{score}점 / 5점</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-rose-600 font-medium text-center" id="error-message">
          {error}
        </p>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        id="submit-completion-button"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            처리 중...
          </>
        ) : (
          "기록 완료하기"
        )}
      </button>
    </form>
  );
}
