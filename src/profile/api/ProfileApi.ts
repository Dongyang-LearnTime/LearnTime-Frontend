import { axiosInstance } from "../../app/apiClient";
import type { ProfileResponse, ProfileUpdateRequest } from "../types/ProfileTypes";

/**
 * 사용자 프로필 정보를 조회합니다.
 * @param userId 조회할 사용자의 ID
 * @returns ProfileResponse 프로필 정보
 */
export const getProfile = async (userId: number | string): Promise<ProfileResponse> => {
  const response = await axiosInstance.get(`/api/profile/${userId}`);
  return response.data;
};

/**
 * 내 프로필 정보를 수정합니다.
 * @param request 프로필 수정 요청 정보
 */
export const updateProfile = async (request: ProfileUpdateRequest): Promise<void> => {
  await axiosInstance.patch(`/api/profile`, request);
};
