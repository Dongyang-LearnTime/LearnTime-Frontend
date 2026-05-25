import { useState, useEffect } from 'react';
import { getStudyMemberContentApi, addStudyMemberContentApi, updateStudyMemberContentApi, deleteStudyMemberContentApi } from '../../api/StudyStudioApi';
import { Card, CardTitle } from '../../../../components/common/Card';
import { EditIcon, CheckIcon, TrashIcon } from '../../../../components/ui/Icons';

export interface StudyScheduleItem {
  studyMemberContentId: number;
  memberContent: string;
}

interface TodayProgressBoxProps {
  studyId: string;
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 구하는 헬퍼 함수
const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function TodayProgressBox({ studyId }: TodayProgressBoxProps) {
  const [schedules, setSchedules] = useState<StudyScheduleItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [planContent, setPlanContent] = useState<string | null>(null);
  const [studyDailyPlanId, setStudyDailyPlanId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    getStudyMemberContentApi(studyId, getTodayString())
      .then((data) => {
        if (isMounted) {
          setPlanContent(data.planContent);
          setStudyDailyPlanId(data.studyDailyPlanId);
          setSchedules(data.memberContents || []);
        }
      })
      .catch(err => console.error("Failed to load today's plan content:", err));
    return () => { isMounted = false; };
  }, [studyId]);

  // 일정 추가
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
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
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardTitle icon={<EditIcon size={18} />}>오늘의 진도</CardTitle>

      {/* planContent 표시 영역 */}
      {planContent && (
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl">
          <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-widest">오늘의 목표 진도</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">{planContent}</div>
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
          placeholder="공부 일정을 입력하세요..."
          className="grow bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900 dark:text-white"
        />
        <button type="submit" className="px-8 bg-black dark:bg-white text-white dark:text-black text-sm font-black rounded-2xl active:scale-95 transition-transform cursor-pointer">
          등록
        </button>
      </form>
    </Card>
  );
}
