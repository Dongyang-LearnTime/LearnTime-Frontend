import { axiosInstance } from '../../../app/apiClient';
import type { TodayStudyPlanResponse } from '../types/StudyTypes';

export interface StudyProgressIndicatorResponse {
    studyId: number;
    studyTitle: string;
    hasTodayPlan: boolean;
}

export const getMyStudyProgresses = async (): Promise<StudyProgressIndicatorResponse[]> => {
    const response = await axiosInstance.get<StudyProgressIndicatorResponse[]>('/api/study/progress');
    return response.data;
};

export const getTodayPlans = async (): Promise<TodayStudyPlanResponse[]> => {
    const response = await axiosInstance.get<TodayStudyPlanResponse[]>('/api/study/daily/today-plans');
    return response.data;
};
