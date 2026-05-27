import { axiosInstance } from "../../../app/apiClient";

import type { 
    StudyPlanResponse, 
    StudyRecentWeekInfoResponse, 
    StudyTotalInfoResponse, 
    StudyMemberContentResponse,
    StudyDailyPlanResponse,
    PlanCompleteRequest,
    StudyMemberResponse,
    StudyMemberFriendResponse,
    StudyStudioSummaryResponse,
    UpdateStudyTitleRequest 
} from "../types/studyTypes";


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

// 학습 스튜디오 첫 화면 통합 조회
export const getStudyStudioSummaryApi = async (studyId: string, planDate: string): Promise<StudyStudioSummaryResponse> => {
    const response = await axiosInstance.get<StudyStudioSummaryResponse>(
        `/api/study/${studyId}/studio-summary`,
        { params: { planDate } }
    );
    return response.data;
};

// 스터디 일일 진도 내용 조회
export const getStudyMemberContentApi = async (studyId: string, planDate: string): Promise<StudyMemberContentResponse> => {
    const response = await axiosInstance.get<StudyMemberContentResponse>(
        `/api/study/daily/${studyId}/content`,
        { params: { planDate } }
    );
    return response.data;
};

// 스터디 일일 진도 내용 추가
export const addStudyMemberContentApi = async (studyDailyPlanId: number, userContent: string): Promise<number> => {
    const response = await axiosInstance.post<number>('/api/study/daily/content', { studyDailyPlanId, userContent });
    return response.data;
};

// 스터디 일일 진도 내용 수정
export const updateStudyMemberContentApi = async (studyMemberContentId: number, userContent: string): Promise<void> => {
    await axiosInstance.patch(`/api/study/daily/content/${studyMemberContentId}`, { userContent });
};

// 스터디 일일 진도 내용 삭제
export const deleteStudyMemberContentApi = async (studyMemberContentId: number): Promise<void> => {
    await axiosInstance.delete(`/api/study/daily/content/${studyMemberContentId}`);
};

// 모든 일일 공부 진도 내용 조회
export const getStudyDailyPlansApi = async (studyId: string): Promise<StudyDailyPlanResponse[]> => {
    const response = await axiosInstance.get<StudyDailyPlanResponse[]>(`/api/study/daily/${studyId}/plan`);
    return response.data;
};

// 공부 스터디 삭제
export const deleteStudyApi = async (studyId: string): Promise<void> => {
    await axiosInstance.delete(`/api/study/${studyId}`);
};

// 스터디 진도 제목 수정
export const updateStudyTitleApi = async (request: UpdateStudyTitleRequest): Promise<void> => {
    await axiosInstance.patch('/api/study/study-title', request);
};

// 스터디 책 제목 수정
export const updateStudyBookTitleApi = async (request: UpdateStudyTitleRequest): Promise<void> => {
    await axiosInstance.patch('/api/study/book-title', request);
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

// 스터디원 초대용 방장 친구 조회
export const getStudyOwnerFriendListApi = async(studyId: string) : Promise<StudyMemberFriendResponse[]> => {
    const response = await axiosInstance.get<StudyMemberFriendResponse[]>(`/api/study/member/${studyId}/friends`);
    return response.data;
};

// 스터디 멤버 초대
export const inviteStudyMemberApi = async (studyId: number, invitedUserId: number): Promise<number> => {
    const response = await axiosInstance.post<number>('/api/study/member/request', {
        studyId,
        invitedUserId
    });
    return response.data;
};

// 스터디 방장 권한 이양
export const changeStudyOwnerApi = async (studyId: number, newOwnerMemberId: number): Promise<void> => {
    await axiosInstance.patch('/api/study/member/owner', {
        studyId,
        newOwnerMemberId
    });
};

