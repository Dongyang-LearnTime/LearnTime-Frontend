import { axiosInstance } from '../app/apiClient';
import type { UserSummaryResponse, RecentActivityResponse, BadgeTierInfoResponse } from '../types/UserTypes';

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
