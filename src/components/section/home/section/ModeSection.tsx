// 홈 화면의 3가지 핵심 모드(Study, Health, God-Life)별 특화 기능 리스트 섹션 컴포넌트
import { BookIcon, DumbbellIcon, LayersIcon } from '../../../ui/Icons';

const MODES = [
  {
    title: "Study Mode",
    icon: <BookIcon size={32} />,
    color: "border-indigo-500",
    features: ["스마트 자동 진도 추천", "학습 취약점 분석", "목표 달성 시각화", "자동 문제 생성"]
  },
  {
    title: "Health Mode",
    icon: <DumbbellIcon size={32} />,
    color: "border-rose-500",
    features: ["일일 운동 및 세트 기록", "맞춤 부족 부위 추천", "섭취 칼로리 자동 계산", "유튜브 운동 가이드"]
  },
  {
    title: "God-Life Mode",
    icon: <LayersIcon size={32} />,
    color: "border-emerald-500",
    features: ["일정 체크리스트", "데일리 루틴 제안", "우선순위 관리", "습관 형성 트래킹"]
  }
];

export const ModeSection = () => {
  return (
    <section id="modes" className="relative min-h-screen w-full snap-start flex items-center justify-center bg-[#050505] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="reveal-content mb-20 text-center">
          <h3 className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Customized Experience</h3>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">모드별 특화 기능</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MODES.map((mode, i) => (
            <div
              key={i}
              className={`reveal-content card-3d-hover group p-10 bg-white/[0.04] backdrop-blur-xl border ${mode.color} border-opacity-30 rounded-[3rem] hover:bg-white/[0.08] transition-all duration-500 relative overflow-hidden`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Background Glow */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] opacity-20 transition-opacity group-hover:opacity-40 ${mode.color.replace('border-', 'bg-')}`} />

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl ${mode.color.replace('border-', 'bg-').replace('-500', '-600/20')} border border-white/10`}>
                <div className={mode.color.replace('border-', 'text-')}>
                  {mode.icon}
                </div>
              </div>
              <h4 className="text-2xl font-black mb-6 uppercase italic text-white">{mode.title}</h4>
              <ul className="space-y-4">
                {mode.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-semibold text-gray-200">
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] ${mode.color.replace('border-', 'bg-')}`} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
