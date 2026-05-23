import { useNavigate } from 'react-router-dom';
import { BookIcon, PlusIcon } from '../../../components/ui/Icons';

export default function StudyEmptyPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-gray-50 dark:bg-[#111] rounded-3xl flex items-center justify-center text-gray-300 dark:text-gray-700 mb-8 shadow-inner">
        <BookIcon size={48} />
      </div>
      
      <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
        현재 진행 중인 공부가 없습니다.
      </h2>
      
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
        새로운 스터디를 생성하고 일정과 목표를 세워보세요. 
        Learn-Time이 당신의 학습 메이트가 되어드릴게요!
      </p>
      
      <button
        onClick={() => navigate('/study/plan/create')}
        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all duration-300"
      >
        <PlusIcon size={18} />
        새로운 공부 일정 생성하기
      </button>
    </div>
  );
}
