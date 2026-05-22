import { CheckIcon, ActivityIcon, StarIcon } from '../../ui/Icons';
import { ScheduleCard } from './ScheduleCard';
import type { Schedule } from './types';

// 일정 박스들에서 공용으로 사용되는 Props 정의
interface ScheduleBoxProps {
  schedules: Schedule[];
  onToggleComplete: (id: string) => void;
  onOpenEdit: (item: Schedule) => void;
  onDelete: (id: string) => void;
}

// 오늘의 일정 박스 컴포넌트
export function TodayScheduleBox({
  schedules,
  onToggleComplete,
  onOpenEdit,
  onDelete,
}: ScheduleBoxProps) {
  return (
    <section className="studio-card !p-6 flex flex-col flex-grow min-h-[250px]">
      {
        // 박스 헤더 영역
      }
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black flex items-center gap-2">
          <CheckIcon className="text-emerald-500 bg-emerald-500/10 p-1 rounded-md" size={24} />
          오늘의 일정
        </h3>
        <span className="text-[10px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg">Today</span>
      </div>

      {
        // 일정 리스트 영역
      }
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
        {schedules.map(item => (
          <ScheduleCard 
            key={item.id} 
            item={item} 
            onToggleComplete={onToggleComplete}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
          />
        ))}
        {schedules.length === 0 && (
          <div className="text-center py-6 opacity-30">
            <p className="text-[10px] font-bold">오늘 예정된 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// 나의 루틴 박스 컴포넌트 (체크박스 미노출)
export function RoutineScheduleBox({
  schedules,
  onToggleComplete,
  onOpenEdit,
  onDelete,
}: ScheduleBoxProps) {
  return (
    <section className="studio-card !p-6 flex flex-col flex-grow min-h-[250px]">
      {
        // 박스 헤더 영역
      }
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black flex items-center gap-2">
          <ActivityIcon className="text-indigo-500" />
          나의 루틴
        </h3>
        <span className="text-[10px] font-black px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg">Daily</span>
      </div>

      {
        // 루틴 리스트 영역
      }
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
        {schedules.map(item => (
          <ScheduleCard 
            key={item.id} 
            item={item} 
            showCheck={false}
            onToggleComplete={onToggleComplete}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
          />
        ))}
        {schedules.length === 0 && (
          <div className="text-center py-6 opacity-30">
            <p className="text-[10px] font-bold">등록된 루틴이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// 주요 일정 박스 컴포넌트 (체크박스 미노출, 별표 위주)
export function MajorScheduleBox({
  schedules,
  onToggleComplete,
  onOpenEdit,
  onDelete,
}: ScheduleBoxProps) {
  return (
    <section className="studio-card !p-6 flex flex-col flex-grow min-h-[250px]">
      {
        // 박스 헤더 영역
      }
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black flex items-center gap-2">
          <StarIcon className="text-amber-500 fill-amber-500" />
          주요 일정
        </h3>
        <span className="text-[10px] font-black px-2 py-1 bg-amber-500/10 text-amber-500 rounded-lg">Star</span>
      </div>

      {
        // 주요 일정 리스트 영역
      }
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
        {schedules.map(item => (
          <ScheduleCard 
            key={item.id} 
            item={item} 
            showCheck={false}
            onToggleComplete={onToggleComplete}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
          />
        ))}
        {schedules.length === 0 && (
          <div className="text-center py-6 opacity-30">
            <p className="text-[10px] font-bold">주요 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
