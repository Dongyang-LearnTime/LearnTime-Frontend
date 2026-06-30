import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { generateStudyFeedback } from "../api/studyFeedbackApi";
import StudyLearningMetrics from "./StudyLearningMetrics";
import StudyProgressInfo from "./StudyProgressInfo";
import StudyMemberList from "./StudyMemberList";
import { SparklesIcon, PlayIcon, RocketIcon } from "../../../components/ui/Icons";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { 
  getStudyStudioSummaryApi,
  startStudyDailyPlanApi 
} from "../api/studyStudioApi";
import type { StudyPlanResponse, StudyStudioSummaryResponse } from "../types/StudyTypes";
import { useStopwatchStore } from "../../../store/useStopwatchStore";
import { FloatingStopwatch } from "./components/FloatingStopwatch";
import { toast } from '../../../utils/toast';

export default function StudyStudioPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studyTitle = searchParams.get("title");
  
  const [ activeTab, setActiveTab ] = useState<"metrics" | "progress" | "members">("metrics");
  const [ isGeneratingFeedback, setIsGeneratingFeedback ] = useState(false);

  // 오늘 날짜 기준의 진도 계획 정보 상태 관리
  const [todayPlan, setTodayPlan] = useState<StudyPlanResponse | null>(null);
  const [studioSummary, setStudioSummary] = useState<StudyStudioSummaryResponse | null>(null);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [isStartingToday, setIsStartingToday] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  usePageTitle(studyTitle ? `학습 스튜디오 - ${studyTitle}` : "학습 스튜디오");

  // 오늘 날짜를 YYYY-MM-DD 형식으로 구하는 헬퍼 함수
  const getTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 오늘의 공부 진도 정보 불러오기
  useEffect(() => {
    if (!studyId) return;
    let isMounted = true;
    setIsTodayLoading(true);

    getStudyStudioSummaryApi(studyId, getTodayString())
      .then((data) => {
        if (!isMounted) return;
        setStudioSummary(data);
        setTodayPlan(data.todayPlan);
        
        // 전역 스톱워치에 일일 계획 ID 및 상태 연동
        if (data.todayPlan && data.todayPlan.studyDailyPlanId) {
          useStopwatchStore.getState().setStudyDailyPlanId(data.todayPlan.studyDailyPlanId);
          useStopwatchStore.getState().setProgressStatus(data.todayPlan.progressStatus);
        } else {
          useStopwatchStore.getState().setStudyDailyPlanId(null);
          useStopwatchStore.getState().setProgressStatus(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) console.error("Failed to load study studio summary:", err);
      })
      .finally(() => {
        if (isMounted) setIsTodayLoading(false);
      });

    return () => { isMounted = false; };
  }, [studyId, refreshKey]);

  const handleGenerateFeedback = async () => {
    if (!studyId) return;
    try {
      setIsGeneratingFeedback(true);
      await generateStudyFeedback(Number(studyId));
      toast.success("AI 진도 분석(피드백) 생성이 완료되었습니다.");
      navigate(`/study/feedback/list/${studyId}`);
    } catch (error) {
      console.error(error);
      toast.error("AI 진도 분석 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  // 오늘의 공부 진도 시작
  const handleStartTodayPlan = async () => {
    if (!todayPlan || !todayPlan.studyDailyPlanId) return;
    setIsStartingToday(true);
    try {
      await startStudyDailyPlanApi(todayPlan.studyDailyPlanId);
      toast.info("오늘의 공부 진도를 시작합니다. 파이팅!");
      setRefreshKey(prev => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to start today's study plan:", err);
      toast.error("진도 시작에 실패했습니다.");
    } finally {
      setIsStartingToday(false);
    }
  };

  // 공부 내용 커뮤니티에 공유하기
  const handleShareStudy = () => {
    if (!studyId) return;
    const titleParam = studyTitle ? `&studyTitle=${encodeURIComponent(studyTitle)}` : "";
    navigate(`/community/post/create?studyId=${studyId}${titleParam}`);
  };

  if (!studyId) {
    return <div style={{ padding: "16px" }}>스터디 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      {/* 상단 헤더 영역 */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6 text-gray-900 dark:text-white">학습 스튜디오</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium ml-2 mb-8">AI와 함께하는 스마트한 학습 몰입 환경을 경험하세요.</p>
          {studyTitle && (
            <h2 className="ml-2 text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              {studyTitle}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* 오늘의 진도 시작/상태 버튼 */}
          {!isTodayLoading && todayPlan && todayPlan.studyDailyPlanId && (
            <>
              {todayPlan.progressStatus === "NOT_STARTED" && (
                <button
                  onClick={handleStartTodayPlan}
                  disabled={isStartingToday}
                  className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${isStartingToday ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <PlayIcon size={16} fill="white" /> 일일 진도 시작
                </button>
              )}
              {todayPlan.progressStatus === "IN_PROGRESS" && (
                <div className="px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-2xl font-bold text-sm flex items-center gap-1.5 shadow-xs select-none">
                  <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                  오늘 공부 진행 중
                </div>
              )}
              {todayPlan.progressStatus === "COMPLETED" && (
                <div className="px-5 sm:px-6 py-2.5 sm:py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 rounded-2xl font-bold text-sm flex items-center gap-1.5 shadow-xs select-none">
                  <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full"></span>
                  오늘 공부 완료됨
                </div>
              )}
            </>
          )}

          {/* 공부 공유 버튼 */}
          <button
            onClick={handleShareStudy}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <RocketIcon size={16} /> 공부 공유하기
          </button>

          {/* AI 진도 분석 버튼 */}
          <button
            onClick={handleGenerateFeedback}
            disabled={isGeneratingFeedback}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 ${isGeneratingFeedback ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isGeneratingFeedback ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                분석 중...
              </>
            ) : (
              <>
                <SparklesIcon size={16} /> AI 진도 분석
              </>
            )}
          </button>
        </div>
      </header>

      {/* 탭 헤더 영역 (Pill 디자인 적용) */}
      <div className="flex gap-2 mb-6 bg-gray-50/50 dark:bg-[#111] p-1.5 rounded-full w-fit border border-gray-100 dark:border-[#222]">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "metrics" 
              ? "bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200/50 dark:border-[#333]" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] border border-transparent"
          }`}
        >
          학습 지표
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "progress" 
              ? "bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200/50 dark:border-[#333]" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] border border-transparent"
          }`}
        >
          진도 정보
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "members" 
              ? "bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200/50 dark:border-[#333]" 
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] border border-transparent"
          }`}
        >
          맴버 목록
        </button>
      </div>

      {/* 탭 본문 영역 */}
      <div>
        {activeTab === "metrics" && <StudyLearningMetrics studyId={studyId} summary={studioSummary} isSummaryLoading={isTodayLoading} />}
        {activeTab === "progress" && (
          <StudyProgressInfo 
            studyId={studyId} 
            refreshTrigger={refreshKey} 
            onRefreshToday={() => setRefreshKey(prev => prev + 1)} 
          />
        )}
        {activeTab === "members" && <StudyMemberList studyId={studyId} />}
      </div>

      {/* 플로팅 스톱워치 */}
      <FloatingStopwatch />
    </div>
  );
}
