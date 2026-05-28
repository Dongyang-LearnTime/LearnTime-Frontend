import { useEffect, useState } from "react";
import { getStudyTotalInfoApi, getStudyRecentWeekInfoApi } from "../api/studyStudioApi";
import type { StudyRecentWeekInfoResponse, StudyStudioSummaryResponse, StudyTotalInfoResponse } from "../types/studyTypes";
import RecentWeekChart from "./components/RecentWeekChart";
import CoreMetricsChart from "./components/CoreMetricsChart";
import { StopwatchBox } from "./components/StopwatchBox";
import { TodayProgressBox } from "./components/TodayProgressBox";


interface StudyLearningMetricsProps {
  studyId: string;
  summary?: StudyStudioSummaryResponse | null;
  isSummaryLoading?: boolean;
}

export default function StudyLearningMetrics({ studyId, summary, isSummaryLoading = false }: StudyLearningMetricsProps) {
  // 1. 최근 일주일 공부 지표 상태 관리
  const [ recentData, setRecentData ] = useState<StudyRecentWeekInfoResponse[] | null>(null);
  const [ isRecentLoading, setIsRecentLoading ] = useState<boolean>(true);
  const [ recentError, setRecentError ] = useState<string | null>(null);

  // 2. 주요 공부 지표 상태 관리
  const [ totalData, setTotalData ] = useState<StudyTotalInfoResponse | null>(null);
  const [ isTotalLoading, setIsTotalLoading ] = useState<boolean>(true);
  const [ totalError, setTotalError ] = useState<string | null>(null);

  // 마운트 시 각각의 API 호출을 수행
  useEffect(() => {
    if (summary !== undefined) {
      if (summary) {
        setRecentData(summary.recentWeekIndicator);
        setTotalData(summary.totalIndicator);
        setIsRecentLoading(false);
        setIsTotalLoading(false);
        setRecentError(null);
        setTotalError(null);
      } else {
        setIsRecentLoading(true);
        setIsTotalLoading(true);
      }
      return;
    }

    let isMounted = true;

    // 최근 일주일 지표 호출
    setIsRecentLoading(true);
    getStudyRecentWeekInfoApi(studyId)
      .then((data) => {
        if (isMounted) {
          setRecentData(data);
          setIsRecentLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load recent week info:", err);
          setRecentError("최근 일주일 간 공부 지표를 불러오는 데 실패했습니다.");
          setIsRecentLoading(false);
        }
      });

    // 주요 핵심 공부 지표 호출
    setIsTotalLoading(true);
    getStudyTotalInfoApi(studyId)
      .then((data) => {
        if (isMounted) {
          setTotalData(data);
          setIsTotalLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load study total info:", err);
          setTotalError("핵심 공부 지표를 불러오는 데 실패했습니다.");
          setIsTotalLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studyId, summary]);

  useEffect(() => {
    if (isSummaryLoading) {
      setIsRecentLoading(true);
      setIsTotalLoading(true);
    }
  }, [isSummaryLoading]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. 현재 학습 집중 구간 (상단) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* 오늘의 진도 (60% 너비) */}
        <section className="lg:col-span-6 min-h-100">
          <TodayProgressBox studyId={studyId} initialData={summary?.todayContent} skipInitialFetch={summary !== undefined} />
        </section>

        {/* 스튜디오 타이머 (40% 너비) */}
        <section className="lg:col-span-4 min-h-100">
          <StopwatchBox studyDailyPlanId={summary?.todayContent?.studyDailyPlanId} />
        </section>
      </div>

      {/* 2. 데이터/지표 피드백 구간 (하단) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 주간 몰입도 (65% 너비) */}
        <section className="lg:col-span-8 min-h-87.5">
          {isRecentLoading ? (
            <div className="flex flex-col gap-4 h-full bg-white dark:bg-[#070707] border border-gray-100 dark:border-[#1f1f1f] rounded-4xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-[#1a1a1a] rounded-lg"></div>
              </div>
              <div className="flex-1 w-full bg-gray-50 dark:bg-[#111] rounded-2xl"></div>
            </div>
          ) : recentError ? (
            <div className="flex items-center justify-center h-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-4xl">
              <span className="text-sm font-bold text-rose-500">{recentError}</span>
            </div>
          ) : recentData ? (
            <RecentWeekChart data={recentData} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-4xl">
              <span className="text-sm font-bold text-gray-400">데이터가 없습니다.</span>
            </div>
          )}
        </section>

        {/* 핵심 공부 지표 (35% 너비) */}
        <section className="lg:col-span-4 min-h-87.5">
          {isTotalLoading ? (
            <div className="flex flex-col gap-4 h-full bg-white dark:bg-[#070707] border border-gray-100 dark:border-[#1f1f1f] rounded-4xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-[#1a1a1a] rounded-lg"></div>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="h-20 w-full bg-gray-50 dark:bg-[#111] rounded-2xl"></div>
                <div className="h-20 w-full bg-gray-50 dark:bg-[#111] rounded-2xl"></div>
              </div>
            </div>
          ) : totalError ? (
            <div className="flex items-center justify-center h-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-4xl">
              <span className="text-sm font-bold text-rose-500">{totalError}</span>
            </div>
          ) : totalData ? (
            <CoreMetricsChart data={totalData} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-4xl">
              <span className="text-sm font-bold text-gray-400">데이터가 없습니다.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
