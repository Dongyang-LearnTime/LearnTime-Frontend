import { useMemo } from 'react';
import { CalendarIcon } from '../../ui/Icons';
import { DAYS, HOLIDAYS_2026_05 } from './constants';

// CalendarBox 컴포넌트 Props 정의
interface CalendarBoxProps {
  currentYear: number;
  currentMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (day: number) => void;
  calendarNotes: Record<string, string>;
}

// 달력을 렌더링하고, 기념일 및 각 날짜의 커스텀 메모를 요약해서 표시해주는 달력 카드 컴포넌트
export function CalendarBox({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  calendarNotes,
}: CalendarBoxProps) {
  // 월별 일수 계산
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // 해당 월 1일의 시작 요일 인덱스 계산
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  return (
    <div className="xl:col-span-2 studio-card h-full">
      {
        // 상단 제어바: 현재 월 이름 및 이전/다음 월 토글 버튼
      }
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <CalendarIcon size={24} />
          </div>
          {currentYear}년 {currentMonth + 1}월
        </h3>
        <div className="flex gap-2 bg-gray-50 dark:bg-[#111] p-1.5 rounded-2xl border border-gray-100 dark:border-[#1a1a1a]">
          <button 
            onClick={onPrevMonth}
            className="px-4 py-2 hover:bg-white dark:hover:bg-[#1a1a1a] rounded-xl font-bold transition-all text-sm"
          >
            이전
          </button>
          <button 
            onClick={onNextMonth}
            className="px-4 py-2 hover:bg-white dark:hover:bg-[#1a1a1a] rounded-xl font-bold transition-all text-sm"
          >
            다음
          </button>
        </div>
      </div>
      
      {
        // 캘린더 일별 그리드 영역
      }
      <div className="grid grid-cols-7 gap-4 text-center">
        {
          // 요일 표시행
        }
        {DAYS.map((day, idx) => (
          <div 
            key={day} 
            className={`text-[0.65rem] font-black uppercase tracking-widest py-4 ${idx === 0 ? 'text-red-500' : 'text-gray-400'}`}
          >
            {day}
          </div>
        ))}
        
        {
          // 1일 이전의 빈 그리드 채우기
        }
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {
          // 각 일자별 그리드 아이템 렌더링
        }
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const isToday = dateStr === '2026-05-07'; // 목업 상 오늘 지정일
          const dayOfWeek = (i + firstDayOfMonth) % 7; 
          const isSunday = dayOfWeek === 0;
          const holidayName = currentMonth === 4 ? HOLIDAYS_2026_05[day] : null;
          const isHoliday = !!holidayName || isSunday;
          const note = calendarNotes[dateStr];

          return (
            <div 
              key={i} 
              onClick={() => onDayClick(day)}
              className={`aspect-square p-3 rounded-[1.5rem] border transition-all cursor-pointer flex flex-col items-start justify-between group relative overflow-hidden
                ${isToday 
                  ? 'bg-black dark:bg-white border-black dark:border-white shadow-2xl shadow-indigo-500/20 scale-105 z-10' 
                  : 'bg-transparent border-gray-50 dark:border-[#111] hover:bg-gray-50 dark:hover:bg-[#0a0a0a] hover:border-gray-200 dark:hover:border-[#222]'}
              `}
            >
              <div className="flex flex-col w-full">
                <span className={`text-base font-black ${isToday ? 'text-white dark:text-black' : isHoliday ? 'text-red-500' : 'text-gray-900 dark:text-gray-100 opacity-60 group-hover:opacity-100'}`}>
                  {day}
                </span>
                {holidayName && (
                  <span className="text-[8px] font-black text-red-400 truncate w-full">{holidayName}</span>
                )}
                {note && (
                  <span className={`text-[9px] font-bold mt-1 truncate w-full px-1.5 py-0.5 rounded-md ${isToday ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
                    {note}
                  </span>
                )}
              </div>
              
              {
                // 목업 더미용 점 표시 (7, 12, 20일)
              }
              {(day === 7 || day === 12 || day === 20) && currentMonth === 4 && (
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white/50' : 'bg-indigo-500'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
