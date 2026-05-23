import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStudyPlanApi, startStudyDailyPlanApi } from "../api/StudyStudioApi";
import type { StudyPlanResponse } from "../types/StudyTypes";
import DailyProgress from "./components/DailyProgress";
import BaseModal from "../../../components/common/BaseModal";
import PlanCompletionForm from "./components/PlanCompletionForm";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";
import { Card, CardTitle } from "../../../components/common/Card";
import { BookIcon } from "../../../components/ui/Icons";

interface StudyProgressInfoProps {
  studyId: string;
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 구하는 헬퍼 함수
const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function StudyProgressInfo({ studyId }: StudyProgressInfoProps) {
  // 쿼리 파라미터 연동
  const [searchParams, setSearchParams] = useSearchParams();
  const planDate = searchParams.get("date") || getTodayString();

  // 일일 진도 정보 상태 관리
  const [progressData, setProgressData] = useState<StudyPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // planDate 변경에 따른 API 호출
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getStudyPlanApi(studyId, planDate)
      .then((data) => {
        if (isMounted) {
          setProgressData(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load daily study plan:", err);
          setError("일일 공부 진도 정보를 불러오는 데 실패했습니다.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studyId, planDate]);

  // 날짜 하루씩 이동 핸들러
  const handleDateChange = (daysToAdd: number) => {
    const current = new Date(planDate);
    current.setDate(current.getDate() + daysToAdd);

    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    const newDateStr = `${yyyy}-${mm}-${dd}`;

    setSearchParams({ date: newDateStr });
  };

  const handleStartPlan = async () => {
    if (!progressData || !progressData.studyDailyPlanId) return;
    setIsStarting(true);
    try {
      await startStudyDailyPlanApi(progressData.studyDailyPlanId);
      setProgressData((prev) => prev ? { ...prev, progressStatus: "IN_PROGRESS" } : null);
    } catch (err) {
      alert(getApiErrorUtil(err) || "진도 시작에 실패했습니다.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteSuccess = () => {
    setProgressData((prev) => prev ? { ...prev, progressStatus: "COMPLETED" } : null);
  };

  return (
    <Card className="flex flex-col h-full relative overflow-hidden group min-h-75 border-0 shadow-none bg-transparent">      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <CardTitle icon={<BookIcon size={18} />} className="mb-0">일일 진도 정보</CardTitle>

        {/* 모던 날짜 선택 내비게이션 (Pill 디자인) */}
        <div className="flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-full p-1 shadow-sm">
          <button 
            onClick={() => handleDateChange(-1)} 
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
            title="이전날"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="px-4 text-sm font-black tracking-tight text-gray-900 dark:text-white min-w-27.5 text-center">
            {planDate}
          </div>
          
          <button 
            onClick={() => handleDateChange(1)} 
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all mr-2"
            title="다음날"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          
          <button 
            onClick={() => setSearchParams({ date: getTodayString() })} 
            className="px-3 py-1.5 text-xs font-black bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            오늘
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {isLoading ? (
          <div className="flex flex-col gap-4 py-4 animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-[#1a1a1a] rounded-lg"></div>
            <div className="h-4 w-1/2 bg-gray-100 dark:bg-[#111] rounded-lg"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl mt-4"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-3xl">
            <p className="text-sm font-bold text-rose-500">{error}</p>
          </div>
        ) : progressData ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-3xl p-6 mb-6 shadow-sm">
              <DailyProgress data={progressData} />
            </div>
            
            {progressData.studyDailyPlanId && (
              <div className="flex justify-end mt-auto pt-4 border-t border-gray-100 dark:border-[#1a1a1a]">
                {progressData.progressStatus === "NOT_STARTED" && (
                  <button
                    onClick={handleStartPlan}
                    disabled={isStarting}
                    className={`px-8 py-3 bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-black rounded-2xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 ${isStarting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 active:scale-95"}`}
                  >
                    {isStarting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        시작 중...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        일일 진도 시작
                      </>
                    )}
                  </button>
                )}

                {progressData.progressStatus === "IN_PROGRESS" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-2xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    일일 진도 완료하기
                  </button>
                )}

                {progressData.progressStatus === "COMPLETED" && (
                  <div className="px-8 py-3 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] text-gray-400 font-black rounded-2xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    모든 진도 완료됨
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-3xl shadow-sm">
            <p className="text-sm font-bold text-gray-400">해당 일자의 진도 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {progressData?.studyDailyPlanId && (
        <BaseModal 
          isOpen={isModalOpen}
          onClose={() => !isSubmitting && setIsModalOpen(false)}
          showCloseButton={!isSubmitting}
        >
          <PlanCompletionForm
            studyDailyPlanId={progressData.studyDailyPlanId}
            onClose={() => setIsModalOpen(false)}
            onCompleteSuccess={handleCompleteSuccess}
            onSubmittingChange={setIsSubmitting}
          />
        </BaseModal>
      )}
    </Card>
  );
}
