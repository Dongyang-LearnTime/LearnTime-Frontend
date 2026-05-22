// 홈 화면의 캘린더 기능 미리보기 컴포넌트
// 일정 달력 및 시간별 일정 상세 목록 UI를 시각화함
import { CalendarIcon, ClockIcon } from '../../../ui/Icons';

export const CalendarPreview = () => {
  return (
    <div className="grid lg:grid-cols-12 gap-16 items-center mb-40">
      <div className="lg:col-span-7 reveal-left">
        <div className="relative group float-animation" style={{ animationDelay: '2s' }}>
          <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-2xl opacity-50 glow-pulse group-hover:opacity-70 transition-opacity duration-500" />
          <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 card-3d-hover">
            <div className="flex items-center justify-between mb-8">
              <h5 className="text-2xl font-black tracking-tight">일정 관리</h5>
              <div className="text-[0.6rem] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">May 2026</div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-[0.55rem] font-black text-center text-gray-300">{d}</div>
              ))}
              {[...Array(14)].map((_, i) => (
                <div key={i} className={`aspect-square flex items-center justify-center text-[0.65rem] font-black rounded-lg ${i === 12 ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400'}`}>{i + 1}</div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <ClockIcon size={16} />
                <span className="text-[0.7rem] font-black">14:00 - 알고리즘 문제 풀이 (2시간)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5 reveal-right space-y-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><CalendarIcon size={24} /></div>
        <h4 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">빈틈없는 성장을 위한 <br /> 정교한 일정 설계</h4>
        <p className="text-gray-500 font-medium leading-relaxed">
          학습과 운동 뿐만 아니라 당신의 모든 일과를 체계적으로 관리하세요. 캘린더 기능을 통해 나만의 루틴을 최적화할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
