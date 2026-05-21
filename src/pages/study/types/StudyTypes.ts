import type { ProgressStatus, CompletionStatus } from "../../../types/StudyEnums";

// 일일 공부 일정 타입
export interface StudyPlanResponse {
  planDate: string;             // 조회 기준일 (YYYY-MM-DD)
  startDate: string;            // 스터디 시작일 (YYYY-MM-DD)
  endDate: string;              // 스터디 종료일 (YYYY-MM-DD)
  restDays: string[];           // 스터디 휴무 요일 목록
  restDates: string[];          // 스터디 휴무 날짜 목록 (YYYY-MM-DD)
  studyDailyPlanId: number | null; // 일일 학습 계획 ID 
  dayNumber: number | null;        // 학습 일차
  planContent: string | null;      // 학습 계획 내용 
  focusTime: string | null;        // 집중 시간 (HH:mm:ss)
  progressStatus: ProgressStatus | null; // 진행 상태 
  completionStatus: CompletionStatus | null; // 완료 상태 
  understandingScore: number | null; // 이해도 점수 
  studyMemberId: number;        // 조회한 사용자의 스터디 멤버 ID
  allStudyMemberIds: number[];  // 모든 스터디 멤버 ID 목록
}

// 최근 일주일 일일 학습 상태 응답
export interface StudyRecentWeekInfoResponse {
  studyMemberId: number;
  name: string;
  recentWeekInfos: {
    planDate: string;           // 학습 계획 날짜 (YYYY-MM-DD)
    focusTime: string | null;   // 집중 시간 (HH:mm:ss)
    progressStatus: ProgressStatus | null; // 진행 상태
    completionStatus: CompletionStatus | null; // 완료 상태 
    understandingScore: number | null; // 이해도 점수
    isRestDay: boolean;         // 휴식일 여부
  }[];
}


// 공부 진도 관련 주요 지표
export interface StudyTotalInfoResponse {
  studyCompletionRate: number; // 진도 완료률
  studySuccessRate: number;    // 진도 성공률
  quizCorrectRate: number;     // 퀴즈 정답률
  totalFocusedTime: number;    // 총 집중 시간 (단위: 초)
}

// 사용자의 추가 진도 내용
export interface StudyMemberContentResponse {
  studyMemberContentId: number; // 스터디 멤버 작성 내용 ID
  studyDailyPlanId: number;     // 일일 계획 ID
  dayNumber: number;            // 학습 일차
  memberContent: string;        // 작성한 공부 내용
}