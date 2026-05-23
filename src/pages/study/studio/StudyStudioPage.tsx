import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudyLearningMetrics from "./StudyLearningMetrics";
import StudyProgressInfo from "./StudyProgressInfo";
import StudyMemberList from "./StudyMemberList";
import { PlusIcon, SparklesIcon } from "../../../components/ui/Icons";

export default function StudyStudioPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [ activeTab, setActiveTab ] = useState<"metrics" | "progress" | "members">("metrics");

  if (!studyId) {
    return <div style={{ padding: "16px" }}>스터디 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 상단 헤더 영역 */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6 text-gray-900 dark:text-white">학습 스튜디오</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium ml-2">AI와 함께하는 스마트한 학습 몰입 환경을 경험하세요.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* AI 진도 분석 버튼 */}
          <button
            onClick={() => navigate('/main/settings')} // TODO: AI 분석 페이지 라우트로 교체
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <SparklesIcon size={16} /> AI 진도 분석
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

      {/* 탭 헤더 영역 (디자인 최소화) */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("metrics")}
          style={{
            padding: "8px 16px",
            fontWeight: activeTab === "metrics" ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          학습 지표
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          style={{
            padding: "8px 16px",
            fontWeight: activeTab === "progress" ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          진도 정보
        </button>
        <button
          onClick={() => setActiveTab("members")}
          style={{
            padding: "8px 16px",
            fontWeight: activeTab === "members" ? "bold" : "normal",
            cursor: "pointer",
          }}
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