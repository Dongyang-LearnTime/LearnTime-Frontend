import { axiosInstance } from '../../../app/apiClient';
import type { PageResponse } from '../../../types/PaginationType';
import type { Role } from '../../../types/userEnums';
import type { 
  AdminUserListResponse, 
  AdminUserDetailResponse, 
  SiteStatsResponse 
} from '../types/adminTypes';

export const getAdminUsers = async (
  page: number = 0,
  size: number = 20,
  keyword?: string,
  role?: Role
): Promise<PageResponse<AdminUserListResponse>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (keyword) params.append('keyword', keyword);
  if (role) params.append('role', role);

  const { data } = await axiosInstance.get<PageResponse<AdminUserListResponse>>(
    `/api/admin/users?${params.toString()}`
  );
  return data;
};

export const getAdminUserDetail = async (userId: number): Promise<AdminUserDetailResponse> => {
  const { data } = await axiosInstance.get<AdminUserDetailResponse>(`/api/admin/users/${userId}`);
  return data;
};

export const grantAdminRole = async (userId: number): Promise<void> => {
  await axiosInstance.patch(`/api/admin/users/${userId}/role/admin`);
};

export const forceWithdrawUser = async (userId: number): Promise<void> => {
  await axiosInstance.delete(`/api/admin/users/${userId}`);
};

export const sendEmailToUser = async (userId: number, subject: string, content: string): Promise<void> => {
  await axiosInstance.post(`/api/admin/users/${userId}/email`, { subject, content });
};

export const getSiteStats = async (): Promise<SiteStatsResponse> => {
  const { data } = await axiosInstance.get<SiteStatsResponse>('/api/admin/site/stats');
  return data;
};
