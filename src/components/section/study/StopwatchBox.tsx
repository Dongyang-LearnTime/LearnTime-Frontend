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
import { PauseIcon, PlayIcon, ResetIcon, SaveIcon } from '../../ui/Icons';
import { Card } from '../../common/Card';

interface LapRecord {
  id: string;
  time: number;
  timestamp: string;
  date: string;
}

export function StopwatchBox() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning]);

  // 컴포넌트 마운트 시 로컬스토리지에서 공부 기록 불러오기 및 오늘 날짜 필터링
  useEffect(() => {
    const savedLaps = localStorage.getItem('study_laps');
    if (savedLaps) {
      try {
        const parsed = JSON.parse(savedLaps) as LapRecord[];
        const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
        const todayLaps = parsed.filter(lap => lap.date === todayStr);
        setLaps(todayLaps);
        
        // 지난 날짜 기록이 있으면 로컬스토리지 정리
        if (todayLaps.length !== parsed.length) {
          localStorage.setItem('study_laps', JSON.stringify(todayLaps));
        }
      } catch (e) {
        console.error('Failed to parse study laps', e);
      }
    }
  }, []);

  // 현재 경과 시간을 랩타임으로 기록 저장
  const handleSaveLap = () => {
    if (time === 0) return;
    const now = new Date();
    const newLap: LapRecord = {
      id: now.getTime().toString(),
      time: time,
      timestamp: now.toTimeString().split(' ')[0], // hh:mm:ss
      date: now.toLocaleDateString('sv-SE'),
    };
    const updated = [...laps, newLap];
    setLaps(updated);
    localStorage.setItem('study_laps', JSON.stringify(updated));
  };

  // 모든 랩타임 기록 삭제
  const handleClearLaps = () => {
    if (confirm('오늘의 모든 공부 기록을 삭제하시겠습니까?')) {
      setLaps([]);
      localStorage.removeItem('study_laps');
    }
  };

  // 시간 포맷팅 헬퍼 함수
  const fmt = (n: number) => String(n).padStart(2, '0');
  const formatTime = (timeInSecs: number) => {
    const h = fmt(Math.floor(timeInSecs / 3600));
    const m = fmt(Math.floor((timeInSecs % 3600) / 60));
    const s = fmt(timeInSecs % 60);
    return `${h}:${m}:${s}`;
  };

  const h = fmt(Math.floor(time / 3600));
  const m = fmt(Math.floor((time % 3600) / 60));
  const s = fmt(time % 60);

  return (
    <Card className="flex flex-col items-center h-full border-t-4 border-indigo-500 p-8 min-h-[380px]">
      <h2 className="text-gray-400 text-[0.65rem] font-black uppercase tracking-[0.3em] mt-2 mb-6">스튜디오 타이머</h2>
      <div className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter text-glow">
        {h}<span className="text-indigo-500 mx-0.5">:</span>{m}<span className="text-indigo-500 mx-0.5">:</span>{s}
      </div>
      <div className="flex gap-4 mb-6">
        {/* 시작 / 일시정지 */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-indigo-500/10 hover:bg-gray-900 dark:hover:bg-gray-100 cursor-pointer"
          title={isRunning ? "일시정지" : "시작"}
        >
          {isRunning ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>

        {/* 공부 시간 기록 저장 */}
        <button
          onClick={handleSaveLap}
          disabled={time === 0}
          className="w-14 h-14 border border-gray-200 dark:border-[#222] rounded-2xl flex items-center justify-center active:scale-90 transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="시간 기록 저장"
        >
          <SaveIcon size={20} />
        </button>

        {/* 타이머 초기화 */}
        <button
          onClick={() => {
            if (time > 0 && confirm('타이머를 초기화하시겠습니까?')) {
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

      {/* 기록된 공부 랩타임 리스트 */}
      <div className="w-full mt-2 border-t border-gray-100 dark:border-[#1a1a1a] pt-4">
        {laps.length > 0 ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center text-[0.6rem] text-gray-400 font-bold uppercase tracking-wider mb-3">
              <span>오늘의 기록 ({laps.length})</span>
              <button 
                onClick={handleClearLaps} 
                className="hover:text-rose-500 transition-colors cursor-pointer text-[0.55rem] font-bold"
              >
                전체 삭제
              </button>
            </div>
            <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2">
              {laps.map((lap, idx) => {
                const segmentTime = idx === 0 ? lap.time : lap.time - laps[idx - 1].time;
                return (
                  <div 
                    key={lap.id} 
                    className="flex justify-between items-center px-4 py-2.5 bg-gray-50/50 dark:bg-[#080808]/50 border border-gray-100/50 dark:border-[#151515] rounded-xl text-sm font-semibold hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] text-indigo-500 font-black">기록 0{idx + 1}</span>
                      <span className="text-[0.55rem] text-gray-400 dark:text-gray-500 font-medium">{lap.timestamp}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-900 dark:text-gray-100 font-mono font-black tracking-tight">{formatTime(segmentTime)}</span>
                      <span className="text-[0.55rem] text-gray-400 font-bold font-mono">누적: {formatTime(lap.time)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 font-medium">
            오늘 누적된 공부 기록이 없습니다.
          </div>
        )}
      </div>
    </Card>
  );
}
