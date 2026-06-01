import { PointMilestone, POINT_MILESTONE_IMAGE } from '../types/pointMilestone';
import { BadgeType, BADGE_IMAGE } from '../types/badgeEnums';

// 게이미피케이션 자산 import
import BicycleTier from '../assets/tier/Bicycle.svg';
import CarTier from '../assets/tier/Car.svg';
import HelicopterTier from '../assets/tier/Helicopter.svg';
import PlainTier from '../assets/tier/Plain.svg';
import SpaceShipTier from '../assets/tier/SpaceShip.svg';

import Days30Badge from '../assets/badge/30Days.svg';
import Days90Badge from '../assets/badge/90Days.svg';
import Days180Badge from '../assets/badge/180Days.svg';
import FirstPlanBadge from '../assets/badge/FirstPlan.svg';
import Notes80Badge from '../assets/badge/Notes80.svg';
import MorningFirstTimeBadge from '../assets/badge/MorningFirstTime.svg';
import MorningFiveTimeBadge from '../assets/badge/MorningFiveTime.svg';
import Quiz10TimeBadge from '../assets/badge/Quiz10Time.svg';

// 로컬 파일명에 매핑되는 임포트된 SVG 파일 자산 레코드
const TIER_ASSETS: Record<string, string> = {
  'Bicycle.svg': BicycleTier,
  'Car.svg': CarTier,
  'Helicopter.svg': HelicopterTier,
  'Plain.svg': PlainTier,
  'SpaceShip.svg': SpaceShipTier,
};

const BADGE_ASSETS: Record<string, string> = {
  '30Days.svg': Days30Badge,
  '90Days.svg': Days90Badge,
  '180Days.svg': Days180Badge,
  'FirstPlan.svg': FirstPlanBadge,
  'Notes80.svg': Notes80Badge,
  'MorningFirstTime.svg': MorningFirstTimeBadge,
  'MorningFiveTime.svg': MorningFiveTimeBadge,
  'Quiz10Time.svg': Quiz10TimeBadge,
};

const TIER_KOREAN_MAP: Record<string, PointMilestone> = {
  '자전거': PointMilestone.BICYCLE,
  '자동차': PointMilestone.CAR,
  '헬리콥터': PointMilestone.HELICOPTER,
  '비행기': PointMilestone.AIRPLANE,
  '우주선': PointMilestone.SPACESHIP,
};

/**
 * 사용자 티어 명칭에 따라 맵 매핑을 거쳐 실제 빌드된 SVG 이미지 경로를 획득함.
 */
export const getTierImage = (tierName: string): string => {
  if (!tierName) return BicycleTier;
  
  // 1. 한국어 이름 매핑 시도
  const enKey = TIER_KOREAN_MAP[tierName];
  if (enKey) {
    const fileName = POINT_MILESTONE_IMAGE[enKey];
    return TIER_ASSETS[fileName] || BicycleTier;
  }
  
  // 2. 영어 이름 포함 여부 시도
  const key = Object.values(PointMilestone).find(val => tierName.toUpperCase().includes(val)) || PointMilestone.BICYCLE;
  const fileName = POINT_MILESTONE_IMAGE[key];
  return TIER_ASSETS[fileName] || BicycleTier;
};

/**
 * 사용자 배지 타입명에 따라 맵 매핑을 거쳐 실제 빌드된 SVG 이미지 경로를 획득함.
 * @param badgeType 배지 타입명 또는 레거시 파일명 (예: "FIRST_STEP", "30Days")
 * @returns 매핑된 SVG 파일 경로
 */
export const getBadgeImage = (badgeType: string): string => {
  if (!badgeType) return Days30Badge;
  
  const key = Object.values(BadgeType).find(val => badgeType.toUpperCase() === val);
  if (key) {
    const fileName = BADGE_IMAGE[key];
    return BADGE_ASSETS[fileName] || Days30Badge;
  }
  
  // 레거시 문자열 형식 대응
  const legacyFileName = `${badgeType}.svg`;
  if (BADGE_ASSETS[legacyFileName]) return BADGE_ASSETS[legacyFileName];
  
  return Days30Badge;
};
