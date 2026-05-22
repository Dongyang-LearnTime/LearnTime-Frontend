// 운동 랩 하위 위젯 컴포넌트 모음
// 포함 컴포넌트: ExerciseGuideBox, AiExerciseGuideBox, TrainingSessionBox, BodyCompositionBox, ExerciseDashboardBox
import { SparklesIcon, DumbbellIcon, TargetIcon, TrendIcon, PlayCircleIcon } from '../../ui/Icons';
import { Card, CardTitle } from '../../common/Card';
import { InfoCard } from '../../common/InfoCard';
import { FieldInput } from '../../common/FieldInput';
import { BarChart } from '../../common/BarChart';
import { useState } from 'react';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const WEEKLY_DATA = [50, 60, 55, 80, 70, 95, 60];
const BODY_PARTS = ['가슴', '등', '어깨', '이두', '삼두', '하체'];

const VIDEO_IDS: Record<string, string> = {
  '가슴': 'z-v7r_e3oI0', // 벤치프레스
  '등': 'vE_8_H_y_Yc', // 데드리프트
  '어깨': 'YpW5f-4N6Fk', // 밀리터리 프레스
  '이두': '97I8Yx-4H_o', // 바벨 컬
  '삼두': 'p9Kj_C_j_2M', // 킥백
  '하체': '_h7p66_O7v8'  // 스쿼트
};

export function ExerciseGuideBox() {
  const [active, setActive] = useState('가슴');
  return (
    <Card className="flex flex-col h-full border-t-4 border-rose-500 min-h-[500px]">
      <CardTitle icon={<PlayCircleIcon size={18} />}>오늘의 운동부위 영상</CardTitle>
      <div className="flex flex-wrap gap-2 mb-8">
        {BODY_PARTS.map(p => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all ${active === p ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-[#111] text-gray-400 hover:text-rose-600 border border-gray-100 dark:border-[#1a1a1a]'}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex-grow bg-black rounded-[2rem] overflow-hidden relative aspect-video shadow-2xl">
        <iframe
          key={active}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${VIDEO_IDS[active]}`}
          title={`${active} 운동 가이드`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        ></iframe>
      </div>
      <p className="text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 mt-6">{active} 테크닉 마스터 클래스</p>
    </Card>
  );
}

export function AiExerciseGuideBox() {
  return (
    <Card className="flex flex-col h-full border-t-4 border-rose-500">
      <CardTitle icon={<SparklesIcon size={18} />}>AI 운동 제안</CardTitle>
      <p className="text-[0.65rem] font-medium text-gray-400 mb-6 px-1 leading-relaxed">
        * 기록된 식단, 신체 기록, 트레이닝 로그를 종합적으로 통계 분석하여 최적의 운동 솔루션을 제안합니다.
      </p>
      <div className="space-y-6 flex-grow flex flex-col justify-center">
        <InfoCard icon={<DumbbellIcon size={20} />} title="최적화 제안" text="삼두 볼륨이 부족합니다. 중량 딥스 3세트 추가를 권장합니다." iconColor="text-rose-500" hoverBg="hover:bg-rose-50 dark:hover:bg-rose-950/20" />
        <InfoCard icon={<TargetIcon size={20} />} title="목표 분석" text="가슴 근비대 정체기입니다. 벤치프레스 중량을 2.5kg 증량하세요." iconColor="text-rose-500" hoverBg="hover:bg-rose-50 dark:hover:bg-rose-950/20" />
        <InfoCard icon={<TrendIcon size={20} />} title="신체 변화" text="등 근육 발달이 우수합니다. 데드리프트를 루틴에 추가해 보세요." iconColor="text-rose-500" hoverBg="hover:bg-rose-50 dark:hover:bg-rose-950/20" />
      </div>
    </Card>
  );
}

export function TrainingSessionBox() {
  return (
    <Card className="h-full glow-rose border-t-4 border-rose-500 flex flex-col">
      <CardTitle icon={<DumbbellIcon size={18} />}>오늘의 운동 기록</CardTitle>

      <div className="space-y-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">운동 시간</label>
            <div className="relative">
              <input type="number" defaultValue="0" className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 text-lg font-black outline-none focus:ring-2 focus:ring-rose-500 transition-all pr-12" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-gray-400 uppercase">분</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">오늘의 강도</label>
            <div className="flex gap-2">
              {['Low', 'Mid', 'High'].map(lv => (
                <button key={lv} className="flex-grow py-3 border border-gray-100 dark:border-[#1a1a1a] rounded-xl text-[0.65rem] font-black uppercase tracking-tighter hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 transition-all">{lv}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">트레이닝 노트</label>
          <textarea
            placeholder="오늘의 집중도, 세트 구성, 신체 반응을 기록하세요..."
            className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] p-6 text-sm text-gray-800 dark:text-gray-200 min-h-[120px] outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium leading-relaxed resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button className="py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl shadow-rose-500/10">세션 완료 및 저장</button>
        <button className="py-4 border border-gray-100 dark:border-[#1a1a1a] text-gray-500 rounded-2xl text-sm font-black active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-[#0a0a0a]">초기화</button>
      </div>
    </Card>
  );
}

export function BodyCompositionBox() {
  return (
    <Card className="h-full border-t-4 border-rose-500">
      <CardTitle icon={<TrendIcon size={18} />}>My Body</CardTitle>
      <div className="space-y-6 mb-10">
        <FieldInput label="체중 (kg)" type="number" placeholder="0.0" step="0.1" focusColor="focus:ring-rose-500" />
        <FieldInput label="체지방률 (%)" type="number" placeholder="0.0" step="0.1" focusColor="focus:ring-rose-500" />
        <FieldInput label="골격근량 (kg)" type="number" placeholder="0.0" step="0.1" focusColor="focus:ring-rose-500" />
      </div>
      <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl shadow-rose-500/10">데이터 업데이트</button>
    </Card>
  );
}

export function ExerciseDashboardBox({ onViewReport }: { onViewReport?: () => void }) {
  return (
    <Card className="p-10 border-t-4 border-rose-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tightest uppercase">트레이닝 인텔리전스</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">고정밀 신체 데이터 추적 및 분석 시스템.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onViewReport}
            className="flex-1 md:flex-none text-[0.6rem] font-black uppercase tracking-[0.2em] px-8 py-4 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:bg-rose-50 dark:hover:bg-[#1a1a1a] transition-all cursor-pointer"
          >
            운동 리포트
          </button>
          <button className="flex-1 md:flex-none text-[0.6rem] font-black uppercase tracking-[0.2em] px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-rose-500/10">최적화 시작</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">근성장 속도</h3>
          <BarChart data={WEEKLY_DATA} labels={DAYS} activeColor="group-hover:bg-rose-600" labelActiveColor="group-hover:text-rose-600" height="h-[280px]" />
        </div>
        <div className="space-y-10">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">퍼포먼스 인덱스</h3>
          <div className="grid grid-cols-1 gap-8">
            {[
              { label: '지속성 스코어', value: '85', unit: '%', badge: '+5.2% 상승' },
              { label: '누적 운동 볼륨', value: '12.4', unit: 'TON', badge: '주간 합계' },
            ].map(({ label, value, unit, badge }) => (
              <div key={label} className="p-8 rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a] bg-gray-50/50 dark:bg-[#050505]/50 hover:border-rose-300 transition-all">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black tracking-tightest">{value}<span className="text-xl ml-1 text-rose-500 font-black">{unit}</span></span>
                  <span className="text-xs text-emerald-500 font-black mb-1.5 uppercase tracking-wider">{badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
