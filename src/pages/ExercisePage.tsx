import { useState } from 'react';
// 운동 탭에 필요한 서브 섹션 컴포넌트 임포트
import {
  TrainingSessionBox, ExerciseGuideBox, DietBox,
  AiExerciseGuideBox, BodyCompositionBox, ExerciseDashboardBox,
  ExerciseReportModal,
} from '../components/section/exercise';

// 운동 랩 메인 페이지 컴포넌트
export function ExercisePage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
          <div className="col-span-12 lg:col-span-12">
            <ExerciseDashboardBox onViewReport={() => setIsReportModalOpen(true)} />
          </div>

          {
            // 맞춤형 운동 가이드
          }
          <div className="col-span-12 lg:col-span-8">
            <ExerciseGuideBox />
          </div>

          {
            // 트레이닝 일정 및 상태
          }
          <div className="col-span-12 lg:col-span-4">
            <TrainingSessionBox />
          </div>

          {
            // 식단 관리 및 칼로리 통계
          }
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <DietBox />
          </div>

          {
            // AI 추천 운동 피드백
          }
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <AiExerciseGuideBox />
          </div>

          {
            // 신체 스펙 및 인바디 데이터
          }
          <div className="col-span-12 md:col-span-12 lg:col-span-4">
            <BodyCompositionBox />
          </div>
        </div>
      </div>
      {isReportModalOpen && (
        <ExerciseReportModal onClose={() => setIsReportModalOpen(false)} />
      )}
    </>
  );
}
