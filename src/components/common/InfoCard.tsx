// components/common/InfoCard.tsx
// 아이콘 + 제목 + 설명 텍스트를 가로로 배열하는 정보 카드 컴포넌트
// AI 추천 가이드, 전략 제안 등 읽기 전용 정보 표시에 사용
// 모드에 따라 iconColor와 hoverBg를 props로 넘겨 포인트 색상을 결정
//   - 학습 모드: text-indigo-500 / hover:bg-indigo-50
//   - 운동 모드: text-rose-500   / hover:bg-rose-50

import type { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;         // 좌측 아이콘
  title: string;           // 굵은 제목
  text: string;            // 설명 텍스트
  iconColor?: string;      // 아이콘 색상 클래스 (e.g. 'text-indigo-500')
  hoverBg?: string;        // 호버 배경색 클래스 (e.g. 'hover:bg-indigo-50')
}

/**
 * 아이콘 + 제목 + 본문을 담은 수평 정보 카드
 */
export function InfoCard({
  icon,
  title,
  text,
  iconColor = 'text-gray-400',
  hoverBg = 'hover:bg-gray-100 dark:hover:bg-[#0a0a0a]',
}: InfoCardProps) {
  return (
    <div className={`p-6 rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a] bg-gray-50/50 dark:bg-[#050505]/50 flex gap-5 items-start ${hoverBg} transition-all`}>
      {/* 아이콘 영역 */}
      <div className={`mt-1 ${iconColor}`}>{icon}</div>
      {/* 텍스트 영역 */}
      <div>
        <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-2 tracking-tight">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
