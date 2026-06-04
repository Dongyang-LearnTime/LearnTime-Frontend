import type { PostListResponse } from "../../community/types/PostTypes";
import type { UserBadgeResponse } from "../../../types/UserTypes";

export type ProfileVisibility = "PUBLIC" | "PRIVATE";

export interface ProfileResponse {
  userId: number;
  name: string;
  point: number;
  tierName: string;
  profileImageUrl: string | null;
  description: string | null;
  profileVisibility: ProfileVisibility;
  friendCount: number;
  isFriend : boolean | null;
  hasPendingSentRequest: boolean | null;
  hasPendingReceivedRequest: boolean | null;
  pendingFriendRequestId: number | null;
  badges: UserBadgeResponse[];
  recentPosts: PostListResponse[];
}

export interface ProfileUpdateRequest {
  description: string | null;
  profileVisibility: ProfileVisibility;
  isImageDeleted: boolean;
}
