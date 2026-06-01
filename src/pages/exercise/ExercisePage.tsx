import { useState } from 'react';
// 운동 탭에 필요한 서브 섹션 컴포넌트 임포트
import {
  TrainingSessionBox, ExerciseGuideBox, DietBox,
  BodyCompositionBox, ExerciseDashboardBox,
  ExerciseReportModal,
} from './types/exerciseIndex';


// 운동 랩 메인 페이지 컴포넌트
export default function ExercisePage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <>
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50 dark:bg-[#141416] pb-32">
      <div className="fixed top-[-10%] left-[-10%] w-lg h-128 bg-rose-400/5 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-lg h-128 bg-amber-400/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {
          // 페이지 헤더: 타이틀과 설명 문구
        }
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tightest mb-2 border-l-8 border-rose-600 pl-6">운동 랩</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium ml-2">정밀한 데이터를 통해 당신의 신체적 한계를 돌파하세요.</p>
        </header>

        {
          // 벤토 그리드 형식의 레이아웃 배치
        }
        <div className="bento-grid">
          {
            // 운동 통계 대시보드 (최상단)
          }
          <div className="col-span-12">
            <ExerciseDashboardBox />
          </div>

          {
            // 맞춤형 운동 가이드 영상 (7칸)
          }
          <div className="col-span-12 lg:col-span-7">
            <ExerciseGuideBox />
          </div>

          {
            // 오늘의 운동 기록 (5칸으로 확장)
          }
          <div className="col-span-12 lg:col-span-5">
            <TrainingSessionBox />
          </div>

          {
            // 식단 관리 및 칼로리 통계 (7칸 — 2행과 동일 비율)
          }
          <div className="col-span-12 lg:col-span-7">
            <DietBox />
          </div>

          {
            // 신체 스펙 및 인바디 데이터 (5칸으로 축소 — 2행과 동일 비율)
          }
          <div className="col-span-12 lg:col-span-5">
            <BodyCompositionBox />
          </div>
        </div>
      </div>
    </div>
      {isReportModalOpen && (
        <ExerciseReportModal onClose={() => setIsReportModalOpen(false)} />
      )}
    </>
  );
}
