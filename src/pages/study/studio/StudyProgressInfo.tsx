import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStudyPlanApi, startStudyDailyPlanApi } from "../api/StudyStudioApi";
import type { StudyPlanResponse } from "../types/StudyTypes";
import DailyProgress from "./components/DailyProgress";
import BaseModal from "../../../components/common/BaseModal";
import PlanCompletionForm from "./components/PlanCompletionForm";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";

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

    // URL 쿼리 파라미터 갱신 (자동으로 useEffect 재실행 유도)
    setSearchParams({ date: newDateStr });
  };

  // 진도 시작 핸들러
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

  // 모달 제출 완료 핸들러 (진도 완료)
  const handleCompleteSuccess = () => {
    setProgressData((prev) => prev ? { ...prev, progressStatus: "COMPLETED" } : null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 날짜 선택 내비게이션 (디자인 최소화) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <button onClick={() => handleDateChange(-1)}>이전날</button>
        <span style={{ fontWeight: "bold" }}>조회 기준일: {planDate}</span>
        <button onClick={() => handleDateChange(1)}>다음날</button>
        <button onClick={() => setSearchParams({ date: getTodayString() })}>오늘</button>
      </div>

      {/* 로딩 및 에러 처리 분기 */}
      <section style={{ minHeight: "150px" }}>
        {isLoading ? (
          <div style={{ padding: "24px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center" }}>
            일일 진도 정보를 로딩 중입니다...
          </div>
        ) : error ? (
          <div style={{ padding: "24px", color: "red", border: "1px solid #ffcccc", borderRadius: "8px" }}>
            {error}
          </div>
        ) : progressData ? (
          <div>
            <DailyProgress data={progressData} />
            
            {/* 진도 상태에 따른 버튼 노출 로직 */}
            {progressData.studyDailyPlanId && (
              <div style={{ marginTop: "16px", textAlign: "right" }}>
                {progressData.progressStatus === "NOT_STARTED" && (
                  <button
                    onClick={handleStartPlan}
                    disabled={isStarting}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: isStarting ? "not-allowed" : "pointer",
                      opacity: isStarting ? 0.7 : 1
                    }}
                  >
                    {isStarting ? "시작 중..." : "일일 진도 시작"}
                  </button>
                )}

                {progressData.progressStatus === "IN_PROGRESS" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#059669",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    일일 진도 완료
                  </button>
                )}

                {progressData.progressStatus === "COMPLETED" && (
                  <button
                    disabled
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#e5e7eb",
                      color: "#9ca3af",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "not-allowed"
                    }}
                  >
                    진도 완료됨
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: "24px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center" }}>
            해당 일자의 진도 정보가 없습니다.
          </div>
        )}
      </section>

      {/* 진도 완료 모달 */}
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
    </div>
  );
}
