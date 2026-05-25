import type { PostListResponse } from "../../pages/community/types/PostTypes";

export type ProfileVisibility = "PUBLIC" | "PRIVATE";

export interface UserBadgeResponse {
  badgeId: number;
  badgeName: string;
  badgeImageUrl: string | null;
}

export interface ProfileResponse {
  userId: number;
  name: string;
  point: number;
  tierName: string;
  profileImageUrl: string | null;
  description: string | null;
  profileVisibility: ProfileVisibility;
  friendCount: number;
  badges: UserBadgeResponse[];
  recentPosts: PostListResponse[];
}

export interface ProfileUpdateRequest {
  description: string | null;
  profileVisibility: ProfileVisibility;
  profileImageUrl: string | null;
}
