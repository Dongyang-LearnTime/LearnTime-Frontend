export interface UserSummaryResponse {
  point: number;
  tierName: string;
  badges: UserBadgeResponse[];
  nextMinPoint: number;
}

export interface UserBadgeResponse {
  badgeType: string;
  displayName: string;
  description: string;
  acquiredAt: string;
}

export type RecentActivityType = 'NOTE' | 'QUIZ' | 'FEEDBACK';

export interface RecentActivityResponse {
  type: RecentActivityType;
  id: number;
  title: string;
  studyTitle: string;
  createdAt: string;
}
