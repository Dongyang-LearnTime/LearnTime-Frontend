export interface CommentCreateRequest {
    postId: number;
    content: string;
}

export interface CommentUpdateRequest {
    content: string;
}

export interface CommentResponse {
    commentId: number;
    authorId: number | null;
    authorName: string;
    hasBlocked: boolean | null; // 로그인 한 사용자의 작성자 차단 여부
    content: string;
    createdAt: string; 
    updatedAt: string; 
}