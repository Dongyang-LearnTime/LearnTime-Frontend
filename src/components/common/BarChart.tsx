// components/common/BarChart.tsx
// 막대 차트 공통 컴포넌트.
// StudyPage의 "주간 몰입도"와 ExercisePage의 "근성장 속도"에서 재사용
// 호버 시 activeColor/labelActiveColor prop으로 넘긴 Tailwind 클래스를 적용

interface BarChartProps {
  data: number[];        // 각 막대의 높이 비율 (0~100)
  labels: string[];      // 막대 하단 레이블 (e.g. ['월','화',...])
  activeColor: string;   // 호버 시 막대 색상 (e.g. 'group-hover:bg-indigo-600')
  labelActiveColor: string; // 호버 시 레이블 색상 (e.g. 'group-hover:text-indigo-600')
  height?: string;       // 차트 높이 Tailwind 클래스 (기본 'h-[250px]')
}

/**
 * 재사용 가능한 세로 막대 차트
 * 각 열을 그룹으로 묶어 호버 인터랙션을 제공
 */
export function BarChart({ data, labels, activeColor, labelActiveColor, height = 'h-[250px]' }: BarChartProps) {
  return (
    <div className={`flex items-end gap-4 ${height} relative`}>
      {/* 배경 수평 구분선 (opacity 5%로 아주 옅게 표시) */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="w-full border-t border-black dark:border-white" />
        ))}
      </div>

      {/* 각 데이터 포인트 → 막대 + 레이블 */}
      {data.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end group z-10">
          <div
            className={`w-full bg-gray-100 dark:bg-[#1a1a1a] ${activeColor} transition-all duration-500 rounded-full cursor-pointer`}
            style={{ height: `${h}%` }}
          />
          <div className={`text-center mt-4 text-[0.6rem] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest ${labelActiveColor} transition-colors`}>
            {labels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
