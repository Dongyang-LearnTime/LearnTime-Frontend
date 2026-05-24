import { useEffect } from 'react';

export const usePageTitle = (title: string, restoreOnUnmount: boolean = false) => {
  useEffect(() => {
    // 이전 제목 저장 (나중에 이 컴포넌트를 떠날 때 복구하기 위해 필요)
    const prevTitle = document.title;

    // 'learn-time |' 접두사가 이미 포함되어 있으면 그대로 사용, 없으면 자동 추가
    const formattedTitle = title.startsWith('learn-time |') 
      ? title 
      : `learn-time | ${title}`;

    if (document.title !== formattedTitle) {
      document.title = formattedTitle;
    }

    // 이 페이지를 떠날 때 이전 제목으로 되돌림 → 다른 페이지가 title을 설정하지 않는 경우 대비
    return () => {
      if (restoreOnUnmount && document.title !== prevTitle) {
        document.title = prevTitle;
      }
    };
  }, [title, restoreOnUnmount]);
}