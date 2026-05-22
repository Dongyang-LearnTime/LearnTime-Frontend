/**
 * @file exercise.ts
 * @description 운동 관리(Exercise) REST API 연동.
 */

import { apiClient } from './client';
import type { ExerciseReport, ApiResponse } from '../types';

export const exerciseApi = {
  /**
   * @description 운동 기록 리포트 조회 (GET /api/exercise/report)
   * @returns {Promise<ExerciseReport>} AI 운동 리포트
   */
  getExerciseReport: async (): Promise<ExerciseReport> => {
    try {
      const response = await apiClient.get<ApiResponse<ExerciseReport>>('/exercise/report');
      return response.data.data;
    } catch (error) {
      console.warn('임시 더미 운동 리포트 데이터 반환', error);
      return {
        totalWorkoutTime: 360,
        totalActiveDays: 5,
        totalVolume: 12.4,
        weeklyVolumes: [1.2, 1.8, 1.5, 2.2, 1.9, 2.5, 1.3],
        targetMuscles: ['가슴', '등', '삼두', '어깨', '하체'],
        aiFeedbackSummary: '이번 주 가슴과 등 부위의 세션 빈도가 증가하며 누적 볼륨(12.4 TON)이 지난주 대비 15.2% 상승했습니다. 특히 스쿼트와 데드리프트의 자세 안정성이 크게 눈에 띄며 점진적 과부하가 효과적으로 작용하고 있습니다. 다만 삼두 및 하퇴근의 보조 볼륨이 상대적으로 낮아 전체 근육 균형을 위해 주말 루틴 마지막에 중량 딥스와 카프 레이즈 3세트를 추가하는 코칭 전략을 제안합니다.',
        reportDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
    }
  },
};
