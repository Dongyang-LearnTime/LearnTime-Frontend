/** 특정 스터디의 퀴즈 기록 목록 조회 */
export interface QuizHistoryListItem {
  quizHistoryId: number;
  studyId: number;
  noteTitle: string;
  totalQuestions: number;
  correctCount: number;
  createdAt: string;
}

export interface StudyQuizInfoResponse {
  studyQuizId: number;
  quizTitle: string;
  quizStatus: 'PENDING' | 'COMPLETED' | string;
  completedCount: number;
  createdAt: string;
}

export interface QuizHistoryInfoResponse {
  quizHistoryId: number;
  attemptNumber: number;
  correctCount: number;
  totalQuestionCount: number;
  earnedPoints: number;
  submittedAt: string;
}

export interface UpdateQuizTitleRequest {
  studyQuizId: number;
  quizTitle: string;
}