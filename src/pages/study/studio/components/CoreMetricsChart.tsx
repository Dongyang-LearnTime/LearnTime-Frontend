import type { StudyTotalInfoResponse } from "../../types/studyTypes";
import { Card } from "../../../../components/common/Card";
import { ProgressBar } from "../../../../components/common/ProgressBar";

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

  // 게이지 아이템 목록 구성 (각각 다른 네온 색상 테마 적용)
  const gaugeItems = [
    { label: "진도 완료율", value: studyCompletionRate, color: "bg-indigo-500", text: "text-indigo-500", hover: "hover:border-indigo-400" },
    { label: "진도 성공률", value: studySuccessRate, color: "bg-emerald-500", text: "text-emerald-500", hover: "hover:border-emerald-400" },
    { label: "퀴즈 정답률", value: quizCorrectRate, color: "bg-pink-500", text: "text-pink-500", hover: "hover:border-pink-400" },
  ];

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group border-0 shadow-none bg-white dark:bg-[#050505] rounded-3xl p-6">
      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">핵심 지표</h3>
        <p className="text-xs font-medium text-gray-500">스터디의 전반적인 달성도를 확인합니다.</p>
      </div>

      <div className="grow flex flex-col justify-center relative z-10">
        {/* 누적 집중 시간을 핵심 수치로 돋보이게 배치 */}
        <div className="mb-8 text-center bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-100 dark:border-[#1a1a1a]">
          <span className="block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">총 누적 집중 시간</span>
          <span className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 font-mono tracking-tighter drop-shadow-sm">
            {formatFocusedTime(totalFocusedTime)}
          </span>
        </div>

        <div className="space-y-6">
          {gaugeItems.map((item) => {
            const clampedValue = Math.min(Math.max(item.value, 0), 100);
            return (
              <ProgressBar 
                key={item.label} 
                name={item.label} 
                progress={clampedValue} 
                accentColor={item.color} 
                textColor={item.text} 
                borderHover={item.hover} 
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
