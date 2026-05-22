// 커뮤니티 도메인에서 사용되는 데이터 타입 정의

// 댓글 정보 타입
export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// 게시글 정보 타입
export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  commentsList?: Comment[];
  timestamp: string;
  badge: string; // 'obsidian' | 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'
}

// 랭킹 리스트의 사용자 정보 타입
export interface User {
  id: string;
  name: string;
  points: number;
  rank: number;
}
