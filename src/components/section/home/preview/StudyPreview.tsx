// 홈 화면의 학습 스튜디오 기능 미리보기 컴포넌트
// 핵심 학습 지표(시간, 달성률 등)의 그래프 및 오늘 공부 진도 체크리스트 UI를 제공함
import { CheckIcon, ActivityIcon } from '../../../ui/Icons';

export const StudyPreview = () => {
  return (
    <div className="grid lg:grid-cols-12 gap-16 items-center mb-40">
      <div className="lg:col-span-7 reveal-left">
        <div className="relative group float-animation" style={{ animationDelay: '0s' }}>
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-2xl opacity-50 glow-pulse group-hover:opacity-70 transition-opacity duration-500" />
          <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 card-3d-hover">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h5 className="text-2xl font-black tracking-tight">학습 스튜디오</h5>
                <p className="text-xs text-gray-400 font-bold mt-1">스마트하고 효율적인 학습 몰입 환경</p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[0.6rem] font-black uppercase tracking-widest text-gray-400 border border-gray-100">기간 설정 필요</div>
                <div className="px-4 py-2 bg-black text-white rounded-xl text-[0.6rem] font-black uppercase tracking-widest">+ 진도 추가</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h6 className="text-[0.6rem] font-black uppercase tracking-widest text-indigo-600">핵심 지표</h6>
                <div className="space-y-5">
                  {[
                    { name: "총 공부 시간", p: 75, color: "bg-indigo-600" },
                    { name: "진도 달성률", p: 64, color: "bg-indigo-600" },
                    { name: "문제 오답률", p: 24, color: "bg-indigo-600" }
                  ].map((m, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[0.65rem] font-bold">
                        <span>{m.name}</span>
                        <span>{m.p}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <h6 className="text-[0.6rem] font-black uppercase tracking-widest text-gray-400 mb-4">오늘의 진도</h6>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center"><CheckIcon size={12} className="text-white" /></div>
                    <span className="text-[0.7rem] font-bold text-gray-400 line-through italic">1장: 미적분 기초</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="w-5 h-5 border-2 border-gray-100 rounded-md" />
                    <span className="text-[0.7rem] font-bold">2장: 도함수의 활용</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5 reveal-right space-y-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"><ActivityIcon size={24} /></div>
        <h4 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">데이터로 증명하는 <br /> 당신의 몰입도</h4>
        <p className="text-gray-500 font-medium leading-relaxed">
          주간 몰입도 리포트와 핵심 지표 대시보드를 통해 학습 성과를 실시간으로 모니터링하세요. 데이터가 당신의 성장을 수치로 증명합니다.
        </p>
      </div>
    </div>
  );
};
