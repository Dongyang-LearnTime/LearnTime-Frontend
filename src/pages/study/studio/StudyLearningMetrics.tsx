import { useEffect, useState } from "react";
import { getStudyTotalInfoApi, getStudyRecentWeekInfoApi } from "../api/StudyStudioApi";
import type { StudyRecentWeekInfoResponse, StudyTotalInfoResponse } from "../types/StudyTypes";
import RecentWeekChart from "./components/RecentWeekChart";
import CoreMetricsChart from "./components/CoreMetricsChart";
import StudyMemberContent from "./components/StudyMemberContent";

interface StudyLearningMetricsProps {
  studyId: string;
}

export default function StudyLearningMetrics({ studyId }: StudyLearningMetricsProps) {
  // 1. 최근 일주일 공부 지표 상태 관리
  const [ recentData, setRecentData ] = useState<StudyRecentWeekInfoResponse[] | null>(null);
  const [ isRecentLoading, setIsRecentLoading ] = useState<boolean>(true);
  const [ recentError, setRecentError ] = useState<string | null>(null);

  // 2. 주요 공부 지표 상태 관리
  const [ totalData, setTotalData ] = useState<StudyTotalInfoResponse | null>(null);
  const [ isTotalLoading, setIsTotalLoading ] = useState<boolean>(true);
  const [ totalError, setTotalError ] = useState<string | null>(null);

  // 마운트 시 각각의 API 호출을 수행
  useEffect(() => {
    let isMounted = true;

    // 최근 일주일 지표 호출
    setIsRecentLoading(true);
    getStudyRecentWeekInfoApi(studyId)
      .then((data) => {
        if (isMounted) {
          setRecentData(data);
          setIsRecentLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load recent week info:", err);
          setRecentError("최근 일주일 간 공부 지표를 불러오는 데 실패했습니다.");
          setIsRecentLoading(false);
        }
      });

    // 주요 핵심 공부 지표 호출
    setIsTotalLoading(true);
    getStudyTotalInfoApi(studyId)
      .then((data) => {
        if (isMounted) {
          setTotalData(data);
          setIsTotalLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load study total info:", err);
          setTotalError("핵심 공부 지표를 불러오는 데 실패했습니다.");
          setIsTotalLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studyId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. 최근 일주일간 지표 섹션 (독립 로딩) */}
      <section style={{ minHeight: "150px" }}>
        {isRecentLoading ? (
          <div style={{ padding: "24px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center" }}>
            일주일 간 지표 데이터를 로딩 중입니다...
          </div>
        ) : recentError ? (
          <div style={{ padding: "24px", color: "red", border: "1px solid #ffcccc", borderRadius: "8px" }}>
            {recentError}
          </div>
        ) : recentData ? (
          <RecentWeekChart data={recentData} />
        ) : (
          <div style={{ padding: "24px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center" }}>
            최근 일주일 간 데이터가 없습니다.
          </div>
        )}
      </section>

      {/* 2. 핵심 공부 지표 섹션 (독립 로딩) */}
      <section style={{ minHeight: "150px" }}>
        {isTotalLoading ? (
          <div style={{ padding: "24px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center" }}>
            핵심 공부 지표 데이터를 로딩 중입니다...
          </div>
        ) : totalError ? (
          <div style={{ padding: "24px", color: "red", border: "1px solid #ffcccc", borderRadius: "8px" }}>
            {totalError}
          </div>
        ) : totalData ? (
          <CoreMetricsChart data={totalData} />
        ) : (
          <div style={{ padding: "24px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center" }}>
            핵심 지표 데이터가 없습니다.
          </div>
        )}
      </section>

      {/* 3. 공부 일정 섹션 */}
      <section>
        <StudyMemberContent />
      </section>
    </div>
  );
}
