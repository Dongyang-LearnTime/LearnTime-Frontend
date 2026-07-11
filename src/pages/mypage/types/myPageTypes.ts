export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface MyPageInfoResponse {
    email: string;
    userName: string;
    point: number;
    socialProvider: string;
    termsAgreements: Record<string, boolean>;
    createdAt: string;
    role: Role;
}

export interface MyPageSummaryResponse {
    postCount: number;
    commentCount: number;
    totalLikeReceived: number;
    point: number;
}

// Offset pagination 공용 타입
export interface PageResponse<T> {
    content: T[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

export interface MyPostItem {
    postId: number;
    userId: number | null;
    userName: string;
    userProfileImageUrl: string | null;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    isNotice: boolean;
}

export interface MyCommentItem {
    commentId: number;
    postId: number;
    postTitle: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type MyPostsResponse = PageResponse<MyPostItem>;
export type MyCommentsResponse = PageResponse<MyCommentItem>;
