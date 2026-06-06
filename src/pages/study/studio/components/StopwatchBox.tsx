// ============================================================
// components/section/study/StopwatchBox.tsx
// 학습 시간 측정 스톱워치 컴포넌트.
//
// 기능:
//   - useEffect + setInterval로 1초마다 경과 시간 갱신
//   - 시작/일시정지 토글 버튼 (PlayIcon ↔ PauseIcon)
//   - 기록 저장 버튼 (SaveIcon) -> 랩타임처럼 오늘 쌓인 공부 기록 저장
//   - 초기화 버튼 (ResetIcon)
//   - hh:mm:ss 형식으로 시간 표시
//   - 당일 누적된 기록 리스트 로컬스토리지 저장 및 렌더링
// ============================================================
import { useState, useEffect } from 'react';
import { PauseIcon, PlayIcon, ResetIcon, SaveIcon } from '../../../../components/ui/Icons';
import { Card } from '../../../../components/common/Card';
import { registerFocusTimeApi } from '../../api/studyStudioApi';

interface StopwatchBoxProps {
  studyDailyPlanId: number | null | undefined;
}

export function StopwatchBox({ studyDailyPlanId }: StopwatchBoxProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning]);

  // 시간 포맷팅 헬퍼 함수
  const fmt = (n: number) => String(n).padStart(2, '0');
  const formatTime = (timeInSecs: number) => {
    const h = fmt(Math.floor(timeInSecs / 3600));
    const m = fmt(Math.floor((timeInSecs % 3600) / 60));
    const s = fmt(timeInSecs % 60);
    return `${h}:${m}:${s}`;
  };

  // 백엔드 API에 집중시간 전송/등록
  const handleFocusTimeSubmit = async () => {
    if (!studyDailyPlanId) {
      alert("일일 진도 일정을 먼저 시작하셔야 집중 시간을 등록할 수 있습니다.");
      return;
    }
    if (time === 0) return;
    try {
      await registerFocusTimeApi({
        studyDailyPlanId,
        focusTime: formatTime(time)
      });
      alert("오늘의 공부 집중 시간이 성공적으로 등록되었습니다. 수고하셨습니다!");
      setIsRunning(false);
      setTime(0);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("집중 시간 등록에 실패했습니다. (이미 완료되었거나 오늘 계획이 없을 수 있습니다)");
    }
  };

  const h = fmt(Math.floor(time / 3600));
  const m = fmt(Math.floor((time % 3600) / 60));
  const s = fmt(time % 60);

  return (
    <Card className="flex flex-col items-center justify-between h-full p-8 min-h-95 relative overflow-hidden group">
      {/* 1. 상단 라벨 */}
      <h2 className="text-gray-400 text-[0.65rem] font-black uppercase tracking-[0.3em] mt-2">스튜디오 타이머</h2>
      
      {/* 2. 중앙 컨테이너 (남은 공간을 채우고 수직 중앙 정렬) */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter text-glow">
          {h}<span className="text-indigo-500 mx-0.5">:</span>{m}<span className="text-indigo-500 mx-0.5">:</span>{s}
        </div>
        <div className="flex gap-4">
          {/* 시작 / 일시정지 */}
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-indigo-500/10 hover:bg-gray-900 dark:hover:bg-gray-100 cursor-pointer"
            title={isRunning ? "일시정지" : "시작"}
          >
            {isRunning ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>

          {/* 공부 시간 서버 등록 저장 버튼 */}
          <button
            type="button"
            onClick={handleFocusTimeSubmit}
            disabled={time === 0 || !studyDailyPlanId}
            className="w-14 h-14 border border-gray-200 dark:border-[#222] rounded-2xl flex items-center justify-center active:scale-90 transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="집중시간 서버 등록"
          >
            <SaveIcon size={20} />
          </button>

          {/* 타이머 초기화 */}
          <button
            type="button"
            onClick={() => {
              if (time > 0 && confirm('타이머를 초기화하시겠습니까? (측정된 시간은 저장되지 않습니다)')) {
                setIsRunning(false);
                setTime(0);
              } else if (time === 0) {
                setIsRunning(false);
              }
            }}
            className="w-14 h-14 border border-gray-200 dark:border-[#222] rounded-2xl flex items-center justify-center active:scale-90 transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-500 cursor-pointer"
            title="초기화"
          >
            <ResetIcon size={20} />
          </button>
        </div>
      </div>

      {/* 3. 안내 문구 가이드 영역 (하단에 밀착 고정) */}
      <div className="w-full mt-2 border-t border-gray-100 dark:border-[#1a1a1a] pt-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold leading-relaxed max-w-[240px] mx-auto">
          오늘의 목표 달성을 위해 몰입해 보세요!
        </p>
        <p className="text-[10px] text-gray-300 dark:text-gray-600 font-medium leading-relaxed max-w-[240px] mx-auto mt-1">
          공부를 마친 후 저장 버튼(<span className="inline-flex items-center text-indigo-400 dark:text-indigo-500"><SaveIcon size={10} /></span>)을 누르면 오늘의 집중 시간이 기록됩니다.
        </p>
      </div>
    </Card>
  );
}
