import { useMemo } from 'react';
import { Card, CardTitle } from '../../common/Card';
import { SparklesIcon, RocketIcon, RewardIcon } from '../../ui/Icons';
import { REWARDS } from './constants';

// RewardMilestoneBox 컴포넌트의 Props 타입 정의
interface RewardMilestoneBoxProps {
  userPoints: number;
}

// 등급 상승 진척도와 리워드 목록을 타임라인 형식으로 보여주는 마일스톤 컴포넌트
export function RewardMilestoneBox({ userPoints }: RewardMilestoneBoxProps) {
  // 현재 포인트를 기반으로 보상 레벨 인덱스를 추출
  const currentLevelIdx = useMemo(() => {
    const idx = [...REWARDS].reverse().findIndex(r => userPoints >= r.threshold);
    return idx === -1 ? 0 : REWARDS.length - 1 - idx;
  }, [userPoints]);

  const currentLevel = REWARDS[currentLevelIdx];

  // 다음 보상 등급 찾기
  const nextLevel = useMemo(() => {
    return REWARDS.find(r => r.threshold > userPoints);
  }, [userPoints]);

  // 다음 등급까지의 진척도를 퍼센트로 환산
  const progress = useMemo(() => {
    if (!nextLevel) return 100;
    const currentThreshold = currentLevel.threshold;
    const nextThreshold = nextLevel.threshold;
    return ((userPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  }, [userPoints, currentLevel, nextLevel]);

  return (
    <Card className="p-8 border-t-4 border-indigo-500 overflow-hidden relative">
      {
        // 배경 데코레이션 로켓 아이콘
      }
      <div className="absolute -right-20 -bottom-20 text-indigo-500/5 rotate-12 scale-150 grayscale">
        <RocketIcon size={200} />
      </div>

      <CardTitle icon={<SparklesIcon size={20} />}>리워드 마일스톤</CardTitle>
      
      {
        // 다음 레벨까지 남은 포인트 안내
      }
      <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-8">
        다음 단계 진화까지 <span className="text-indigo-500">{nextLevel ? nextLevel.threshold - userPoints : 0} PT</span>
      </p>
      
      {
        // 마일스톤 세로 타임라인 트랙
      }
      <div className="relative pt-6 pb-4">
        {
          // 비활성 상태 트랙 라인
        }
        <div className="absolute left-6 top-0 bottom-0 w-1.5 bg-gray-100 dark:bg-[#1a1a1a] rounded-full"></div>
        {
          // 활성 상태 게이지 라인 (progress 비율 반영)
        }
        <div 
          className="absolute left-6 top-0 w-1.5 bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
          style={{ height: `${progress}%` }}
        ></div>
        
        {
          // 레벨별 아이콘 및 텍스트 리스트
        }
        <div className="space-y-8 relative">
          {REWARDS.map((r, i) => {
            const isUnlocked = userPoints >= r.threshold;
            return (
              <div 
                key={r.name} 
                className={`flex items-center gap-5 transition-all duration-500 ${isUnlocked ? 'opacity-100 scale-100' : 'opacity-25 scale-95 grayscale'}`}
              >
                <div className="relative z-10 shrink-0">
                  <RewardIcon index={i} size={72} />
                  {isUnlocked && <div className="absolute -inset-2 bg-indigo-500/20 rounded-3xl blur-lg -z-10"></div>}
                </div>
                <div>
                  <p className={`text-[0.55rem] font-black uppercase tracking-widest ${isUnlocked ? 'text-indigo-500' : 'text-gray-400'}`}>Level 0{i+1}</p>
                  <p className="text-base font-black tracking-tight">{r.name}</p>
                  <p className="text-[0.6rem] text-gray-400 font-bold mt-0.5">{r.threshold.toLocaleString()} PT~</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
