import type { StudyTotalInfoResponse } from "../../study/types/StudyTypes";

export interface PostCreateRequest {
  title: string;
  content: string;
  studyId?: number;
  isNotice: boolean;
}

export interface PostUpdateRequest {
    title: string; 
    content: string; 
    deletedImageUrls: string[]; 
    isNotice: boolean; 
}

export interface PostResponse {
    postId: number; // 게시글 식별자(ID)
    userId: number | null; // 작성자 식별자(ID), 탈퇴한 경우 null
    userName: string; // 작성자 이름 또는 닉네임, 탈퇴한 경우 "탈퇴한 사용자"
    userProfileImageUrl: string | null; // 작성자의 프로필 사진 
    title: string; // 게시글 제목
    content: string; // 게시글 본문 내용
    createdAt: string; // 게시글 생성 일시 (ISO Date String)
    updatedAt: string; // 게시글 수정 일시 (ISO Date String)
    viewCount: number; // 게시글 조회수
    likeCount: number; // 게시글 좋아요 수
    isLiked: boolean; // 조회한 사용자의 해당 게시글 좋아요 여부, 비로그인 시 false
    isImageLoadSuccessful: boolean; // 게시글 이미지 목록 정상 로드 여부
    images: string[]; // 게시글 이미지 URL 목록
    comments: CommentResponse[]; // 게시글 댓글 목록
    studyTotalIndicator: StudyTotalInfoResponse | null; // 연관된 스터디 핵심 지표, 없으면 null
    isNotice: boolean; // 공지사항 여부
}

// 게시글 목록
export interface PostListResponse {
    postId: number;
    userId: number | null;
    userName: string;
    userProfileImageUrl: string | null; // 작성자의 프로필 사진 
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string; 
    isNotice: boolean;
}

// 댓글 아이템
export interface CommentResponse {
    commentId: number;
    authorId: number | null;
    authorName: string;
    content: string;
    createdAt: string; 
    updatedAt: string; 
}

// 게시글 수정
export interface PostUpdateDetailResponse {
    postId: number;
    title: string;
    content: string;
    images: string[];
}


// 포인트 순위
export interface PointRankingResponse {
    userId: number;
    name: string;
    point: number;
    tierName: string;
    rank: number;
}