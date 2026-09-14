import { axiosInstance } from "../../../app/apiClient";
import type { StudyJoinRequestResponse, UpdateStudyVisibilityRequest } from "../types/StudyTypes";

/**
 * 스터디 공개/비공개 설정 변경 (방장 전용)
 */
export const updateStudyVisibilityApi = async (studyId: number, isPublic: boolean): Promise<void> => {
    const payload: UpdateStudyVisibilityRequest = { isPublic };
    await axiosInstance.patch(`/api/study/${studyId}/visibility`, payload);
};

/**
 * 공개 스터디 바로 참여 (선착순 즉시 가입)
 */
export const joinPublicStudyApi = async (studyId: number): Promise<number> => {
    const response = await axiosInstance.post<number>(`/api/study/member/${studyId}/join`);
    return response.data;
};

/**
 * 공개 스터디 가입 요청 (방장 승인 대기)
 */
export const requestStudyJoinApi = async (studyId: number): Promise<number> => {
    const response = await axiosInstance.post<number>(`/api/study/member/join-request/${studyId}`);
    return response.data;
};

/**
 * 스터디 가입 요청 승인 (방장 전용)
 */
export const approveStudyJoinRequestApi = async (requestId: number): Promise<number> => {
    const response = await axiosInstance.patch<number>(`/api/study/member/join-request/${requestId}/approve`);
    return response.data;
};

/**
 * 스터디 가입 요청 거절 (방장 전용)
 */
export const rejectStudyJoinRequestApi = async (requestId: number): Promise<void> => {
    await axiosInstance.patch(`/api/study/member/join-request/${requestId}/reject`);
};

/**
 * 스터디 가입 요청 취소 (지원자 본인)
 */
export const cancelStudyJoinRequestApi = async (requestId: number): Promise<void> => {
    await axiosInstance.patch(`/api/study/member/join-request/${requestId}/cancel`);
};

/**
 * 스터디 대기 가입 요청 목록 조회 (방장 전용)
 */
export const getPendingStudyJoinRequestsApi = async (studyId: number): Promise<StudyJoinRequestResponse[]> => {
    const response = await axiosInstance.get<StudyJoinRequestResponse[]>(`/api/study/member/join-request/${studyId}/pending`);
    return response.data;
};

/**
 * 내 가입 요청 내역 목록 조회 (지원자 본인)
 */
export const getMyStudyJoinRequestsApi = async (): Promise<StudyJoinRequestResponse[]> => {
    const response = await axiosInstance.get<StudyJoinRequestResponse[]>(`/api/study/member/join-request/my`);
    return response.data;
};
