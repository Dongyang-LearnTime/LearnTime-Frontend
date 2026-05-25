import React, { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  className?: string; // 예: "w-12 h-12"
  fallbackSizeClass?: string; // 예: "text-xl"
}

/**
 * 전역적으로 프로필 사진 및 기본 아바타(닉네임 첫 글자 기반)의 디자인을 통일하기 위한 컴포넌트입니다.
 * - 이미지가 존재할 경우: 둥글게 잘라진 프로필 사진을 렌더링합니다.
 * - 이미지가 존재하지 않거나 로딩에 실패한 경우: 닉네임 첫 글자를 활용한 그라데이션 아바타를 렌더링합니다.
 */
export default function Avatar({
  src,
  alt,
  className = "w-12 h-12",
  fallbackSizeClass = "text-xl"
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const firstLetter = alt ? alt.charAt(0).toUpperCase() : 'U';

  // src가 바뀌면 에러 상태를 초기화합니다.
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} rounded-full object-cover shrink-0 select-none`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black ${fallbackSizeClass} shadow-md shrink-0 select-none`}
    >
      {firstLetter}
    </div>
  );
}
