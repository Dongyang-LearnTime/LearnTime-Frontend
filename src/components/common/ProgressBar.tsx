// 진행 바 공통 컴포넌트.
// 학습/운동 대시보드의 지표 섹션에서 재사용된다.
// accentColor, textColor, borderHover prop으로 모드별 색상을 주입

interface ProgressBarProps {
  name: string;            // 지표 이름 (e.g. '집중도')
  progress: number;        // 진행률 0~100
  accentColor?: string;    // 진행 바 색상 (e.g. 'bg-indigo-600')
  textColor?: string;      // 퍼센트 텍스트 색상 (e.g. 'text-indigo-500')
  borderHover?: string;    // 호버 시 테두리 색상 (e.g. 'hover:border-indigo-300')
}

/**
 * 이름 + 퍼센트 수치 + 시각적 진행 바를 한 블록으로 표시하는 컴포넌트.
 * 색상 관련 props는 전부 Tailwind 클래스 문자열로 전달
 */
export function ProgressBar({
  name,
  progress,
  accentColor = 'bg-indigo-600',
  textColor = 'text-indigo-500',
  borderHover = 'hover:border-indigo-300',
}: ProgressBarProps) {
  return (
    <div className={`p-6 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] ${borderHover} transition-all`}>
      {/* 이름 & 퍼센트 수치 */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-black tracking-tight text-gray-800 dark:text-gray-200">{name}</span>
        <span className={`text-xs font-black font-mono ${textColor}`}>{progress}%</span>
      </div>
      {/* 진행 바 트랙 */}
      <div className="w-full bg-gray-200/50 dark:bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
        {/* 진행 바 핸들 — width를 인라인 스타일로 설정 (Tailwind JIT 제한 우회) */}
        <div
          className={`${accentColor} h-full rounded-full transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
