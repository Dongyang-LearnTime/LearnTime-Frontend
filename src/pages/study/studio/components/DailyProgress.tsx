import type { StudyPlanResponse } from "../../types/StudyTypes";

interface DailyProgressProps {
  data: StudyPlanResponse;
}

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
}

// 렌더링마다 객체가 재생성되지 않도록 컴포넌트 외부 상수로 분리
const PROGRESS_STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "시작 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const COMPLETION_STATUS_LABEL: Record<string, string> = {
  SUCCESS: "성공",
  FAILURE: "실패",
};

// 공통 테이블 Row 컴포넌트
function InfoRow({
  label,
  children,
}: InfoRowProps) {
  return (
    <tr
      style={{
        borderBottom: "1px solid #eee",
      }}
    >
      <td
        style={{
          padding: "8px 0",
          fontWeight: "bold",
          width: "150px",
          verticalAlign: "top",
        }}
      >
        {label}
      </td>

      <td
        style={{
          padding: "8px 0",
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </td>
    </tr>
  );
}

export default function DailyProgress({
  data,
}: DailyProgressProps) {
  const {
    planDate,
    startDate,
    endDate,
    restDays,
    restDates,
    dayNumber,
    planContent,
    focusTime,
    progressStatus,
    completionStatus,
    understandingScore,
  } = data;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <h3>
        일일 공부 진도 정보 ({planDate})
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "12px",
        }}
      >
        <tbody>
          <InfoRow label="스터디 기간">
            {startDate} ~ {endDate}
          </InfoRow>

          {(restDays.length > 0 ||
            restDates.length > 0) && (
            <InfoRow label="휴무 정보">
              {restDays.length > 0 && (
                <div>
                  휴무 요일: {restDays.join(", ")}
                </div>
              )}

              {restDates.length > 0 && (
                <div>
                  휴무 날짜: {restDates.join(", ")}
                </div>
              )}
            </InfoRow>
          )}

          <InfoRow label="학습 일차">
            {dayNumber !== null
              ? `${dayNumber}일차`
              : "정보 없음"}
          </InfoRow>

          <InfoRow label="학습 계획 내용">
            {planContent ||
              "등록된 학습 계획이 없습니다."}
          </InfoRow>

          <InfoRow label="집중 시간">
            {focusTime || "00:00:00"}
          </InfoRow>

          <InfoRow label="진행 상태">
            {progressStatus
              ? PROGRESS_STATUS_LABEL[
                  progressStatus
                ] || progressStatus
              : "정보 없음"}
          </InfoRow>

          <InfoRow label="완료 상태">
            {completionStatus
              ? COMPLETION_STATUS_LABEL[
                  completionStatus
                ] || completionStatus
              : "정보 없음"}
          </InfoRow>

          <InfoRow label="이해도 점수">
            {understandingScore !== null
              ? `${understandingScore}점`
              : "평가 안 됨"}
          </InfoRow>
        </tbody>
      </table>
    </div>
  );
}