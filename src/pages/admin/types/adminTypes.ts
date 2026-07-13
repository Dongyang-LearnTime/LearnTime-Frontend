import type { AuthProvider, Role } from "../../../types/userEnums";

export interface AdminUserListResponse {
  userId: number;
  email: string;
  name: string;
  socialProvider: AuthProvider;
  role: Role;
  createdAt: string;
}

export interface AdminUserDetailResponse {
  userId: number;
  email: string;
  name: string;
  point: number;
  socialProvider: AuthProvider;
  role: Role;
  createdAt: string;
  updatedAt: string;
  failedAttempts: number;
  isLocked: boolean;
  lockedAt: string | null;
  aiRemainingCount: number;
  profileImageUrl: string | null;
}

export interface SiteStatsResponse {
  totalUsers: number;
  newUsersToday: number;
  totalPosts: number;
  newPostsToday: number;
  totalComments: number;
  newCommentsToday: number;
}
