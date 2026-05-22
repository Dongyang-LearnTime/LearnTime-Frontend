import { Card, CardTitle } from '../../common/Card';
import { TrophyIcon } from '../../ui/Icons';
import type { User } from './types';

// GlobalRankingBox 컴포넌트의 Props 타입 정의
interface GlobalRankingBoxProps {
  ranking: User[];
}

// 사용자 글로벌 랭킹을 순위별로 시각화하여 보여주는 카드 컴포넌트
export function GlobalRankingBox({ ranking }: GlobalRankingBoxProps) {
  return (
    <Card className="p-8 border-t-4 border-indigo-500">
      <CardTitle icon={<TrophyIcon size={20} />}>글로벌 랭킹</CardTitle>
      
      {
        // 랭킹 리스트 컨테이너
      }
      <div className="space-y-4">
        {ranking.map((user, idx) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl group transition-all hover:bg-white dark:hover:bg-black">
            {
              // 순위(메달 색상 적용) 및 이름 표시 영역
            }
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${idx === 0 ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-500/20' : idx === 1 ? 'bg-slate-300 text-white shadow-lg shadow-slate-500/20' : idx === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 border border-gray-100 dark:border-white/5'}`}>
                {user.rank}
              </span>
              <span className="font-bold text-sm">{user.name}</span>
            </div>

            {
              // 포인트 뱃지 영역
            }
            <span className="text-[0.65rem] font-black text-indigo-500 uppercase tracking-widest">{user.points.toLocaleString()} PT</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
