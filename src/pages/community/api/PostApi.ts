import { axiosInstance } from "../../../app/apiClient";
import imageCompression from "browser-image-compression";
import type { PageResponse } from "../../../types/PaginationType";
import type { PostCreateRequest, PostUpdateRequest, PostListResponse, PostUpdateDetailResponse, PostResponse} from "../types/PostTypes";


export const createPostApi = async (request: PostCreateRequest, images: File[]): Promise<number> => {
    const FORM_DATA_NAME: string = "images";
    const formData = new FormData();

    formData.append(
        "request",
        new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    // 이미지 압축 및 FormData 추가 
    if (images && images.length > 0) {
        const options = {
        maxSizeMB: 1, 
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        };

        for (const image of images) {
            const compressedImage = await imageCompression(image, options);
            formData.append(FORM_DATA_NAME, compressedImage);
        }
    }

    const response = await axiosInstance.post<number>("/api/community/post", formData);

    return response.data;
};

export const updatePostApi = async (postId: number, request: PostUpdateRequest, newImages?: File[]): Promise<void> => {
    const formData = new FormData();

    // 게시글 수정 JSON 데이터
    formData.append(
        'request',
        new Blob(
            [JSON.stringify(request)],
            { type: 'application/json' }
        )
    );

    // 새 이미지 목록
    newImages?.forEach((image) => {
        formData.append('newImages', image);
    });

    await axiosInstance.put(
        `/api/community/post/${postId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
};

// 게시글 상세 페이지
export const getPostApi = async (postId: number, lastCommentId?: number, size: number = 10): Promise<PostResponse> => {
    const response = await axiosInstance.get(
        `/api/community/post/${postId}`,
        {
            params: {
                lastCommentId,
                size
            }
        }
    );

    return response.data;
};

// 게시글 목록
export const getPostListApi = async (page: number, size: number = 10): Promise<PageResponse<PostListResponse>> => {
    const response = await axiosInstance.get(
        `/api/community/post`,     
        {
            params: { page, size }
        }
    );
    return response.data;
};


// 검색된 게시글 목록
export const searchPostListApi = async (keyword: string, page: number, size: number = 10): Promise<PageResponse<PostListResponse>> => {
        const response = await axiosInstance.get(
        `/api/community/post/search`,     
        {
            params: { keyword, page, size }
        }
    );
    return response.data;
}

// 주간 인기글 목록 (Top 3)
export const getWeeklyPopularPostsApi = async (): Promise<PostListResponse[]> => {
    const response = await axiosInstance.get(`/api/community/post/popular/weekly`);
    return response.data;
}

// 공지사항 목록
export const getNoticePostsApi = async (): Promise<PostListResponse[]> => {
    const response = await axiosInstance.get(`/api/community/post/notices`);
    return response.data;
}

// 게시글 수정용 상세 정보 조회
export const getPostForUpdateApi = async (postId: number): Promise<PostUpdateDetailResponse> => {
    const response = await axiosInstance.get(
        `/api/community/post/${postId}/edit`
    );
    return response.data;
};

// 좋아요 로직
export const togglePostLikeApi = async (postId: number): Promise<void> => {
    await axiosInstance.patch(`/api/community/post/${postId}/like`);
};


// 게시글 삭제
export const deletePostApi = async (postId: number): Promise<void> => {
    await axiosInstance.delete(`/api/community/post/${postId}`);
};


