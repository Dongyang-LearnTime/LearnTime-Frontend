import { axiosInstance } from '../../../app/apiClient';
import type { CalendarRequest, CalendarResponse, RoutineRequest, RoutineResponse } from '../types/ScheduleTypes';

/**
 * 1. 일정(Calendar) 관련 API
 */

// 월별 일정 조회
export const getMonthlySchedulesApi = async (year: number, month: number): Promise<CalendarResponse[]> => {
  const response = await axiosInstance.get<CalendarResponse[]>('/api/user/calendar', {
    params: { year, month }
  });
  return response.data;
};

// 일정 등록
export const createScheduleApi = async (data: CalendarRequest): Promise<CalendarResponse> => {
  const response = await axiosInstance.post<CalendarResponse>('/api/user/calendar', data);
  return response.data;
};

// 일정 수정
export const updateScheduleApi = async (calendarRecordId: string | number, data: CalendarRequest): Promise<CalendarResponse> => {
  const response = await axiosInstance.put<CalendarResponse>(`/api/user/calendar/${calendarRecordId}`, data);
  return response.data;
};

// 일정 삭제
export const deleteScheduleApi = async (calendarRecordId: string | number): Promise<void> => {
  await axiosInstance.delete(`/api/user/calendar/${calendarRecordId}`);
};

/**
 * 2. 루틴(Routine) 관련 API
 */

// 루틴 목록 전체 조회
export const getRoutinesApi = async (): Promise<RoutineResponse[]> => {
  const response = await axiosInstance.get<RoutineResponse[]>('/api/user/routines');
  return response.data;
};

// 루틴 등록
export const createRoutineApi = async (data: RoutineRequest): Promise<RoutineResponse> => {
  const response = await axiosInstance.post<RoutineResponse>('/api/user/routines', data);
  return response.data;
};

// 루틴 수정
export const updateRoutineApi = async (routineId: string | number, data: RoutineRequest): Promise<RoutineResponse> => {
  const response = await axiosInstance.put<RoutineResponse>(`/api/user/routines/${routineId}`, data);
  return response.data;
};

// 루틴 삭제
export const deleteRoutineApi = async (routineId: string | number): Promise<void> => {
  await axiosInstance.delete(`/api/user/routines/${routineId}`);
};
