import { useState } from 'react';
import type { Todo } from '../../../types';
import { SparklesIcon, UploadIcon, XIcon } from '../../ui/Icons';
import { Card, CardTitle } from '../../common/Card';

export function SyllabusBox({ onGenerate, onClose, initialStart = '', initialEnd = '' }: { 
  onGenerate: (items: Todo[], start?: string, end?: string, excludeDates?: string[]) => void;
  onClose?: () => void;
  initialStart?: string;
  initialEnd?: string;
}) {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [excludeDates, setExcludeDates] = useState<string[]>([]);
  const [tempDate, setTempDate] = useState('');

  const handleAddExcludeDate = () => {
    if (!tempDate) return;
    if (excludeDates.includes(tempDate)) {
      setTempDate('');
      return;
    }
    const updated = [...excludeDates, tempDate].sort();
    setExcludeDates(updated);
    setTempDate('');
  };

  const handleRemoveExcludeDate = (dateToRemove: string) => {
    setExcludeDates(excludeDates.filter(d => d !== dateToRemove));
  };

  return (
    <Card className="glow-indigo h-full border-t-4 border-indigo-500 relative">
      <CardTitle icon={<SparklesIcon size={18} />}>AI 자동 진도 제공</CardTitle>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-gray-50 dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-2xl text-gray-400 transition-all z-10 cursor-pointer"
        >
          <XIcon size={20} />
        </button>
      )}
      
      <div className="mb-8 border-2 border-dashed border-gray-100 dark:border-[#27272a] bg-gray-50/30 dark:bg-[#18181b]/50 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#18181b] transition-all group">
        <UploadIcon size={32} className="text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
        <p className="mt-4 text-sm font-bold text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">목차 이미지 업로드</p>
      </div>

      <div className="space-y-4 mb-8">
        {([['시작일', start, setStart], ['종료일', end, setEnd]] as const).map(([label, val, setter]) => (
          <div key={label} className="flex flex-col gap-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
            <input 
              type="date" 
              value={val} 
              onChange={e => setter(e.target.value)} 
              className="w-full bg-gray-50 dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a] rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-gray-200" 
            />
          </div>
        ))}

        {/* 제외 날짜 입력 필드 */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1">학습 제외 날짜</label>
          <div className="flex gap-2">
            <input 
              type="date" 
              value={tempDate} 
              onChange={e => setTempDate(e.target.value)} 
              className="flex-grow bg-gray-50 dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a] rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-gray-200" 
            />
            <button
              type="button"
              onClick={handleAddExcludeDate}
              className="px-6 py-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-sm hover:bg-indigo-100 dark:hover:bg-indigo-950 active:scale-95 transition-all border border-indigo-100/50 dark:border-indigo-900/50 cursor-pointer whitespace-nowrap"
            >
              제외일 추가
            </button>
          </div>

          {/* 제외 날짜 칩 리스트 */}
          {excludeDates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-50/50 dark:bg-[#18181b]/30 rounded-2xl border border-gray-100/50 dark:border-[#27272a]/50">
              {excludeDates.map(date => (
                <span 
                  key={date}
                  className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-full px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm animate-in zoom-in-95 duration-200"
                >
                  {date}
                  <button
                    type="button"
                    onClick={() => handleRemoveExcludeDate(date)}
                    className="p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-full transition-colors cursor-pointer"
                  >
                    <XIcon size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onGenerate(
          [{ id: Date.now().toString(), text: 'AI가 생성한 학습 로드맵입니다.', completed: false, isAi: true }], 
          start, 
          end,
          excludeDates
        )}
        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl shadow-indigo-500/10 cursor-pointer"
      >
        AI 로드맵 생성
      </button>
    </Card>
  );
}
