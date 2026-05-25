export interface Schedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD 형식의 날짜 문자열
  startTime: string; // HH:MM 형식의 시작 시간
  endTime: string; // HH:MM 형식의 종료 시간
  type: 'schedule' | 'routine'; // 일정 유형 (일회성 일정 / 반복 루틴)
  completed: boolean; // 완료 여부
  repeatDays?: number[]; // 반복 루틴일 때 반복 요일 인덱스 배열 (0: 일요일 ~ 6: 토요일)
  isFavorite: boolean; // 주요 일정(즐겨찾기) 여부
}


export interface CalendarRequest {
  content: string;
  targetDate: string; // LocalDateTime
  isCompleted: boolean;
  isImportant: boolean;
}

export interface CalendarResponse {
  calendarRecordId: number;
  content: string;
  targetDate: string; // LocalDateTime
  isCompleted: boolean;
  isImportant: boolean;
  createdAt: string; // LocalDateTime
}

export interface RoutineRequest {
  content: string;
  startTime: string; // LocalTime
  startDate: string; // LocalDate
  endDate: string | null; // LocalDate
  isImportant: boolean;
  daysOfWeek: DayOfWeek[];
}

export interface RoutineResponse {
  routineId: number;
  content: string;
  startTime: string; // LocalTime
  startDate: string; // LocalDate
  endDate: string | null; // LocalDate
  isImportant: boolean;
  daysOfWeek: DayOfWeek[];
  createdAt: string; // LocalDateTime
}



export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';