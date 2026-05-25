import { axiosInstance } from "../../../app/apiClient";
import type { ProfileResponse, ProfileUpdateRequest } from "../types/ProfileTypes";
import imageCompression from "browser-image-compression";

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
 * @param image 프로필 이미지 파일 (선택)
 */
export const updateProfile = async (request: ProfileUpdateRequest, image?: File | null): Promise<void> => {
  const formData = new FormData();
  
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  
  if (image) {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(image, options);
    formData.append("image", compressedFile);
  }

  await axiosInstance.patch(`/api/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
