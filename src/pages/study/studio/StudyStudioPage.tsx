import { useState } from "react";
import { useParams } from "react-router-dom";
import StudyLearningMetrics from "./StudyLearningMetrics";
import StudyProgressInfo from "./StudyProgressInfo";
import StudyMemberList from "./StudyMemberList";

export default function StudyStudioPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const [ activeTab, setActiveTab ] = useState<"metrics" | "progress" | "members">("metrics");

  if (!studyId) {
    return <div style={{ padding: "16px" }}>스터디 ID가 유효하지 않습니다.</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
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