import { axiosInstance } from '../../../app/apiClient';
import type { TodayStudyPlanResponse } from '../types/studyTypes';

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

export interface StudyArchiveResponse {
    studyId: number;
    studyTitle: string;
    role: string;
    status: string;
    joinedAt: string;
}

export const getMyArchivedStudiesApi = async (): Promise<StudyArchiveResponse[]> => {
    const response = await axiosInstance.get<StudyArchiveResponse[]>('/api/study/archive');
    return response.data;
};
