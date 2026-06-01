import { axiosInstance } from "../../../app/apiClient";

export interface StudyMemberRequest {
    studyId: number;
    invitedUserId: number;
}

export interface StudyInvitationResponse {
    studyInvitationId: number;
    studyId: number;
    studyTitle: string;
    userId: number;
    userName: string;
    requestedAt: string;
}

/**
 * 받은 초대 목록 조회
 */
export const getReceivedInvitationsApi = async (): Promise<StudyInvitationResponse[]> => {
    const response = await axiosInstance.get<StudyInvitationResponse[]>('/api/study/member/request/invited');
    return response.data;
};

/**
 * 보낸 초대 목록 조회
 */
export const getSentInvitationsApi = async (): Promise<StudyInvitationResponse[]> => {
    const response = await axiosInstance.get<StudyInvitationResponse[]>('/api/study/member/request/inviter');
    return response.data;
};

/**
 * 공부 스터디 멤버 초대
 */
export const inviteMemberApi = async (request: StudyMemberRequest): Promise<number> => {
    const response = await axiosInstance.post<number>('/api/study/member/request', request);
    return response.data;
};

/**
 * 공부 스터디 초대 승인
 */
export const acceptInvitationApi = async (invitationId: number): Promise<void> => {
    await axiosInstance.patch(`/api/study/member/request/${invitationId}/accept`);
};

/**
 * 공부 스터디 초대 거절
 */
export const rejectInvitationApi = async (invitationId: number): Promise<void> => {
    await axiosInstance.patch(`/api/study/member/request/${invitationId}/reject`);
};

/**
 * 공부 스터디 초대 취소 (보낸 초대 취소)
 */
export const cancelInvitationApi = async (invitationId: number): Promise<void> => {
    await axiosInstance.patch(`/api/study/member/request/${invitationId}`);
};
