import { axiosInstance } from '../../../app/apiClient';

export interface StudyProgressIndicatorResponse {
    studyId: number;
    studyTitle: string;
    hasTodayPlan: boolean;
}

export const getMyStudyProgresses = async (): Promise<StudyProgressIndicatorResponse[]> => {
    const response = await axiosInstance.get<StudyProgressIndicatorResponse[]>('/api/study/progress');
    return response.data;
};
