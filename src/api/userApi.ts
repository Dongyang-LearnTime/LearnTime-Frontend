import { axiosInstance } from '../app/apiClient';
import type { UserSummaryResponse, RecentActivityResponse, BadgeTierInfoResponse } from '../types/userTypes';

export const getUserSummary = async () => {
    const response = await axiosInstance.get<UserSummaryResponse>('/api/user/summary');
    return response.data;
};

export const getRecentActivities = async () => {
    const response = await axiosInstance.get<RecentActivityResponse[]>('/api/user/recent-activities');
    return response.data;
};

export const getBadgeTierInfo = async (): Promise<BadgeTierInfoResponse> => {
    const response = await axiosInstance.get<BadgeTierInfoResponse>('/api/user/badge-tier-info');
    return response.data;
};

// ===== 차단 API =====
export const blockUserApi = async (blockedId: number) => {
    await axiosInstance.post(`/api/user/block/${blockedId}`);
};

export const unblockUserApi = async (blockedId: number) => {
    await axiosInstance.delete(`/api/user/block/${blockedId}`);
};

export interface MyBlockedUserListResponse {
    blockedId: number;
    userId: number;
    name: string;
    profileImageUrl: string | null;
    tierName: string;
    blockedAt: string;
}

export interface BlockedUsersPageResponse {
    content: MyBlockedUserListResponse[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export const getMyBlockedUsers = async (page: number, size = 10): Promise<BlockedUsersPageResponse> => {
    const response = await axiosInstance.get<BlockedUsersPageResponse>('/api/user/me/blocks', {
        params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
};

