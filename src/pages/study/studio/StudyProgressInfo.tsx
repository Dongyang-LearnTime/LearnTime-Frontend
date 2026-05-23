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
    <Card className="flex flex-col h-full relative overflow-hidden group min-h-[300px]">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <CardTitle icon={<BookIcon size={18} />} className="mb-0">일일 진도 정보</CardTitle>

        {/* 날짜 선택 내비게이션 */}
        <div className="flex items-center bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-1 shadow-sm">
          <button onClick={() => handleDateChange(-1)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">이전날</button>
          <span className="px-3 py-1.5 text-sm font-black tracking-tight text-gray-900 dark:text-white border-x border-gray-200 dark:border-[#222]">
            {planDate}
          </span>
          <button onClick={() => handleDateChange(1)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">다음날</button>
          <button onClick={() => setSearchParams({ date: getTodayString() })} className="px-3 py-1.5 ml-1 text-xs font-black bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">오늘</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
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
            <div className="flex-1 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-3xl p-6 mb-6">
              <DailyProgress data={progressData} />
            </div>
            
            {progressData.studyDailyPlanId && (
              <div className="flex justify-end mt-auto pt-4 border-t border-gray-100 dark:border-[#1a1a1a]">
                {progressData.progressStatus === "NOT_STARTED" && (
                  <button
                    onClick={handleStartPlan}
                    disabled={isStarting}
                    className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all ${isStarting ? "opacity-70 cursor-not-allowed" : "active:scale-95"}`}
                  >
                    {isStarting ? "시작 중..." : "일일 진도 시작"}
                  </button>
                )}

                {progressData.progressStatus === "IN_PROGRESS" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    일일 진도 완료
                  </button>
                )}

                {progressData.progressStatus === "COMPLETED" && (
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-gray-500 font-bold rounded-2xl cursor-not-allowed"
                  >
                    진도 완료됨
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-3xl">
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
