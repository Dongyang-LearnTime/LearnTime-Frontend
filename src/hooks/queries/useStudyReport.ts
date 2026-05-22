/**
 * @file useStudyReport.ts
 * @description React Query 기반 공부 기록 리포트 상태 관리 훅.
 */

import { useQuery } from '@tanstack/react-query';
import { studyApi } from '../../api/study';
import type { StudyReport } from '../../types';

export const QUERY_KEY_STUDY_REPORT = ['studyReport'];

export function useStudyReport(enabled: boolean = false) {
  const { data: report, isLoading, isError, error, refetch } = useQuery<StudyReport>({
    queryKey: QUERY_KEY_STUDY_REPORT,
    queryFn: studyApi.getStudyReport,
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
