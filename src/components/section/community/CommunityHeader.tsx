import { RewardIcon } from '../../ui/Icons';

// CommunityHeader 컴포넌트의 Props 타입 정의
interface CommunityHeaderProps {
  currentLevelIdx: number;
  currentLevelName: string;
  userPoints: number;
}

// 커뮤니티 타이틀과 현재 유저의 리워드 정보를 보여주는 헤더 컴포넌트
export function CommunityHeader({
  currentLevelIdx,
  currentLevelName,
  userPoints,
}: CommunityHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 studio-card glow-indigo">
      {
        // 제목 및 서브타이틀 영역
      }
      <div>
        <h2 className="text-4xl font-black tracking-tight mb-2 text-gradient">커뮤니티 광장</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">3D 리워드와 함께하는 즐거운 성장 시스템.</p>
      </div>

      {
        // 우측 사용자 모빌리티 등급 및 포인트 카드 영역
      }
      <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-[#050505] rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a]">
        <RewardIcon index={currentLevelIdx} size={80} />
        <div>
          <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">현재 모빌리티 등급</p>
          <p className="text-2xl font-black tracking-tighter text-indigo-600">{currentLevelName}</p>
          <p className="text-[0.65rem] font-bold text-gray-400">{userPoints} <span className="opacity-50 font-medium">POINTS</span></p>
        </div>
      </div>
    </header>
  );
}
