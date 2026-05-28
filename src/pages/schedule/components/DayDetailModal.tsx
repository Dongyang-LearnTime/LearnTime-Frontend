import { XIcon, CalendarIcon } from '../../../components/ui/Icons';
import { ScheduleCard } from './ScheduleCard';
import type { Schedule } from '../types/scheduleTypes';
import { DAYS } from '../types/constants';
import * as holidaysKr from '@hyunbinseo/holidays-kr';

// DayDetailModal 컴포넌트 Props 정의
interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number | null;
  currentYear: number;
  currentMonth: number;
  calendarNotes: Record<string, string>;
  updateCalendarNote: (day: number, note: string) => void;
  selectedDaySchedules: Schedule[];
  onOpenAddModal: (dateStr: string) => void;
  onToggleComplete: (id: string) => void;
  onOpenEdit: (item: Schedule) => void;
  onDelete: (id: string) => void;
}

// 특정 날짜의 메모와 해당 날짜에 예정된 상세 일정을 확인 및 관리할 수 있는 모달 컴포넌트
export function DayDetailModal({
  isOpen,
  onClose,
  selectedDay,
  currentYear,
  currentMonth,
  selectedDaySchedules,
  onOpenAddModal,
  onToggleComplete,
  onOpenEdit,
  onDelete,
}: DayDetailModalProps) {
  if (!isOpen || selectedDay === null) return null;

  // 날짜별 키 생성
  const dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
  
  // 영어 월 표시를 위한 날짜 객체
  const monthDate = new Date(currentYear, currentMonth, 1);
  const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(monthDate).toUpperCase();
  
  // 공휴일 확인
  const yearKey = `y${currentYear}` as keyof typeof holidaysKr;
  const yearHolidays = holidaysKr[yearKey] as Record<string, readonly string[]> | undefined;
  const holidayNames = yearHolidays ? yearHolidays[dateKey as keyof typeof yearHolidays] : undefined;
  const holidayName = holidayNames && holidayNames.length > 0 ? holidayNames[0] : null;

  // 요일명 계산
  const dayOfWeekIndex = new Date(currentYear, currentMonth, selectedDay).getDay();
  const dayOfWeekName = DAYS[dayOfWeekIndex];

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-xl rounded-[3.5rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        {
          // 모달 헤더 영역
        }
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-[0.6rem] font-black uppercase tracking-tighter opacity-70">
                {monthShort}
              </span>
              <span className="text-2xl font-black">{selectedDay}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">{currentYear}년 {currentMonth + 1}월 {selectedDay}일</h3>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{dayOfWeekName}요일 일정</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-gray-50 dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-2xl text-gray-400 transition-all"
          >
            <XIcon size={20} />
          </button>
        </header>



        {
          // 상세 일정 목록 영역
        }
        <div className="space-y-4 max-h-100 overflow-y-auto pr-4 custom-scrollbar">
          <h4 className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">상세 일정 목록</h4>
          
          {holidayName && (
            <div className="flex flex-col gap-3 p-5 rounded-3xl transition-all cursor-default bg-red-50/50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-500 dark:bg-red-900/50 dark:text-red-400">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <h5 className="font-black text-base text-red-600 dark:text-red-400 leading-tight">
                    {holidayName} <span className="text-xs font-bold opacity-70 ml-1">(공휴일)</span>
                  </h5>
                </div>
              </div>
            </div>
          )}

          {selectedDaySchedules.length > 0 ? (
            selectedDaySchedules.map(item => (
              <ScheduleCard 
                key={item.id} 
                item={item} 
                onToggleComplete={onToggleComplete}
                onOpenEdit={onOpenEdit}
                onDelete={onDelete}
              />
            ))
          ) : !holidayName ? (
            <div className="py-10 text-center">
              <CalendarIcon size={32} className="mx-auto text-gray-100 dark:text-[#111] mb-4" />
              <p className="text-gray-400 font-bold text-sm">이날 예정된 일정이 없습니다.</p>
            </div>
          ) : null}
        </div>

        {
          // 일정 추가 액션 버튼
        }
        <div className="mt-10">
          <button 
            onClick={() => {
              onClose();
              onOpenAddModal(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`);
            }}
            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-4xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            이날에 새 일정 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
