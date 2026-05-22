import { PlusIcon } from '../../ui/Icons';

// ScheduleHeader 컴포넌트 Props 정의
interface ScheduleHeaderProps {
  onOpenAddModal: () => void;
}

// 일정 관리 최상단 타이틀 헤더 및 새 일정 추가 동작을 제공하는 컴포넌트
export function ScheduleHeader({ onOpenAddModal }: ScheduleHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 studio-card glow-indigo">
      {
        // 제목 및 서브타이틀
      }
      <div>
        <h2 className="text-4xl font-black tracking-tight mb-2 text-gradient">일정 관리</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">나만의 루틴과 중요한 일정들을 체계적으로 관리하세요.</p>
      </div>

      {
        // 새 일정 추가 단추
      }
      <button 
        onClick={onOpenAddModal}
        className="flex items-center justify-center gap-2 px-8 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20"
      >
        <PlusIcon size={24} />
        <span className="text-lg">새 일정 추가</span>
      </button>
    </header>
  );
}
