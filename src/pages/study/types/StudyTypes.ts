import type { ProgressStatus, CompletionStatus, StudyMemberRole, StudyMemberStatus } from "../../../types/studyEnums";

// 모든 일일 공부 진도 내용 응답
export interface StudyDailyPlanResponse {
  studyDailyPlanId: number;
  dayNumber: number;
  planDate: string;
  planContent: string;
}

// 일일 공부 일정 타입
export interface StudyPlanResponse {
  studyTitle : string;
  bookTitle : string;
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

// 사용자의 추가 진도 내용 (응답)
export interface StudyMemberContentResponse {
  studyDailyPlanId: number | null; // 일일 계획 ID
  planContent: string | null;      // 일일 진도 내용
  isHoliday : boolean;             // 오늘 휴무일 여부
  memberContents: {
    studyMemberContentId: number;  // 스터디 멤버 작성 내용 ID
    memberContent: string;         // 작성한 공부 내용
  }[];
}

// 일일 진도 완료 요청
export interface PlanCompleteRequest {
  studyDailyPlanId: number;
  completionStatus: CompletionStatus; // SUCCESS | FAILURE
  understandingScore: number;         // 1~5
}

// 스터디 멤버 조회 응답
export interface StudyMemberResponse {
  studyMemberId: number;
  studyMemberRole: StudyMemberRole;
  joinedAt: string;
  userId: number;
  userName: string;
  profileImageUrl: string | null; 
  hasBlocked: boolean | null;
  status: StudyMemberStatus;
}


// 스터디원 초대용 친구 목록 타입
export interface StudyMemberFriendResponse {
  friendId: number;  // 친구 관계 식별자
  userId: number; // 친구의 사용자 식별자
  name: string;
  email: string;
  createdAt: string;
  isInvited: boolean; // 공부 초대 여부
  profileImageUrl?: string | null;
}

// 스터디 제목 및 책 제목 수정 요청 
export interface UpdateStudyTitleRequest {
  studyId: number;
  title: string;
}

// 오늘의 학습 계획 및 진행 상태 응답
export interface TodayStudyPlanResponse {
  studyId: number;
  studyTitle: string;
  studyDailyPlanId: number;
  planContent: string;
  progressStatus: ProgressStatus;
}

// 학습 스튜디오 첫 화면 통합 응답
export interface StudyStudioSummaryResponse {
  todayPlan: StudyPlanResponse;
  todayContent: StudyMemberContentResponse;
  totalIndicator: StudyTotalInfoResponse;
  recentWeekIndicator: StudyRecentWeekInfoResponse[];
}

// 일일 진도 집중 시간 등록 요청
export interface FocusTimeRequest {
  studyDailyPlanId: number;
  focusTime: string; // "HH:mm:ss"
}
