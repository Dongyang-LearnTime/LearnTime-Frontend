import type { StudyTotalInfoResponse } from "../../types/StudyTypes";

interface CoreMetricsChartProps {
  data: StudyTotalInfoResponse;
}

// 초 단위를 시/분/초 한국어 문자열로 바꾸는 헬퍼 함수
const formatFocusedTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  parts.push(`${seconds}초`);

  return parts.join(" ");
};

export default function CoreMetricsChart({ data }: CoreMetricsChartProps) {
  const {
    studyCompletionRate,
    studySuccessRate,
    quizCorrectRate,
    totalFocusedTime,
  } = data;

  // 게이지 아이템 목록 구성
  const gaugeItems = [
    { label: "진도 완료율", value: studyCompletionRate },
    { label: "진도 성공률", value: studySuccessRate },
    { label: "퀴즈 정답률", value: quizCorrectRate },
  ];

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      <h3>핵심 공부 지표</h3>

      {/* 수치 게이지 바 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
        {gaugeItems.map((item) => {
          // 백분율 제한 (0 ~ 100)
          const clampedValue = Math.min(Math.max(item.value, 0), 100);

          return (
            <div key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontWeight: "bold" }}>{item.label}</span>
                <span>{clampedValue}%</span>
              </div>
              {/* 게이지바 컨테이너 */}
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#e5e7eb", // gray-200
                  borderRadius: "9999px",
                  height: "12px",
                  overflow: "hidden",
                }}
              >
                {/* 게이지 채우기 영역 */}
                <div
                  style={{
                    width: `${clampedValue}%`,
                    backgroundColor: "#2563eb", // blue-600
                    height: "100%",
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 총 집중 시간 텍스트 출력 영역 */}
      <div style={{ paddingTop: "12px", borderTop: "1px solid #eee" }}>
        <span style={{ fontWeight: "bold", marginRight: "8px" }}>총 집중 시간:</span>
        <span>{formatFocusedTime(totalFocusedTime)}</span>
      </div>
    </div>
  );
}
