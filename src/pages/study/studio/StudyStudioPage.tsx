import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { generateStudyFeedback } from "../api/studyFeedbackApi";
import StudyLearningMetrics from "./StudyLearningMetrics";
import StudyProgressInfo from "./StudyProgressInfo";
import StudyMemberList from "./StudyMemberList";
import { PlusIcon, SparklesIcon } from "../../../components/ui/Icons";
import { usePageTitle } from "../../../hooks/usePageTitle";

export default function StudyStudioPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studyTitle = searchParams.get("title");
  const [ activeTab, setActiveTab ] = useState<"metrics" | "progress" | "members">("metrics");
  const [ isGeneratingFeedback, setIsGeneratingFeedback ] = useState(false);

  usePageTitle(studyTitle ? `학습 스튜디오 - ${studyTitle}` : "학습 스튜디오");

  const handleGenerateFeedback = async () => {
    if (!studyId) return;
    try {
      setIsGeneratingFeedback(true);
      await generateStudyFeedback(Number(studyId));
      alert("AI 진도 분석(피드백) 생성이 완료되었습니다.");
      navigate(`/study/feedback/list/${studyId}`);
    } catch (error) {
      console.error(error);
      alert("AI 진도 분석 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  if (!studyId) {
    return <div style={{ padding: "16px" }}>스터디 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
          {/* 진도 추가 버튼 */}
          <button
            onClick={() => navigate('/study/plan/create')}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl font-bold text-sm hover:border-indigo-500 transition-all shadow-sm cursor-pointer text-gray-800 dark:text-gray-200"
          >
            <PlusIcon size={16} /> 진도 추가
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

      {/* 탭 본문 영역 (조건부 렌더링을 통한 마운트 시점 API 호출 유도) */}
      <div>
        {activeTab === "metrics" && <StudyLearningMetrics studyId={studyId} />}
        {activeTab === "progress" && <StudyProgressInfo studyId={studyId} />}
        {activeTab === "members" && <StudyMemberList studyId={studyId} />}
      </div>
    </div>
  );
}