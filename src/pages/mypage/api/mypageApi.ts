import { axiosInstance } from '../../../app/apiClient';
import type { MyPageInfoResponse, MyPageSummaryResponse, MyPostsResponse, MyCommentsResponse } from '../types/myPageTypes';

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

export interface UnlinkGoogleRequest {
    googleToken: string;
    newPassword: string;
}

export const unlinkGoogleAccount = async (data: UnlinkGoogleRequest) => {
    await axiosInstance.post('/api/user/me/unlink-google', data);
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

