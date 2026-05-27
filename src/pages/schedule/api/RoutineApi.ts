import { axiosInstance } from '../../../app/apiClient';
import type { RoutineRequest, RoutineResponse } from '../types/scheduleTypes';


// 루틴 목록 전체 조회
export const getRoutinesApi = async (): Promise<RoutineResponse[]> => {
  const response = await axiosInstance.get<RoutineResponse[]>(
    '/api/user/routines'
  );

  return response.data;
};

// 루틴 등록
export const createRoutineApi = async (
  data: RoutineRequest
): Promise<RoutineResponse> => {
  const response = await axiosInstance.post<RoutineResponse>(
    '/api/user/routines',
    data
  );

  return response.data;
};

// 루틴 수정
export const updateRoutineApi = async (
  routineId: string | number,
  data: RoutineRequest
): Promise<RoutineResponse> => {
  const response = await axiosInstance.put<RoutineResponse>(
    `/api/user/routines/${routineId}`,
    data
  );

  return response.data;
};

// 루틴 삭제
export const deleteRoutineApi = async (
  routineId: string | number
): Promise<void> => {
  await axiosInstance.delete(`/api/user/routines/${routineId}`);
};