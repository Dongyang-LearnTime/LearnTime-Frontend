import { axiosInstance } from '../app/apiClient';
import type { UserSummaryResponse, RecentActivityResponse, BadgeTierInfoResponse } from '../types/userTypes';
import type { MyPageInfoResponse, MyPageSummaryResponse, MyPostsResponse, MyCommentsResponse } from '../types/myPageTypes';

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

// ===== 마이페이지 API =====

export const getMyInfo = async (): Promise<MyPageInfoResponse> => {
    const response = await axiosInstance.get<MyPageInfoResponse>('/api/user/me');
    return response.data;
};

export const getMyPageSummary = async (): Promise<MyPageSummaryResponse> => {
    const response = await axiosInstance.get<MyPageSummaryResponse>('/api/user/me/summary');
    return response.data;
};

export const updateMyName = async (name: string) => {
    const response = await axiosInstance.patch('/api/user/me/name', { name });
    return response.data;
};

export const updateMyPassword = async (currentPassword: string, newPassword: string) => {
    await axiosInstance.patch('/api/user/me/password', { currentPassword, newPassword });
};

export const deleteMyAccount = async (confirmation: string) => {
    await axiosInstance.delete('/api/user/me', { data: { confirmation } });
};

export const getMyPosts = async (page: number, size = 10): Promise<MyPostsResponse> => {
    const response = await axiosInstance.get<MyPostsResponse>('/api/user/me/posts', {
        params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
};

export const getMyComments = async (page: number, size = 10): Promise<MyCommentsResponse> => {
    const response = await axiosInstance.get<MyCommentsResponse>('/api/user/me/comments', {
        params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
};
