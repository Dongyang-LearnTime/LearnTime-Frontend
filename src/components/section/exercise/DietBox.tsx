// ============================================================
// components/section/exercise/DietBox.tsx
// 식단(영양) 관리 카드.
// ============================================================
import { useState } from 'react';
import { CoffeeIcon, PlusIcon, TrashIcon } from '../../ui/Icons';
import { Card, CardTitle } from '../../common/Card';

type MealItem = {
  id: string;
  name: string;
  amount: string;
  cal: number;
  carbs: number;   // 탄수화물
  protein: number; // 단백질
  fat: number;     // 지방
};
type MealRecord = Record<string, MealItem[]>;

const MEALS = ['아침', '점심', '저녁'] as const;

const INITIAL_ITEMS: MealRecord = {
  아침: [
    { id: '1', name: '계란', amount: '100', cal: 155, carbs: 1, protein: 13, fat: 11 },
    { id: '2', name: '토스트', amount: '50', cal: 133, carbs: 25, protein: 4, fat: 2 },
  ],
  점심: [],
  저녁: [],
};

export function DietBox() {
  const [tab, setTab] = useState<string>('아침');
  const [items, setItems] = useState<MealRecord>(INITIAL_ITEMS);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // 현재 탭 합계
  const current = items[tab];
  const currentCal = current.reduce((acc, cur) => acc + cur.cal, 0);

  // 일일 총합 계산
  const dailyTotals = Object.values(items).flat().reduce((acc, cur) => ({
    cal: acc.cal + cur.cal,
    carbs: acc.carbs + cur.carbs,
    protein: acc.protein + cur.protein,
    fat: acc.fat + cur.fat,
  }), { cal: 0, carbs: 0, protein: 0, fat: 0 });

  const addItem = () => {
    if (!name.trim() || !amount) return;
    const randomCal = Math.floor(Math.random() * 300) + 100;
    const newItem: MealItem = {
      id: Date.now().toString(),
      name,
      amount,
      cal: randomCal,
      carbs: Math.floor(randomCal * 0.1),
      protein: Math.floor(randomCal * 0.05),
      fat: Math.floor(randomCal * 0.02)
    };
    setItems(prev => ({ ...prev, [tab]: [...prev[tab], newItem] }));
    setName('');
    setAmount('');
  };

  const removeItem = (id: string) =>
    setItems(prev => ({ ...prev, [tab]: prev[tab].filter(item => item.id !== id) }));

  return (
    <Card className="flex flex-col h-full glow-rose border-t-4 border-rose-500 min-h-[650px]">
      <CardTitle icon={<CoffeeIcon size={18} />}>In & Out 식단</CardTitle>

      {/* 일일 총 섭취 요약 배너 */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-[#0d0d0d] rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">일일 총 섭취</span>
          <span className="text-xl font-black text-rose-500 tracking-tighter">{dailyTotals.cal} <span className="text-[0.7rem] opacity-70">KCAL</span></span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '탄수화물', value: dailyTotals.carbs, color: 'text-amber-500' },
            { label: '단백질', value: dailyTotals.protein, color: 'text-emerald-500' },
            { label: '지방', value: dailyTotals.fat, color: 'text-rose-500' },
          ].map(m => (
            <div key={m.label} className="text-center p-3 bg-white dark:bg-[#050505] rounded-2xl border border-gray-50 dark:border-[#111]">
              <p className="text-[0.6rem] font-black text-gray-400 mb-1">{m.label}</p>
              <p className={`text-sm font-black ${m.color}`}>{m.value}g</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meal tab selector */}
      <div className="flex gap-3 mb-8 bg-gray-50 dark:bg-[#050505] p-1.5 rounded-2xl border border-gray-100 dark:border-[#1a1a1a]">
        {MEALS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-[0.65rem] font-black uppercase tracking-widest rounded-xl transition-all ${tab === t ? 'bg-white dark:bg-[#1a1a1a] text-rose-600 shadow-lg' : 'text-gray-400 hover:text-rose-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Food list */}
      <div className="space-y-3 mb-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {current.length === 0 && <p className="text-xs text-gray-400 font-medium italic text-center mt-10">기록된 식단이 없습니다.</p>}
        {current.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] p-4 rounded-2xl hover:border-rose-200 transition-all group">
            <div className="min-w-0 flex-grow mr-4">
              <span className="text-sm font-black text-gray-800 dark:text-gray-200 block truncate">{item.name}</span>
              <div className="flex gap-2 mt-1">
                <span className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">{item.amount}g</span>
                <span className="text-[0.6rem] font-black text-rose-500/60 uppercase tracking-widest">탄{item.carbs} 단{item.protein} 지{item.fat}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm font-black font-mono text-gray-900 dark:text-white">{item.cal} <span className="text-[0.6rem] text-gray-400">KCAL</span></span>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><TrashIcon size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      <div className="flex flex-col gap-2 mb-8">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="음식명" className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
        <div className="flex gap-2">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="중량 (g)" className="flex-grow bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
          <button onClick={addItem} className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center active:scale-95 shadow-xl shadow-rose-500/10 shrink-0"><PlusIcon size={18} /></button>
        </div>
      </div>

      {/* Current Tab Banner */}
      <div className="bg-rose-600 p-5 rounded-2xl flex justify-between items-center shadow-2xl shadow-rose-500/10">
        <span className="text-[0.6rem] font-black text-rose-100 uppercase tracking-[0.2em]">{tab} 합계</span>
        <div className="text-xl font-black text-white tracking-tightest">{currentCal} <span className="text-[0.6rem] opacity-50 ml-1">KCAL</span></div>
      </div>
    </Card>
  );
}
