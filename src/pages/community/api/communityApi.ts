import { axiosInstance } from "../../../app/apiClient";
import type { PageResponse } from "../../../types/paginationType";
import type { PointRankingResponse } from "../types/postTypes";

// 포인트 순위 조회 API
export const getRankingApi = async (page: number, size: number = 20): Promise<PageResponse<PointRankingResponse>> => {
    const response = await axiosInstance.get(
        `/api/community/ranking`,
        {
            params: { page, size }
        }
    );
    return response.data;
};
