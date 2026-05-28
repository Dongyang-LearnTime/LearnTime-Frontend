import { useState, useEffect } from 'react';
import { getStudyMemberContentApi, addStudyMemberContentApi, updateStudyMemberContentApi, deleteStudyMemberContentApi, registerFocusTimeApi } from '../../api/studyStudioApi';
import { Card, CardTitle } from '../../../../components/common/Card';
import { EditIcon, CheckIcon, TrashIcon, PlayIcon, PauseIcon, ClockIcon } from '../../../../components/ui/Icons';
import type { StudyMemberContentResponse } from '../../types/studyTypes';

export interface StudyScheduleItem {
  studyMemberContentId: number;
  memberContent: string;
}

interface TodayProgressBoxProps {
  studyId: string;
  initialData?: StudyMemberContentResponse;
  skipInitialFetch?: boolean;
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 구하는 헬퍼 함수
const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function TodayProgressBox({ studyId, initialData, skipInitialFetch = false }: TodayProgressBoxProps) {
  const [schedules, setSchedules] = useState<StudyScheduleItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [planContent, setPlanContent] = useState<string | null>(null);
  const [studyDailyPlanId, setStudyDailyPlanId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isHoliday, setIsHoliday] = useState<boolean>(false);

  // 스톱워치 상태
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setPlanContent(initialData.planContent);
      setStudyDailyPlanId(initialData.studyDailyPlanId);
      setSchedules(initialData.memberContents || []);
      setIsHoliday(initialData.isHoliday);
      return;
    }
    if (skipInitialFetch) return;

