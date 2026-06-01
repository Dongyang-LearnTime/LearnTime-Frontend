export const BadgeType = {
  FIRST_STEP: "FIRST_STEP",
  DILIGENT_PLANNER: "DILIGENT_PLANNER",
  EXCELLENT_STRATEGIST: "EXCELLENT_STRATEGIST",
  TRUE_J_MBTI: "TRUE_J_MBTI",
  HUMAN_GPT: "HUMAN_GPT",
  TRIPITAKA_COREANA: "TRIPITAKA_COREANA",
  EARLY_BIRD: "EARLY_BIRD",
  MIRACLE_MORNING_ADDICT: "MIRACLE_MORNING_ADDICT",
} as const;

export type BadgeType = typeof BadgeType[keyof typeof BadgeType];

export const BADGE_IMAGE: Record<BadgeType, string> = {
  [BadgeType.FIRST_STEP]: "FirstPlan.svg",
  [BadgeType.DILIGENT_PLANNER]: "30Days.svg",
  [BadgeType.EXCELLENT_STRATEGIST]: "90Days.svg",
  [BadgeType.TRUE_J_MBTI]: "180Days.svg",
  [BadgeType.HUMAN_GPT]: "Quiz10Time.svg",
  [BadgeType.TRIPITAKA_COREANA]: "Notes80.svg",
  [BadgeType.EARLY_BIRD]: "MorningFirstTime.svg",
  [BadgeType.MIRACLE_MORNING_ADDICT]: "MorningFiveTime.svg",
};
