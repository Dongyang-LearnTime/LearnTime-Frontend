import { useEffect } from 'react';

export const usePageTitle = (title: string, restoreOnUnmount: boolean = false) => {
  useEffect(() => {
    // 이전 제목 저장 (나중에 이 컴포넌트를 떠날 때 복구하기 위해 필요)
    const prevTitle = document.title;

    document.title = title; // 제목 변경

    // 이 페이지를 떠날 때 이전 제목으로 되돌림 → 다른 페이지가 title을 설정하지 않는 경우 대비
    return () => {
      if (restoreOnUnmount) {
        document.title = prevTitle;
      }
    };
  }, [title, restoreOnUnmount]);
}