// 홈 화면의 모바일 앱 버전 미리보기 컴포넌트
// 스마트폰 목업 프레임 내에 모바일 UI(대시보드, 할 일 완료 여부, 하단 네비게이션)를 시각화함
import { 
  SmartphoneIcon, 
  DumbbellIcon, 
  CalendarIcon, 
  CheckIcon, 
  BookIcon, 
  TargetIcon, 
  PlusIcon, 
  ActivityIcon 
} from '../../../ui/Icons';

export const MobileMockupPreview = () => {
  return (
    <div className="grid lg:grid-cols-12 gap-16 items-center mt-40">
      <div className="lg:col-span-5 reveal-left space-y-8 order-2 lg:order-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md">Coming Soon</span>
        </div>
        <h4 className="text-3xl md:text-5xl font-black uppercase italic leading-tight text-gray-900">언제 어디서나 <br /> 완벽한 연결</h4>
        <p className="text-gray-500 font-medium leading-relaxed">
          Learn-Time의 모든 강력한 기능을 스마트폰에 최적화된 모바일 앱으로 만나보세요.
          이동 중에도 학습 진도를 확인하고 운동 세트를 기록할 수 있습니다.
        </p>
        <div className="pt-4">
          <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] relative overflow-hidden group/notice max-w-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover/notice:scale-150 transition-transform duration-700" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100 shrink-0">
                <SmartphoneIcon size={18} />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">출시 안내 사항</p>
                <p className="text-[0.75rem] font-bold text-indigo-700/80 leading-relaxed">
                  현재 Learn-Time 모바일 앱은 개발 단계에 있습니다. <br />
                  최상의 사용 경험을 위해 실제 출시 여부 및 일정은 <br />
                  예고 없이 변경될 수 있음을 알려드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-7 reveal-right order-1 lg:order-2 flex justify-center">
        <div className="relative group float-animation" style={{ animationDelay: '2s' }}>
          <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[80px] opacity-50 glow-pulse group-hover:opacity-70 transition-opacity duration-500" />
          
          {/* Phone Mockup Frame */}
          <div className="relative w-[300px] h-[620px] bg-black rounded-[3rem] p-2.5 shadow-2xl shadow-indigo-500/20 card-3d-hover">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-2xl z-20" /> {/* Notch */}
            
            {/* Phone Screen */}
            <div className="w-full h-full bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden flex flex-col relative">
              
              {/* Status Bar */}
              <div className="h-12 flex items-end justify-between px-6 pb-2 text-white z-10">
                <span className="text-[0.6rem] font-bold">9:41</span>
                <div className="flex gap-1.5 items-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 px-5 py-2 space-y-5 overflow-y-auto hide-scrollbar pb-24">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-[0.6rem]">LT</div>
                    <span className="text-white font-black text-lg italic tracking-tight">Hello, Alex</span>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full border border-white/20" />
                </div>

                {/* Study Ring */}
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                  <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest mb-4">Today's Focus</div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">76%</span>
                        <span className="text-[0.55rem] text-gray-400 font-bold uppercase">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise List */}
                <div className="space-y-3">
                  <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest px-1">Evening Routine</div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center"><DumbbellIcon size={14} /></div>
                      <span className="text-white font-bold text-xs">Chest & Triceps</span>
                    </div>
                    <CheckIcon size={16} className="text-emerald-400" />
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center"><CalendarIcon size={14} /></div>
                      <span className="text-white font-bold text-xs">Read 20 pages</span>
                    </div>
                    <div className="w-4 h-4 border border-white/20 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-between px-8 pb-4 pt-2">
                <BookIcon size={20} className="text-indigo-500" />
                <TargetIcon size={20} className="text-gray-500" />
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white -mt-8 shadow-lg shadow-indigo-500/30 ring-4 ring-[#0a0a0a]">
                  <PlusIcon size={20} />
                </div>
                <ActivityIcon size={20} className="text-gray-500" />
                <CalendarIcon size={20} className="text-gray-500" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
