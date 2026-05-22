// components/common/Card.tsx
// 앱 전역에서 사용하는 기본 카드 컴포넌트.
// Card     : index.css의 .studio-card 유틸리티를 적용한 래퍼.
//            className prop으로 border, glow 등의 추가 스타일 수신
// CardTitle: 카드 내부 제목 컴포넌트. 선택적으로 아이콘을 좌측에 표시

import React, { type ReactNode } from 'react';

/**
 * 공통 카드 래퍼
 * @param className - 추가 Tailwind 클래스 (border-t-4, glow-indigo 등)
 */
export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // studio-card: index.css에 정의된 카드 기본 스타일 (bg, border, rounded, shadow 등)
    <div className={`studio-card ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * 카드 내부 제목 컴포넌트
 * @param icon      - 제목 왼쪽에 표시할 아이콘 (optional)
 * @param className - 추가 Tailwind 클래스
 */
export function CardTitle({ children, className = '', icon }: { children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3 tracking-tight ${className}`}>
      {/* 아이콘이 있을 때만 렌더링, 배경 칩으로 감쌈 */}
      {icon && <span className="p-2.5 bg-gray-100/50 dark:bg-white/5 backdrop-blur-md rounded-2xl text-gray-700 dark:text-gray-300 shadow-sm border border-black/5 dark:border-white/5">{icon}</span>}
      {children}
    </h2>
  );
}
