export const PointMilestone = {
    BICYCLE: 'BICYCLE',
    CAR: 'CAR',
    HELICOPTER: 'HELICOPTER',
    AIRPLANE: 'AIRPLANE',
    SPACESHIP: 'SPACESHIP'
} as const;

export type PointMilestone =
    (typeof PointMilestone)[keyof typeof PointMilestone];

export const POINT_MILESTONE_IMAGE: Record<PointMilestone, string> = {
    [PointMilestone.BICYCLE]: 'Bicycle.svg',
    [PointMilestone.CAR]: 'Car.svg',
    [PointMilestone.HELICOPTER]: 'Helicopter.svg',
    [PointMilestone.AIRPLANE]: 'Plain.svg',
    [PointMilestone.SPACESHIP]: 'SpaceShip.svg'
};