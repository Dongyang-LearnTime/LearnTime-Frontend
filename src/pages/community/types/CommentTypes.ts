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
    content: string;
    createdAt: string; 
    updatedAt: string; 
}