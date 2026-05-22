import { useState } from 'react';
import { Card } from '../../common/Card';
import { SparklesIcon, BadgeIcon } from '../../ui/Icons';

// 획득한 배지들의 목록을 2열 그리드로 나열해 주는 컬렉션 박스 컴포넌트
export function BadgeCollectionBox() {
  const [showAll, setShowAll] = useState(false);

  const badgeLevels = [
    { id: 'FirstPlan', label: '첫 플랜' },
    { id: '30Days', label: '30일 연속' },
    { id: '90Days', label: '90일 연속' },
    { id: '180Days', label: '180일 연속' },
    { id: 'MorningFirstTime', label: '첫 기상' },
    { id: 'MorningFiveTime', label: '기상 5회' },
    { id: 'Quiz10Time', label: '퀴즈 마니아' },
    { id: 'Notes80', label: '노트 작성자' },
  ];

  // 사용자 획득 배지 ID 목록 (Mock 데이터)
  const ownedBadgeIds = ['FirstPlan', '30Days', 'MorningFirstTime', 'Quiz10Time'];

  // 표시할 배지 목록 필터링
  const displayBadges = showAll
    ? badgeLevels
    : badgeLevels.filter((b) => ownedBadgeIds.includes(b.id));

  return (
    <Card className="p-8 border-t-4 border-indigo-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
          <span className="p-2.5 bg-gray-100/50 dark:bg-white/5 backdrop-blur-md rounded-2xl text-gray-700 dark:text-gray-300 shadow-sm border border-black/5 dark:border-white/5">
            <SparklesIcon size={20} />
          </span>
          배지 컬렉션
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3.5 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-950/80 active:scale-95 transition-all shadow-sm cursor-pointer border border-indigo-100/50 dark:border-indigo-900/50"
        >
          {showAll ? '내 배지만 보기' : '모든 배지 보기'}
        </button>
      </div>
      
      {/* 배지 카드 그리드 영역 */}
      <div className="grid grid-cols-2 gap-4">
        {displayBadges.map((b) => {
          const isOwned = ownedBadgeIds.includes(b.id);
          return (
            <div 
              key={b.id} 
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                isOwned
                  ? 'bg-gray-50/50 dark:bg-[#18181b]/50 border-gray-100 dark:border-[#27272a] hover:scale-105 hover:border-indigo-200 dark:hover:border-indigo-800'
                  : 'bg-gray-50/20 dark:bg-[#18181b]/20 border-gray-100/40 dark:border-[#27272a]/40 opacity-40 grayscale select-none'
              }`}
            >
              <div className="relative">
                <BadgeIcon level={b.id} size={72} />
                {!isOwned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 rounded-full">
                    <svg className="w-6.5 h-6.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-[0.65rem] font-black uppercase tracking-widest ${
                isOwned 
                  ? 'text-gray-600 dark:text-gray-300' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
