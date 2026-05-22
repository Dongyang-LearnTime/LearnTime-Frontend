import { axiosInstance } from "../../../app/apiClient";

import type { 
    StudyPlanResponse, 
    StudyRecentWeekInfoResponse, 
    StudyTotalInfoResponse, 
    StudyMemberContentResponse,
    PlanCompleteRequest,
    StudyMemberResponse } from "../types/StudyTypes";

// 일일 공부 진도 정보
export const getStudyPlanApi = async (studyId: string,  planDate: string): Promise<StudyPlanResponse> => {
    // 날짜는 YYYY-MM-DD 형식
    const response = await axiosInstance.get<StudyPlanResponse>(`/api/study/daily/${studyId}`, {
        params: {
            planDate
        }
    });

    return response.data;
};


// 현재 사용자의 주요 공부 지표
export const getStudyTotalInfoApi = async (studyId: string): Promise<StudyTotalInfoResponse> => {
    const response = await axiosInstance.get<StudyTotalInfoResponse>(
        `/api/study/${studyId}/total`
    );
    return response.data
};


// 스터디원의 최근 일주일 간 공부 지표
export const getStudyRecentWeekInfoApi = async (studyId: string): Promise<StudyRecentWeekInfoResponse[]> => {
    const response = await axiosInstance.get<StudyRecentWeekInfoResponse[]>(
        `/api/study/${studyId}/total/recent-week`
    );
    return response.data
};

// 개인 일정 설정
export const getStudyMemberContent = async (studyId: string): Promise<StudyMemberContentResponse[]> => {
    const response = await axiosInstance.get<StudyMemberContentResponse[]>(
        `/api/study/daily/${studyId}/content`
    );
    return response.data
};


// 일일 진도 시작
export const startStudyDailyPlanApi = async (studyDailyPlanId: number): Promise<void> => {
    await axiosInstance.patch(`/api/study/daily/${studyDailyPlanId}/start`);
};

// 일일 진도 완료
export const completeStudyDailyPlanApi = async (request: PlanCompleteRequest): Promise<string> => {
    const response = await axiosInstance.patch<string>(`/api/study/daily/completion`, request);
    return response.data;
};

// 스터디 멤버 목록 조회
export const getStudyMemberListApi = async (studyId: string): Promise<StudyMemberResponse[]> => {
    const response = await axiosInstance.get<StudyMemberResponse[]>(`/api/study/member/${studyId}`);
    return response.data;
};
