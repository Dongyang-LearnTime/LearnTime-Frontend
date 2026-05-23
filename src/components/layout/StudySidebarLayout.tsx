import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, SettingsIcon, BookIcon } from '../ui/Icons';
import { useStudyStore } from '../../store/useStudyStore';
import type { StudyProgressIndicatorResponse } from '../../pages/study/api/StudyApi';

interface StudySidebarLayoutProps {
  children: React.ReactNode;
}

// 햄버거 메뉴 및 화살표 아이콘 임시 정의
const MenuIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const ChevronLeftIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

export function StudySidebarLayout({ children }: StudySidebarLayoutProps) {
  const navigate = useNavigate();
  const { studyId } = useParams<{ studyId?: string }>();
  
  const { progresses, fetchProgresses, isLoading } = useStudyStore();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchProgresses();
  }, [fetchProgresses]);

  // 창 크기에 따른 자동 접힘 처리 (반응형)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로드 시 실행
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden max-w-450 mx-auto w-full relative">
      {/* 
        왼쪽 사이드바 (노션 스타일 + 반응형 빡세게) 
        - isExpanded에 따라 width가 변동됨
        - 모바일(md 미만)에서는 절대 위치(absolute) 덮어쓰기 메뉴로 동작하거나 축소됨
      */}
      <aside 
        className={`z-20 flex flex-col border-r border-gray-200 dark:border-[#222] bg-white dark:bg-[#050505] transition-all duration-300 ease-in-out shadow-[2px_0_10px_rgba(0,0,0,0.02)] dark:shadow-[2px_0_10px_rgba(0,0,0,0.2)]
          ${isExpanded ? 'w-64 absolute md:relative h-full' : 'w-0 md:w-15 overflow-hidden'}
        `}
      >
        <div className={`p-4 flex items-center border-b border-gray-100 dark:border-[#1a1a1a] transition-all duration-300 ${isExpanded ? 'justify-between px-6' : 'justify-center'}`}>
          <span className={`text-xs font-black uppercase tracking-widest text-gray-400 whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>내 스터디</span>
          
          <div className="flex items-center gap-1">
            {isExpanded && (
              <button 
                onClick={() => navigate('/study/plan/create')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer shrink-0"
                title="새 스터디 생성"
              >
                <PlusIcon size={14} />
              </button>
            )}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer shrink-0 hidden md:block"
            >
              {isExpanded ? <ChevronLeftIcon size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {isLoading ? (
            <div className="text-center py-4 text-xs font-bold text-gray-400">로딩중...</div>
          ) : progresses.length === 0 ? (
            <div className={`text-center py-4 text-xs text-gray-400 font-bold ${isExpanded ? '' : 'hidden'}`}>목록이 없습니다</div>
          ) : (
            progresses.map((study: StudyProgressIndicatorResponse) => {
              const isActive = studyId === study.studyId.toString();
              return (
                <button
                  key={study.studyId}
                  onClick={() => navigate(`/study/${study.studyId}`)}
                  className={`flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left w-full cursor-pointer
                    ${isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-black shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111] font-bold'
                    }
                    ${isExpanded ? 'px-3' : 'justify-center px-0'}
                  `}
                  title={!isExpanded ? study.studyTitle : undefined}
                >
                  <span className="text-base leading-none shrink-0 opacity-70">
                    <BookIcon size={16} />
                  </span>
                  <span className={`truncate transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                    {study.studyTitle}
                  </span>
                  {isExpanded && study.hasTodayPlan && (
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full ml-auto shrink-0 shadow-[0_0_5px_rgba(244,63,94,0.5)] animate-pulse" title="오늘의 진도 있음" />
                  )}
                  {!isExpanded && study.hasTodayPlan && (
                    <span className="absolute right-1 top-1 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.5)] border border-white dark:border-[#050505]" />
                  )}
                </button>
              );
            })
          )}
        </nav>

        {/* 하단 유틸리티 영역 */}
        <div className="p-3 border-t border-gray-100 dark:border-[#1a1a1a]">
          <button 
            onClick={() => navigate('/main/settings')}
            className={`flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors w-full p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#111] cursor-pointer
              ${isExpanded ? 'gap-2 justify-start' : 'justify-center px-0'}
            `}
            title={!isExpanded ? "설정" : undefined}
          >
            <SettingsIcon size={16} /> 
            <span className={`truncate transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
              관리 및 설정
            </span>
          </button>
        </div>
      </aside>

      {/* 모바일 화면에서 메뉴 닫기용 오버레이 */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-10 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 우측 메인 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/30 dark:bg-[#020202] transition-all duration-500 w-full relative">
        {/* 모바일 전용 햄버거 메뉴 띄우기 버튼 */}
        <button 
          onClick={() => setIsExpanded(true)}
          className="md:hidden absolute top-4 left-4 z-10 p-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl shadow-sm text-gray-600 dark:text-gray-300"
        >
          <MenuIcon size={18} />
        </button>
        <div className="md:mt-0 mt-12 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
