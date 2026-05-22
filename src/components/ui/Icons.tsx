import {
  Book,
  Dumbbell,
  Users,
  Settings,
  Sun,
  Moon,
  Upload,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  Pencil,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  Target,
  PlayCircle,
  Coffee,
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  ThumbsUp,
  Trophy,
  Search,
  Bike,
  Motorbike,
  Car,
  Helicopter,
  Plane,
  Rocket,
  ChevronDown,
  Menu,
  Layers,
  Smartphone,
  Bell
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'size'> {
  size?: number | string;
}

// Map Lucide icons with default props corresponding to the original ones
export const BookIcon = ({ size = 18, ...props }: IconProps) => <Book size={size} {...props} />;
export const DumbbellIcon = ({ size = 18, ...props }: IconProps) => <Dumbbell size={size} {...props} />;
export const UsersIcon = ({ size = 18, ...props }: IconProps) => <Users size={size} {...props} />;
export const SettingsIcon = ({ size = 18, ...props }: IconProps) => <Settings size={size} {...props} />;
export const SunIcon = ({ size = 18, ...props }: IconProps) => <Sun size={size} {...props} />;
export const MoonIcon = ({ size = 18, ...props }: IconProps) => <Moon size={size} {...props} />;
export const UploadIcon = ({ size = 24, ...props }: IconProps) => <Upload size={size} {...props} />;
export const SparklesIcon = ({ size = 18, ...props }: IconProps) => <Sparkles size={size} {...props} />;
export const PlayIcon = ({ size = 20, fill = 'currentColor', ...props }: IconProps) => <Play size={size} fill={fill} {...props} />;
export const PauseIcon = ({ size = 20, fill = 'currentColor', ...props }: IconProps) => <Pause size={size} fill={fill} {...props} />;
export const ResetIcon = ({ size = 18, ...props }: IconProps) => <RotateCcw size={size} {...props} />;
export const CheckIcon = ({ size = 12, ...props }: IconProps) => <Check size={size} {...props} />;
export const EditIcon = ({ size = 14, ...props }: IconProps) => <Pencil size={size} {...props} />;
export const ExternalLinkIcon = ({ size = 14, ...props }: IconProps) => <ExternalLink size={size} {...props} />;
export const TrendIcon = ({ size = 16, ...props }: IconProps) => <TrendingUp size={size} {...props} />;
export const AlertIcon = ({ size = 16, ...props }: IconProps) => <AlertCircle size={size} {...props} />;
export const TargetIcon = ({ size = 16, ...props }: IconProps) => <Target size={size} {...props} />;
export const PlayCircleIcon = ({ size = 24, ...props }: IconProps) => <PlayCircle size={size} {...props} />;
export const CoffeeIcon = ({ size = 16, ...props }: IconProps) => <Coffee size={size} {...props} />;
export const PlusIcon = ({ size = 20, ...props }: IconProps) => <Plus size={size} {...props} />;
export const SaveIcon = ({ size = 16, ...props }: IconProps) => <Save size={size} {...props} />;
export const TrashIcon = ({ size = 14, ...props }: IconProps) => <Trash2 size={size} {...props} />;
export const ArrowUpIcon = ({ size = 14, ...props }: IconProps) => <ArrowUp size={size} {...props} />;
export const ArrowDownIcon = ({ size = 14, ...props }: IconProps) => <ArrowDown size={size} {...props} />;
export const ActivityIcon = ({ size = 18, ...props }: IconProps) => <Activity size={size} {...props} />;
export const CalendarIcon = ({ size = 18, ...props }: IconProps) => <Calendar size={size} {...props} />;
export const StarIcon = ({ size = 18, ...props }: IconProps) => <Star size={size} {...props} />;
export const ClockIcon = ({ size = 18, ...props }: IconProps) => <Clock size={size} {...props} />;
export const ChevronLeftIcon = ({ size = 18, ...props }: IconProps) => <ChevronLeft size={size} {...props} />;
export const ChevronRightIcon = ({ size = 18, ...props }: IconProps) => <ChevronRight size={size} {...props} />;
export const XIcon = ({ size = 18, ...props }: IconProps) => <X size={size} {...props} />;
export const MessageSquareIcon = ({ size = 14, ...props }: IconProps) => <MessageSquare size={size} {...props} />;
export const ThumbsUpIcon = ({ size = 14, ...props }: IconProps) => <ThumbsUp size={size} {...props} />;
export const TrophyIcon = ({ size = 20, ...props }: IconProps) => <Trophy size={size} {...props} />;
export const SearchIcon = ({ size = 16, ...props }: IconProps) => <Search size={size} {...props} />;

// Reward Icons
export const BicycleIcon = ({ size = 24, ...props }: IconProps) => <Bike size={size} {...props} />;
export const MotorcycleIcon = ({ size = 24, ...props }: IconProps) => <Motorbike size={size} {...props} />;
export const CarIcon = ({ size = 24, ...props }: IconProps) => <Car size={size} {...props} />;
export const HelicopterIcon = ({ size = 24, ...props }: IconProps) => <Helicopter size={size} {...props} />;
export const PlaneIcon = ({ size = 24, ...props }: IconProps) => <Plane size={size} {...props} />;
export const RocketIcon = ({ size = 24, ...props }: IconProps) => <Rocket size={size} {...props} />;

// Additional Navigation / Layout UI Icons
export const ChevronDownIcon = ({ size = 18, ...props }: IconProps) => <ChevronDown size={size} {...props} />;
export const MenuIcon = ({ size = 18, ...props }: IconProps) => <Menu size={size} {...props} />;
export const LayersIcon = ({ size = 18, ...props }: IconProps) => <Layers size={size} {...props} />;
export const SmartphoneIcon = ({ size = 18, ...props }: IconProps) => <Smartphone size={size} {...props} />;
export const BellIcon = ({ size = 18, ...props }: IconProps) => <Bell size={size} {...props} />;

// Badge Images
import Badge180Days from '../../assets/images/badge/180Days.svg';
import Badge30Days from '../../assets/images/badge/30Days.svg';
import Badge90Days from '../../assets/images/badge/90Days.svg';
import BadgeFirstPlan from '../../assets/images/badge/FirstPlan.svg';
import BadgeMorningFirstTime from '../../assets/images/badge/MorningFirstTime.svg';
import BadgeMorningFiveTime from '../../assets/images/badge/MorningFiveTime.svg';
import BadgeNotes80 from '../../assets/images/badge/Notes80.svg';
import BadgeQuiz10Time from '../../assets/images/badge/Quiz10Time.svg';
import BadgeSpaceShip from '../../assets/images/badge/SpaceShip.svg';

// Tier Images
import TierBicycle from '../../assets/images/tier/Bicycle.svg';
import TierCar from '../../assets/images/tier/Car.svg';
import TierHelicopter from '../../assets/images/tier/Helicopter.svg';
import TierPlane from '../../assets/images/tier/Plain.svg';

const BADGE_MAP: Record<string, string> = {
  '180Days': Badge180Days,
  '30Days': Badge30Days,
  '90Days': Badge90Days,
  'FirstPlan': BadgeFirstPlan,
  'MorningFirstTime': BadgeMorningFirstTime,
  'MorningFiveTime': BadgeMorningFiveTime,
  'Notes80': BadgeNotes80,
  'Quiz10Time': BadgeQuiz10Time,
  'SpaceShip': BadgeSpaceShip,
};

const REWARD_MAP = [
  TierBicycle,
  TierCar,
  TierHelicopter,
  TierPlane,
  BadgeSpaceShip
];

// ------------------------------------------------------------------
//  BadgeIcon – Renders actual SVG badges
// ------------------------------------------------------------------
export const BadgeIcon = ({ level, size = 32 }: { level: string; size?: number }) => {
  const imgSrc = BADGE_MAP[level] || BADGE_MAP['FirstPlan'];
  return (
    <div 
      className="flex items-center justify-center drop-shadow-xl"
      style={{ width: size, height: size }}
    >
      <img src={imgSrc} alt={level} width={size} height={size} className="object-contain" />
    </div>
  );
};

// ------------------------------------------------------------------
//  RewardIcon – Renders actual SVG milestone rewards
// ------------------------------------------------------------------
export const RewardIcon = ({ index, size = 40 }: { index: number; size?: number }) => {
  const imgSrc = REWARD_MAP[index] || TierBicycle;
  return (
    <div 
      className="flex items-center justify-center drop-shadow-xl"
      style={{ width: size, height: size }}
    >
      <img src={imgSrc} alt={`Reward ${index}`} width={size} height={size} className="object-contain" />
    </div>
  );
};
