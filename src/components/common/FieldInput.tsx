// components/common/FieldInput.tsx
// 레이블 + 입력 필드를 한 블록으로 제공하는 컴포넌트.
// BodyCompositionBox 등 반복적인 레이블-인풋 패턴을 단순화
// 기본 HTML input의 모든 속성을 상속받으며,
// focusColor prop으로 모드별 포커스 링 색상을 결정

import type { InputHTMLAttributes } from 'react';

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;        // 레이블 텍스트
  focusColor?: string;  // 포커스 링 색상 클래스 (e.g. 'focus:ring-rose-500')
}

/**
 * 레이블이 포함된 스타일링된 입력 필드
 * 일반 <input>의 모든 HTML 속성(type, placeholder, step 등)을 그대로 사용할 수 있다.
 */
export function FieldInput({
  label,
  focusColor = 'focus:ring-black dark:focus:ring-white',
  className = '',
  ...props
}: FieldInputProps) {
  return (
    <div className="space-y-2">
      {/* 상단 레이블 */}
      <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1">
        {label}
      </label>
      {/* 스타일 적용 입력 필드 */}
      <input
        className={`w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 text-sm font-black outline-none focus:ring-2 ${focusColor} transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
