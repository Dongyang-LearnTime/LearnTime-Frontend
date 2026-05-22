// 홈 화면의 운동/헬스 트레이닝 기능 미리보기 컴포넌트
// 운동 종류별 세트 기록 및 개인 맞춤 피드백 추천 UI를 렌더링함
import { DumbbellIcon } from '../../../ui/Icons';

export const HealthPreview = () => {
  return (
    <div className="grid lg:grid-cols-12 gap-16 items-center mb-40">
      <div className="lg:col-span-5 reveal-left space-y-8 order-2 lg:order-1">
        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20"><DumbbellIcon size={24} /></div>
        <h4 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">운동 효율을 극대화하는 <br /> 스마트 트레이닝</h4>
        <p className="text-gray-500 font-medium leading-relaxed">
          오늘 진행한 운동 부위와 세트를 기록하면 시스템이 당신의 데이터를 분석하여 부족한 부위를 찾아내고 최적의 루틴을 제안합니다.
        </p>
      </div>
      <div className="lg:col-span-7 reveal-right order-1 lg:order-2">
        <div className="relative group float-animation" style={{ animationDelay: '1s' }}>
          <div className="absolute -inset-4 bg-rose-500/10 rounded-[3rem] blur-2xl opacity-50 glow-pulse group-hover:opacity-70 transition-opacity duration-500" />
          <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 card-3d-hover">
            <div className="flex items-center justify-between mb-8">
              <h5 className="text-2xl font-black tracking-tight">운동 랩</h5>
              <div className="flex gap-2">
                {["가슴", "등", "하체", "어깨"].map((p, i) => (
                  <div key={i} className={`px-3 py-1 rounded-lg text-[0.55rem] font-black uppercase ${i === 0 ? 'bg-rose-600 text-white' : 'bg-gray-50 text-gray-400'}`}>{p}</div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="text-[0.6rem] font-black text-rose-500 uppercase tracking-widest block mb-4">가이드</span>
                <p className="text-[0.7rem] font-bold leading-relaxed text-gray-700">현재 대흉근 하부 발달이 상대적으로 부족합니다. 딥스나 디클라인 프레스를 추천합니다.</p>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                  <span className="text-[0.65rem] font-bold">벤치 프레스</span>
                  <span className="text-[0.6rem] font-black text-rose-500 italic">5 SETS</span>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                  <span className="text-[0.65rem] font-bold">덤벨 플라이</span>
                  <span className="text-[0.6rem] font-black text-rose-500 italic">4 SETS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
