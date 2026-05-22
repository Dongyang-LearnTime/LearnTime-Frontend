import { SparklesIcon, ClockIcon, ActivityIcon } from '../../ui/Icons';

// Gemini AI가 일정 데이터와 주변 조건(교통, 기상 등)을 연산하여 추천/알림을 띄우는 컴포넌트
export function AiInsightsBox() {
  return (
    <section className="relative overflow-hidden studio-card !p-0 border-none bg-gradient-to-r from-indigo-600/10 via-purple-500/10 to-indigo-600/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-indigo-500/20">
      {
        // 배경 블러 데코레이션
      }
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl -z-10" />
      
      {
        // 분석 카드 상세 레이아웃
      }
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        {
          // 좌측 AI 전용 펄스 이펙트 아이콘
        }
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 shrink-0 animate-pulse">
          <SparklesIcon size={32} />
        </div>

        {
          // 분석 인사이트 본문 영역
        }
        <div className="flex-grow space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center justify-center md:justify-start gap-2">
            Gemini AI Insights
            <span className="px-2 py-0.5 bg-indigo-500/10 rounded-md text-[10px] font-black uppercase tracking-widest">Premium</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {
              // 추천 1: 교통 혼잡 예측 정보
            }
            <div className="flex items-start gap-3 bg-white/50 dark:bg-black/30 p-4 rounded-2xl border border-white/50 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-1">
                <ClockIcon size={16} />
              </div>
              <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300">
                오후 2시 <span className="text-indigo-600 dark:text-indigo-400">졸업 프로젝트 회의</span> 장소 주변이 평소보다 혼잡합니다. 15분 일찍 출발하시는 것을 권장합니다.
              </p>
            </div>

            {
              // 추천 2: 기상 변화 안내 정보
            }
            <div className="flex items-start gap-3 bg-white/50 dark:bg-black/30 p-4 rounded-2xl border border-white/50 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                <ActivityIcon size={16} />
              </div>
              <p className="text-sm font-bold leading-relaxed text-gray-700 dark:text-gray-300">
                저녁부터 기온이 <span className="text-blue-600 dark:text-blue-400">3도 이상</span> 떨어질 예정입니다. 퇴근길을 위해 따뜻한 겉옷을 챙기시는 것이 좋겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
