import type { StudyTotalInfoResponse } from "../../types/StudyTypes";
import { Card, CardTitle } from "../../../../components/common/Card";
import { ProgressBar } from "../../../../components/common/ProgressBar";
import { TrendIcon } from "../../../../components/ui/Icons";

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
    <Card className="h-full flex flex-col relative overflow-hidden group">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardTitle icon={<TrendIcon size={18} />}>핵심 지표</CardTitle>

      <div className="flex-grow flex flex-col justify-center">
        {/* 누적 집중 시간을 핵심 수치로 돋보이게 배치 */}
        <div className="mb-8 text-center bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-100 dark:border-[#1a1a1a]">
          <span className="block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">총 누적 집중 시간</span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter drop-shadow-sm">
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
                accentColor="bg-indigo-600" 
                textColor="text-indigo-500" 
                borderHover="hover:border-indigo-300" 
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
