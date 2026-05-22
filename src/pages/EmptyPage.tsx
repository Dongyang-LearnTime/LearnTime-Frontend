//준비중인 탭/페이지에 노출하는 준비중 안내 플레이스 홀더 컴포넌트
import { SettingsIcon } from '../components/ui/Icons';

// title: 준비 중인 페이지의 대분류명 또는 제목
export function EmptyPage({ title }: { title: string }) {
  return (
    <div className="flex-grow flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="studio-card max-w-xl w-full flex flex-col items-center text-center">
        { // 회전하는 설정 톱니바퀴 아이콘
        }
        <div className="w-24 h-24 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] flex items-center justify-center mb-10 shadow-inner text-gray-300">
          <SettingsIcon size={40} className="animate-[spin_8s_linear_infinite]" />
        </div>
        { // 페이지 제목 및 준비중 메시지
        }
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tightest uppercase">{title}</h2>
        <p className="text-[0.95rem] text-gray-500 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-widest">이 페이지는 현재 준비 중입니다.<br />곧 더 강력한 기능으로 찾아뵙겠습니다.</p>
        { // 애니메이션 프로그레스 바
        }
        <div className="mt-10 w-full h-1.5 bg-gray-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
          <div className="h-full bg-black dark:bg-white w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
