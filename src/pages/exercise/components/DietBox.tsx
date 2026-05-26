import { useState, useEffect } from 'react';
import { CoffeeIcon, PlusIcon, TrashIcon } from '../../../components/ui/Icons';
import { Card, CardTitle } from '../../../components/common/Card';
import { saveMeal, getTodayMeals } from '../api/exerciseApi';
import type { MealResponse } from '../types/exerciseApi';

export function DietBox() {
  const [items, setItems] = useState<MealResponse[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 오늘의 식단 목록 초기 조회
  useEffect(() => {
    const fetchTodayMeals = async () => {
      try {
        const data = await getTodayMeals();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch today meals', error);
      }
    };
    fetchTodayMeals();
  }, []);

  // 일일 총합 계산
  const dailyTotals = items.reduce((acc, cur) => ({
    cal: acc.cal + cur.calories,
    protein: acc.protein + cur.protein,
  }), { cal: 0, protein: 0 });

  const addItem = async () => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await saveMeal({ content });
      setItems(prev => [...prev, response]);
      setContent('');
    } catch (error) {
      console.error('Failed to save meal', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = (id: number) =>
    setItems(prev => prev.filter(item => item.id !== id));

  return (
    <Card className="flex flex-col h-full min-h-[40.625rem]">
      <CardTitle icon={<CoffeeIcon size={18} />}>In & Out 식단</CardTitle>

      {/* 일일 총 섭취 요약 배너 */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-[#0d0d0d] rounded-4xl border border-gray-100 dark:border-[#1a1a1a]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">일일 총 섭취</span>
          <span className="text-xl font-black text-rose-500 tracking-tighter">{dailyTotals.cal} <span className="text-[0.7rem] opacity-70">KCAL</span></span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white dark:bg-[#050505] rounded-2xl border border-gray-50 dark:border-[#111]">
            <p className="text-[0.6rem] font-black text-gray-400 mb-1">칼로리</p>
            <p className="text-sm font-black text-amber-500">{dailyTotals.cal}kcal</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-[#050505] rounded-2xl border border-gray-50 dark:border-[#111]">
            <p className="text-[0.6rem] font-black text-gray-400 mb-1">단백질</p>
            <p className="text-sm font-black text-emerald-500">{dailyTotals.protein}g</p>
          </div>
        </div>
      </div>

      {/* Food list */}
      <div className="space-y-3 mb-8 grow overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 && <p className="text-xs text-gray-400 font-medium italic text-center mt-10">기록된 식단이 없습니다.</p>}
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] p-4 rounded-2xl hover:border-rose-200 transition-all group">
            <div className="min-w-0 grow mr-4">
              <span className="text-sm font-black text-gray-800 dark:text-gray-200 block truncate">
                {item.foodName} {item.isEstimated && <span className="text-[0.6rem] text-amber-500">(AI 추정)</span>}
              </span>
              <div className="flex gap-2 mt-1">
                <span className="text-[0.6rem] font-black text-rose-500/60 uppercase tracking-widest">단백질 {item.protein}g</span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm font-black font-mono text-gray-900 dark:text-white">{item.calories} <span className="text-[0.6rem] text-gray-400">KCAL</span></span>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><TrashIcon size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="무엇을 드셨나요? (예: 제육볶음 먹었어)" 
            className="grow bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addItem();
            }}
            disabled={isLoading}
          />
          <button 
            onClick={addItem} 
            disabled={isLoading}
            className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center active:scale-95 shadow-xl shadow-rose-500/10 shrink-0 disabled:opacity-50"
          >
            {isLoading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <PlusIcon size={18} />}
          </button>
        </div>
      </div>
    </Card>
  );
}
