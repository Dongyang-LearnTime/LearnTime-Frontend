// ============================================================
// types/index.ts
// 전역 타입 및 DTO
// ============================================================


/** 
 * 공통 API 응답 구조
 */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Todo 모델
 */
export interface Todo {
  id: string;        // 고유 식별자(PK)
  text: string;      // 할 일 내용
  completed: boolean;// 완료 여부
  isAi: boolean;     // AI 생성 여부
}

/** 
 * Todo 생성 DTO
 */
export interface CreateTodoDto extends Omit<Todo, 'id'> {}

/** 
 * Todo 수정 DTO
 */
export interface UpdateTodoDto extends Partial<Todo> {}

/** 
 * 공부 기록 리포트 모델
 */
export interface StudyReport {
  totalStudyTime: number;       // 총 공부 시간 (분 단위)
  completedTodosCount: number;  // 완료한 진도 수
  totalTodosCount: number;      // 전체 진도 수
  weeklyStudyMinutes: number[]; // 주간 공부 시간 (월~일, 분)
  studiedKeywords: string[];    // 공부한 핵심 키워드 리스트
  aiFeedbackSummary: string;    // AI가 분석한 총평 및 전략 리포트
  reportDate: string;           // 리포트 생성일
}

/**
 * 운동 기록 리포트 모델
 */
export interface ExerciseReport {
  totalWorkoutTime: number;     // 총 운동 시간 (분 단위)
  totalActiveDays: number;      // 주간 운동 일수
  totalVolume: number;          // 주간 누적 볼륨 (TON 단위)
  weeklyVolumes: number[];      // 요일별 누적 볼륨 (월~일, TON)
  targetMuscles: string[];      // 주로 단련한 부위 리스트
  aiFeedbackSummary: string;    // AI가 분석한 피드백 리포트
  reportDate: string;           // 리포트 생성일
}


