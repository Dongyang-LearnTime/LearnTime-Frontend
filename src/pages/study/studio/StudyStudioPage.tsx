import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { generateStudyFeedback } from "../api/studyFeedbackApi";
import StudyLearningMetrics from "./StudyLearningMetrics";
import StudyProgressInfo from "./StudyProgressInfo";
import StudyMemberList from "./StudyMemberList";
import { PlayIcon, RocketIcon } from "../../../components/ui/Icons";
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
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isStartingToday, setIsStartingToday] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const moreActionsRef = useRef<HTMLDetailsElement>(null);
  const displayTitle = todayPlan?.studyTitle || studyTitle;

  // 기본 details 키보드 동작을 유지하면서 바깥 클릭과 Escape로 닫습니다.
  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      const menu = moreActionsRef.current;
      if (event.target instanceof Node && menu && !menu.contains(event.target)) {
        menu.open = false;
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      const menu = moreActionsRef.current;
      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

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
    setSummaryError(null);

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
        if (isMounted) {
          console.error("Failed to load study studio summary:", err);
          setSummaryError("스터디 정보를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.");
        }
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
    const titleParam = displayTitle ? `&studyTitle=${encodeURIComponent(displayTitle)}` : "";
    navigate(`/community/post/create?studyId=${studyId}${titleParam}`);
  };

  if (!studyId) {
    return <div style={{ padding: "16px" }}>스터디 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      {/* 상단 헤더 영역 */}
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6 text-gray-900 dark:text-white">학습 스튜디오</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium ml-2 mb-8">AI와 함께하는 스마트한 학습 몰입 환경을 경험하세요.</p>
          <div className="ml-2 flex flex-wrap items-center gap-3">
            {displayTitle && (
              <h2 className="min-w-0 break-words text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 pl-4">
                {displayTitle}
              </h2>
            )}
            {/* 상태는 행동 버튼과 분리하고 수료 상태를 우선 표시합니다. */}
            {!isTodayLoading && !summaryError && todayPlan?.memberStatus === "COMPLETED" ? (
              <span role="status" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                스터디 수료 완료
              </span>
            ) : !isTodayLoading && !summaryError && todayPlan?.memberStatus === "ACTIVE" && todayPlan.studyDailyPlanId && (
              todayPlan.progressStatus === "IN_PROGRESS" ? (
                <span role="status" className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                  오늘 공부 진행 중
                </span>
              ) : todayPlan.progressStatus === "COMPLETED" ? (
                <span role="status" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                  오늘 공부 완료
                </span>
              ) : null
            )}
          </div>
        </div>
        <div className="flex w-full lg:w-auto shrink-0 flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(`/study/forum/${studyId}`)}
            className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            토론방
          </button>
          {!isTodayLoading && !summaryError && todayPlan?.memberStatus === "ACTIVE" && todayPlan.studyDailyPlanId && todayPlan.progressStatus === "NOT_STARTED" && (
            <button
              type="button"
              onClick={handleStartTodayPlan}
              disabled={isStartingToday}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-70 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <PlayIcon size={16} fill="white" />
              {isStartingToday ? "시작 중..." : "일일 진도 시작"}
            </button>
          )}
          <details
            ref={moreActionsRef}
            className="relative"
            onBlur={(event) => {
              // Tab으로 메뉴를 벗어나면 닫아 다음 포커스를 가리지 않습니다.
              if (!event.currentTarget.contains(event.relatedTarget)) {
                event.currentTarget.open = false;
              }
            }}
          >
            <summary aria-label="스터디 더보기" className="flex h-11 w-11 list-none items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
              </svg>
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] p-1.5 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  if (moreActionsRef.current) moreActionsRef.current.open = false;
                  handleShareStudy();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <RocketIcon size={16} /> 공부 공유하기
              </button>
            </div>
          </details>
        </div>
      </header>
      {summaryError && <p role="alert">{summaryError}</p>}

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
        {activeTab === "metrics" && <StudyLearningMetrics studyId={studyId} summary={studioSummary} isSummaryLoading={isTodayLoading} onGenerateFeedback={handleGenerateFeedback} isGeneratingFeedback={isGeneratingFeedback} />}
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
      {todayPlan?.memberStatus === "ACTIVE" && <FloatingStopwatch />}
    </div>
  );
}
