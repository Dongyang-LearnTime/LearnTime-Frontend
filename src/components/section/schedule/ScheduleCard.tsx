import { CheckIcon, ClockIcon, EditIcon, TrashIcon } from '../../ui/Icons';
import type { Schedule } from './types';
import { DAYS } from './constants';

// ScheduleCard 컴포넌트 Props 정의
interface ScheduleCardProps {
  item: Schedule;
  showCheck?: boolean;
  onToggleComplete: (id: string) => void;
  onOpenEdit: (item: Schedule) => void;
  onDelete: (id: string) => void;
}

// 개별 일정 또는 반복 루틴 정보를 보여주는 개별 일정 카드 컴포넌트
export function ScheduleCard({
  item,
  showCheck = true,
  onToggleComplete,
  onOpenEdit,
  onDelete,
}: ScheduleCardProps) {
  return (
    <div 
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
        ${item.completed 
          ? 'bg-gray-50 dark:bg-[#050505] border-transparent opacity-40 grayscale' 
          : item.type === 'routine'
            ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 hover:border-indigo-500/50'
            : 'bg-white dark:bg-[#0d0d0d] border-gray-100 dark:border-[#1a1a1a] hover:border-indigo-500/30'}
      `}
    >
      {
        // 완료 체크 버튼 (showCheck 활성화 시에만 렌더링)
      }
      {showCheck && (
        <button 
          onClick={() => onToggleComplete(item.id)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
            ${item.completed ? 'bg-indigo-500 border-indigo-500 scale-90' : 'border-gray-200 dark:border-[#222] hover:border-indigo-500'}
          `}
        >
          {item.completed && <CheckIcon size={14} />}
        </button>
      )}
      
      {
        // 일정 상세 타이틀 및 시간, 반복 정보
      }
      <div className="flex-grow min-w-0">
        <h4 className={`font-black text-[0.95rem] truncate ${item.completed ? 'line-through text-gray-400' : ''}`}>
          {item.title}
        </h4>
        <div className="flex flex-col gap-0.5 mt-1">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[0.65rem] uppercase tracking-tight">
            <ClockIcon size={10} />
            <span>{item.startTime} - {item.endTime}</span>
          </div>
          {item.type === 'routine' && item.repeatDays && (
            <div className="flex gap-0.5 mt-0.5">
              {DAYS.map((d, i) => (
                <span 
                  key={i} 
                  className={`text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-sm ${item.repeatDays?.includes(i) ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400'}`}
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {
        // 호버 시 노출되는 수정 / 삭제 액션 단추 그룹
      }
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button 
          onClick={() => onOpenEdit(item)}
          className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-all"
        >
          <EditIcon size={14} />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
}
