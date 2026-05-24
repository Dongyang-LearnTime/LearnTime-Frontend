import { axiosInstance } from "../../../app/apiClient";
import type { CursorResponse } from "../../../types/PaginationType";

import type { CommentCreateRequest, CommentUpdateRequest, CommentResponse } from "../types/CommentTypes";


// 댓글 목록 조회
export const getCommentListApi = async (postId: number, lastCommentId?: number, size: number = 10): Promise<CursorResponse<CommentResponse>> => {
    const response = await axiosInstance.get(`/api/community/comment/${postId}`,
        {
            params: {
                lastCommentId,
                size
            }
        }
    );

    return response.data;
};


// 댓글 생성
export const createCommentApi = async (request: CommentCreateRequest): Promise<number> => {
    const response = await axiosInstance.post(
        `/api/community/comment`,
        request
    );

    return response.data;
};


// 댓글 수정
export const updateCommentApi = async (commentId: number,request: CommentUpdateRequest): Promise<void> => {
    await axiosInstance.put(
        `/api/community/comment/${commentId}`,
        request
    );
};

// 댓글 삭제
export const deleteCommentApi = async (commentId: number): Promise<void> => {
    await axiosInstance.delete(
        `/api/community/comment/${commentId}`
    );
};