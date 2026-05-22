// 홈 화면의 게이미피케이션(포인트, 랭킹, 뱃지 등) 시스템 소개 섹션 컴포넌트
import { CheckIcon, TrophyIcon, TrendIcon, RocketIcon } from '../../../ui/Icons';

const GAMIFICATION_ITEMS = [
  { label: "포인트 시스템", value: "Success Points", desc: "진도 달성, 운동 완료 시 차등 포인트 지급", icon: <CheckIcon size={24} /> },
  { label: "실시간 랭킹", value: "Global Ranking", desc: "전체 사용자 및 그룹 내 실시간 순위 산정", icon: <TrophyIcon size={24} /> },
  { label: "성취도 가시화", value: "Visual Stack Up", desc: "포인트 기반으로 뱃지, 아이템 제공", icon: <TrendIcon size={24} /> },
  { label: "루틴 보너스", value: "Streak Bonus", desc: "루틴 성공 시 추가 10 포인트 보너스 지급", icon: <RocketIcon size={24} /> }
];

export const GamificationSection = () => {
  return (
    <section id="gamification" className="relative min-h-screen w-full snap-start bg-[#050505] text-white flex items-center justify-center py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="reveal-content mb-16 text-center space-y-4">
          <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.5em]">Stack Up System</h3>
          <h4 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">GAMIFICATION: 성장의 즐거움</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {GAMIFICATION_ITEMS.map((item, i) => (
            <div
              key={i}
              className="reveal-content card-3d-hover group p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-indigo-500/5">
                {item.icon}
              </div>
              <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">{item.label}</div>
              <div className="text-2xl font-black mb-4 uppercase italic tracking-tight text-white">{item.value}</div>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
