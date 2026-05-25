/**
 * @file useExerciseReport.ts
 * @description React Query 기반 운동 기록 리포트 상태 관리 훅.
 */

import { useQuery } from '@tanstack/react-query';
import { exerciseApi } from '../../api/exercise';
import type { ExerciseReport } from '../../types';

export const QUERY_KEY_EXERCISE_REPORT = ['exerciseReport'];

export function useExerciseReport(enabled: boolean = false) {
  const { data: report, isLoading, isError, error, refetch } = useQuery<ExerciseReport>({
    queryKey: QUERY_KEY_EXERCISE_REPORT,
    queryFn: exerciseApi.getExerciseReport,
    enabled,
  });

  return {
    report,
    isLoading,
    isError,
    error,
    fetchReport: refetch,
  };
}
