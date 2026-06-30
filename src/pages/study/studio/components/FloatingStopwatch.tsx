import { useState, useEffect } from 'react';
import { PauseIcon, PlayIcon, ResetIcon, SaveIcon } from '../../../../components/ui/Icons';
import { useStopwatchStore } from '../../../../store/useStopwatchStore';
import BaseModal from '../../../../components/common/BaseModal';
import { registerFocusTimeApi } from '../../api/studyStudioApi';
import { toast } from '../../../../utils/toast';

export function FloatingStopwatch() {
  const { 
    time, 
    isRunning, 
    studyDailyPlanId, 
    progressStatus,
    startTime,
    accumulatedTime,
    setTime, 
    setIsRunning, 
    start,
    pause,
    reset 
  } = useStopwatchStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. 백그라운드 탭 수면(Freeze)에 강한 타임스탬프 계산 틱 연동
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        const currentElapsed = accumulatedTime + Math.floor((Date.now() - startTime) / 1000);
        setTime(currentElapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, accumulatedTime, setTime]);

  // 2. 이탈 방지 (beforeunload) 예외 처리
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = '타이머가 작동 중입니다. 페이지를 벗어나시면 타이머 기록이 유실될 수 있습니다.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning]);

  // 시간 포맷팅 헬퍼 함수
  const fmt = (n: number) => String(n).padStart(2, '0');
  const formatTime = (timeInSecs: number) => {
    const h = fmt(Math.floor(timeInSecs / 3600));
    const m = fmt(Math.floor((timeInSecs % 3600) / 60));
    const s = fmt(timeInSecs % 60);
    return `${h}:${m}:${s}`;
  };

  // 3. 시간 저장 시 방어 및 검증 로직
  const handleFocusTimeSubmit = async () => {
    if (!studyDailyPlanId) {
      toast.info("일일 진도 일정을 먼저 시작하셔야 집중 시간을 등록할 수 있습니다.");
      return;
    }
    if (time === 0) return;
    
    // 방어 레이어 1: 10초 미만의 너무 짧은 시간 저장 차단
    if (time < 10) {
      toast.error("너무 짧은 집중 시간(10초 미만)은 기록으로 저장할 수 없습니다.");
      return;
    }

    // 방어 레이어 2: 이미 진도가 완료된 상태(COMPLETED) 확인 분기
    if (progressStatus === 'COMPLETED') {
      const confirmSave = confirm("이미 오늘의 공부 진도가 완료되었습니다. 집중 시간을 추가로 저장하시겠습니까?");
      if (!confirmSave) return;
    }

    // 방어 레이어 3: 최대 12시간 캡(Cap) 제한 (12시간 = 43200초)
    let timeToSave = time;
    const MAX_LIMIT = 43200; 
    if (time > MAX_LIMIT) {
      toast.info("집중 시간은 하루 최대 12시간까지만 기록할 수 있습니다. 12시간으로 보정하여 저장합니다.");
      timeToSave = MAX_LIMIT;
    }

    // 방어 레이어 4: 중복 호출(Double-submit) 방지
    if (isSaving) return;
    setIsSaving(true);

    try {
      // 타이머가 동작 중이었다면 자동 정지
      if (isRunning) {
        pause();
      }

      await registerFocusTimeApi({
        studyDailyPlanId,
        focusTime: formatTime(timeToSave)
      });
      toast.success("오늘의 공부 집중 시간이 성공적으로 등록되었습니다. 수고하셨습니다!");
      setIsRunning(false);
      reset();
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.success("집중 시간 등록에 실패했습니다. (이미 완료되었거나 오늘 계획이 없을 수 있습니다)");
    } finally {
      setIsSaving(false);
    }
  };

  const h = fmt(Math.floor(time / 3600));
  const m = fmt(Math.floor((time % 3600) / 60));
  const s = fmt(time % 60);

  return (
    <>
      {/* 1. 플로팅 액션 버튼 (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-40 flex items-center justify-center gap-2.5 px-5 py-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-[1.05] active:scale-[0.95] cursor-pointer transition-all duration-300
          ${isRunning ? 'ring-4 ring-indigo-500/30 dark:ring-indigo-400/20 animate-pulse' : ''}`}
      >
        <span className="text-xl">⏱️</span>
        <span className="text-sm font-black tracking-tight">
          {isRunning ? `${h}:${m}:${s}` : "타이머"}
        </span>
      </button>

      {/* 2. 타이머 모달 */}
      <BaseModal isOpen={isOpen} onClose={() => !isSaving && setIsOpen(false)}>
        <div className="p-8 text-center flex flex-col items-center justify-center font-sans">
          {/* 상단 타이머 라벨 */}
          <h2 className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-6">스튜디오 타이머</h2>
          
          {/* 대형 스톱워치 뷰 */}
          <div className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter text-glow">
            {h}<span className="text-indigo-500 mx-0.5">:</span>{m}<span className="text-indigo-500 mx-0.5">:</span>{s}
          </div>

          {/* 제어 버튼 */}
          <div className="flex gap-4 mb-6">
            {/* 시작 / 일시정지 */}
            <button
              type="button"
              onClick={() => {
                if (isRunning) {
                  pause();
                } else {
                  start();
                }
              }}
              disabled={isSaving}
              className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-indigo-500/10 hover:bg-gray-900 dark:hover:bg-gray-100 cursor-pointer disabled:opacity-50"
              title={isRunning ? "일시정지" : "시작"}
            >
              {isRunning ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </button>

            {/* 공부 시간 서버 등록 저장 버튼 */}
            <button
              type="button"
              onClick={handleFocusTimeSubmit}
              disabled={time === 0 || !studyDailyPlanId || isSaving}
              className="w-14 h-14 border border-gray-200 dark:border-[#222] rounded-2xl flex items-center justify-center active:scale-90 transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="집중시간 서버 등록"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SaveIcon size={20} />
              )}
            </button>

            {/* 타이머 초기화 */}
            <button
              type="button"
              onClick={() => {
                if (time > 0 && confirm('타이머를 초기화하시겠습니까? (측정된 시간은 저장되지 않습니다)')) {
                  reset();
                } else if (time === 0) {
                  setIsRunning(false);
                }
              }}
              disabled={isSaving}
              className="w-14 h-14 border border-gray-200 dark:border-[#222] rounded-2xl flex items-center justify-center active:scale-90 transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-500 cursor-pointer disabled:opacity-50"
              title="초기화"
            >
              <ResetIcon size={20} />
            </button>
          </div>

          {/* 안내 문구 가이드 영역 */}
          <div className="w-full mt-4 border-t border-gray-100 dark:border-[#1a1a1a] pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-[280px] mx-auto">
              오늘의 목표 달성을 위해 몰입해 보세요!
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-[280px] mx-auto mt-2">
              공부를 마친 후 저장 버튼(<span className="inline-flex items-center text-indigo-500 dark:text-indigo-400"><SaveIcon size={12} /></span>)을 누르면 오늘의 집중 시간이 서버에 기록됩니다.
            </p>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
