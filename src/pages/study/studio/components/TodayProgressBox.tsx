import { useState } from 'react';
import { Card, CardTitle } from '../../../../components/common/Card';
import { EditIcon, CheckIcon, TrashIcon } from '../../../../components/ui/Icons';

export interface StudyScheduleItem {
  id: number;
  content: string;
  completed: boolean;
}

export function TodayProgressBox() {
  // --------------------------------------------------------------------------------
  // TODO: 추후 getStudyMemberContent API와 연동하여 사용자의 오늘의 진도를 불러와야 함
  // --------------------------------------------------------------------------------

  // 공부 일정 리스트 (기존 StudyMemberContent 로직)
  const [schedules, setSchedules] = useState<StudyScheduleItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // 일정 추가
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem: StudyScheduleItem = {
      id: Date.now(),
      content: inputValue.trim(),
      completed: false,
    };
    setSchedules((prev) => [...prev, newItem]);
    setInputValue('');
  };

  // 일정 삭제
  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  // 일정 완료 토글
  const handleToggle = (id: number) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // 인라인 편집 시작
  const startEdit = (item: StudyScheduleItem) => {
    setEditingId(item.id);
    setEditValue(item.content);
  };

  // 인라인 편집 저장
  const saveEdit = (id: number) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, content: editValue } : item
      )
    );
    setEditingId(null);
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardTitle icon={<EditIcon size={18} />}>오늘의 진도</CardTitle>

      <div className="grow overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
        {schedules.length === 0 ? (
          <p className="text-xs text-gray-400 font-medium italic ml-1">등록된 공부 일정이 없습니다.</p>
        ) : (
          schedules.map((item) => (
            <div key={item.id} className="flex items-center justify-between group p-4 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
              
              {/* 체크박스 및 텍스트 */}
              <label className="flex items-center gap-4 cursor-pointer grow overflow-hidden">
                <input type="checkbox" className="hidden" checked={item.completed} onChange={() => handleToggle(item.id)} />
                <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 dark:border-[#27272a]'}`}>
                  {item.completed && <CheckIcon size={14} className="text-white" />}
                </div>
                
                {/* 편집 모드 조건부 렌더링 */}
                {editingId === item.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(item.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                    className="text-sm bg-transparent border-b border-indigo-600 outline-none w-full font-bold text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className={`text-sm font-bold tracking-tight ${item.completed ? 'text-gray-400 line-through opacity-50' : 'text-gray-800 dark:text-gray-200'}`} onDoubleClick={() => startEdit(item)}>
                    {item.content}
                  </span>
                )}
              </label>

              {/* 컨트롤 툴바 */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                <button type="button" onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"><EditIcon size={14} /></button>
                <button type="button" onClick={() => handleDeleteSchedule(item.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"><TrashIcon size={14} /></button>
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