    let isMounted = true;
    getStudyMemberContentApi(studyId, getTodayString())
      .then((data) => {
        if (isMounted) {
          setPlanContent(data.planContent);
          setStudyDailyPlanId(data.studyDailyPlanId);
          setSchedules(data.memberContents || []);
          setIsHoliday(data.isHoliday);
        }
      })
      .catch(err => console.error("Failed to load today's plan content:", err));
    return () => { isMounted = false; };
  }, [studyId, initialData, skipInitialFetch]);

  // 스톱워치 타이머 로직
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleFocusTimeSubmit = async () => {
    if (!studyDailyPlanId) return;
    try {
      await registerFocusTimeApi({
        studyDailyPlanId,
        focusTime: formatTime(elapsedSeconds)
      });
      alert("집중 시간이 성공적으로 등록되었습니다.");
      setTimerActive(false);
      setElapsedSeconds(0);
    } catch (err) {
      console.error(err);
      alert("집중 시간 등록에 실패했습니다. (이미 완료된 일정이거나 네트워크 오류일 수 있습니다)");
    }
  };

  // 일정 추가
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isHoliday) {
      alert("오늘은 공식 휴무일이므로 공부 일정을 추가할 수 없습니다.");
      return;
    }
    if (!inputValue.trim() || !studyDailyPlanId) {
      if (!studyDailyPlanId) alert("진도를 먼저 시작해야 내용을 추가할 수 있습니다.");
      return;
    }

    try {
      const newId = await addStudyMemberContentApi(studyDailyPlanId, inputValue.trim());
      setSchedules((prev) => [...prev, { studyMemberContentId: newId, memberContent: inputValue.trim() }]);
      setInputValue('');
    } catch (err) {
      console.error("Failed to add content:", err);
      alert("일정 추가에 실패했습니다.");
    }
  };

  // 일정 삭제
  const handleDeleteSchedule = async (id: number) => {
    try {
      await deleteStudyMemberContentApi(id);
      setSchedules((prev) => prev.filter((item) => item.studyMemberContentId !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error("Failed to delete content:", err);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  // 인라인 편집 시작
  const startEdit = (item: StudyScheduleItem) => {
    setEditingId(item.studyMemberContentId);
    setEditValue(item.memberContent);
  };

  // 인라인 편집 저장
  const saveEdit = async (id: number) => {
    if (!editValue.trim()) return;
    try {
      await updateStudyMemberContentApi(id, editValue.trim());
      setSchedules((prev) =>
        prev.map((item) =>
          item.studyMemberContentId === id ? { ...item, memberContent: editValue.trim() } : item
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update content:", err);
      alert("일정 수정에 실패했습니다.");
    }
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group">
      <CardTitle icon={<EditIcon size={18} />}>
        <div className="flex items-center gap-2">
          <span>오늘의 진도</span>
          {isHoliday && (
            <span className="px-2 py-0.5 text-[10px] font-black bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-md">
              공식 휴무일
            </span>
          )}
        </div>
      </CardTitle>

      {/* 집중 시간 타이머 */}
      {!isHoliday && studyDailyPlanId && (
        <div className="mb-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ClockIcon size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Focus Time</div>
              <div className="text-lg font-black tracking-widest text-gray-900 dark:text-white tabular-nums leading-none mt-0.5">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`p-2 rounded-xl transition-all ${timerActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              title={timerActive ? "일시정지" : "시작"}
            >
              {timerActive ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            </button>
            {elapsedSeconds > 0 && (
              <button
                onClick={handleFocusTimeSubmit}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all font-bold text-xs"
              >
                저장
              </button>
            )}
          </div>
        </div>
      )}

      {/* planContent 또는 휴일 표시 영역 */}
      {(planContent || isHoliday) && (
        <div className={`mb-4 p-4 rounded-2xl border ${
          isHoliday 
            ? "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40" 
            : "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40"
        }`}>
          <div className={`text-xs font-black mb-1 uppercase tracking-widest ${
            isHoliday ? "text-rose-600 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"
          }`}>
            {isHoliday ? "스터디 휴무일" : "오늘의 목표 진도"}
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
            {isHoliday ? (
              <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1.5">
                오늘은 스터디가 쉬어가는 공식 휴무일입니다. ☕
              </span>
            ) : (
              planContent
            )}
          </div>
        </div>
      )}

      <div className="grow overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
        {schedules.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium italic ml-1 py-1">개인 공부 일정이 없습니다.</p>
        ) : (
          schedules.map((item) => (
            <div key={item.studyMemberContentId} className="flex items-center justify-between group p-4 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
              
              {/* 체크박스 및 텍스트 */}
              <label className="flex items-center gap-4 cursor-pointer grow overflow-hidden">
                <input type="checkbox" className="hidden" checked={selectedId === item.studyMemberContentId} onChange={() => setSelectedId(item.studyMemberContentId)} />
                <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedId === item.studyMemberContentId ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 dark:border-[#27272a]'}`}>
                  {selectedId === item.studyMemberContentId && <CheckIcon size={14} className="text-white" />}
                </div>
                
                {/* 편집 모드 조건부 렌더링 */}
                {editingId === item.studyMemberContentId ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(item.studyMemberContentId)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.studyMemberContentId)}
                    className="text-sm bg-transparent border-b border-indigo-600 outline-none w-full font-bold text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className="text-sm font-bold tracking-tight text-gray-800 dark:text-gray-200" onDoubleClick={() => startEdit(item)}>
                    {item.memberContent}
                  </span>
                )}
              </label>

              {/* 컨트롤 툴바 */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                <button type="button" onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"><EditIcon size={14} /></button>
                <button type="button" onClick={() => handleDeleteSchedule(item.studyMemberContentId)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"><TrashIcon size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 일정 추가 폼 */}
      <form onSubmit={handleAddSchedule} className="flex gap-3 shrink-0">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isHoliday || !studyDailyPlanId}
          placeholder={
            isHoliday 
              ? "오늘은 공식 휴무일입니다." 
              : !studyDailyPlanId 
                ? "진도 시작 전에는 일정을 추가할 수 없습니다."
                : "공부 일정을 입력하세요..."
          }
          className="grow bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit" 
          disabled={isHoliday || !studyDailyPlanId || !inputValue.trim()}
          className="px-8 bg-black dark:bg-white text-white dark:text-black text-sm font-black rounded-2xl active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          등록
        </button>
      </form>
    </Card>
  );
}
