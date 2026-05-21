import type { StudyPlanResponse } from "../../types/StudyTypes";

interface DailyProgressProps {
  data: StudyPlanResponse;
}

export default function DailyProgress({ data }: DailyProgressProps) {
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

  // 상태 한글 변환 매핑
  const progressStatusLabel: { [key: string]: string } = {
    NOT_STARTED: "시작 전",
    IN_PROGRESS: "진행 중",
    COMPLETED: "완료",
  };

  const completionStatusLabel: { [key: string]: string } = {
    SUCCESS: "성공",
    FAILURE: "실패",
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      <h3>일일 공부 진도 정보 ({planDate})</h3>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
        <tbody>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold", width: "150px" }}>스터디 기간</td>
            <td style={{ padding: "8px 0" }}>{startDate} ~ {endDate}</td>
          </tr>
          
          {(restDays.length > 0 || restDates.length > 0) && (
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 0", fontWeight: "bold" }}>휴무 정보</td>
              <td style={{ padding: "8px 0" }}>
                {restDays.length > 0 && <div>휴무 요일: {restDays.join(", ")}</div>}
                {restDates.length > 0 && <div>휴무 날짜: {restDates.join(", ")}</div>}
              </td>
            </tr>
          )}

          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold" }}>학습 일차</td>
            <td style={{ padding: "8px 0" }}>{dayNumber !== null ? `${dayNumber}일차` : "정보 없음"}</td>
          </tr>

          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold" }}>학습 계획 내용</td>
            <td style={{ padding: "8px 0", whiteSpace: "pre-wrap" }}>
              {planContent || "등록된 학습 계획이 없습니다."}
            </td>
          </tr>

          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold" }}>집중 시간</td>
            <td style={{ padding: "8px 0" }}>{focusTime || "00:00:00"}</td>
          </tr>

          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold" }}>진행 상태</td>
            <td style={{ padding: "8px 0" }}>
              {progressStatus ? progressStatusLabel[progressStatus] || progressStatus : "정보 없음"}
            </td>
          </tr>

          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold" }}>완료 상태</td>
            <td style={{ padding: "8px 0" }}>
              {completionStatus ? completionStatusLabel[completionStatus] || completionStatus : "정보 없음"}
            </td>
          </tr>

          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 0", fontWeight: "bold" }}>이해도 점수</td>
            <td style={{ padding: "8px 0" }}>
              {understandingScore !== null ? `${understandingScore}점` : "평가 안 됨"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
