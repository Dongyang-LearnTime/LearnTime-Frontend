// 앱 전체의 공통 레이아웃 컴포넌트 (상단 헤더 디자인)
//
// 주요 기능:
//   - 상단 헤더바: 로고, 네비게이션, 다크/라이트 모드 토글
//   - 데스크탑에서는 가로형 네비게이션, 모바일에서는 햄버거 메뉴
//   - isDarkMode 상태로 <html> 태그에 .dark 클래스를 토글하여 테마 전환
//   - <Outlet />을 통해 현재 경로의 페이지 컴포넌트를 렌더링

import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  BookIcon, DumbbellIcon, UsersIcon, SettingsIcon, SunIcon, MoonIcon, CalendarIcon,
  ChevronDownIcon, MenuIcon, XIcon, BellIcon, AlertIcon
} from '../ui/Icons';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: 'study' | 'exercise' | 'community' | 'system';
}

export function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStudyExpanded, setIsStudyExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: '오늘의 학습 계획',
      content: '수학 단원평가 대비 오답노트 작성을 완료할 시간입니다.',
      date: '10분 전',
      isRead: false,
      type: 'study',
    },
    {
      id: '2',
      title: '목표 달성 알림',
      content: '오늘 운동 목표(하체 스트레칭 20분)를 완료했습니다!',
      date: '2시간 전',
      isRead: false,
      type: 'exercise',
    },
    {
      id: '3',
      title: '새로운 댓글',
      content: '"공부 꿀팁 공유합니다" 글에 새로운 댓글이 달렸습니다.',
      date: '어제',
      isRead: true,
      type: 'community',
    },
    {
      id: '4',
      title: '시스템 점검 안내',
      content: '서비스 안정화를 위한 정기 점검이 예정되어 있습니다.',
      date: '2일 전',
      isRead: true,
      type: 'system',
    },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 외부 클릭 시 알림 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // isDarkMode 변경 시 <html> 클래스를 업데이트하여 Tailwind dark 변수 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const currentPath = location.pathname;

  /**
   * 상단 네비게이션 항목 컴포넌트 (인라인 정의)
   */
  const NavItem = ({ to, icon, label, active, onClickOverride, hasToggle, isExpanded }: { to: string; icon: React.ReactNode; label: string; active: boolean; onClickOverride?: () => void; hasToggle?: boolean; isExpanded?: boolean }) => (
    <div
      onClick={() => onClickOverride ? onClickOverride() : navigate(to)}
      className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 group ${active
          ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/20 dark:shadow-white/20'
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
        }`}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-inherit' : 'text-gray-400 group-hover:text-inherit'}`}>
        {icon}
      </div>
      <span className="text-[0.95rem] font-bold tracking-tight whitespace-nowrap">{label}</span>
      {hasToggle && (
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${active ? 'text-inherit' : 'text-gray-400'}`}>
          <ChevronDownIcon size={16} />
        </div>
      )}
    </div>
  );

  return (
    <div className="gemini-bg min-h-screen text-gray-900 dark:text-[#ededed] flex flex-col transition-colors duration-500 font-sans selection:bg-indigo-500/30">

      {/* ── 상단 헤더바 (Floating Glassmorphism) ── */}
      <header className="sticky top-4 z-50 max-w-[1800px] w-[calc(100%-2rem)] lg:w-[calc(100%-5rem)] mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 rounded-full shadow-xl shadow-gray-200/50 dark:shadow-black/50 transition-all duration-500">
        <div className="px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* 로고 영역 */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/main/study')}>
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black font-black text-sm shadow-xl flex-shrink-0">LT</div>
            <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block animate-in fade-in duration-500">Learn-Time</h1>
          </div>

          {/* 데스크탑 네비게이션 (lg 이상) */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavItem to="/main/schedule" icon={<CalendarIcon size={18} />} label="일정 생성" active={currentPath.includes('schedule')} />

            <div className="relative">
              <NavItem
                to="/main/study"
                icon={<BookIcon size={18} />}
                label="학습 스튜디오"
                active={currentPath.includes('study')}
                hasToggle={true}
                isExpanded={isStudyExpanded}
                onClickOverride={() => {
                  if (currentPath.includes('study')) {
                    setIsStudyExpanded(!isStudyExpanded);
                  } else {
                    setIsStudyExpanded(true);
                    navigate('/main/study');
                  }
                }}
              />
              {/* 학습 스튜디오 과목 드롭다운 */}
              {isStudyExpanded && (
                <div className="absolute top-full left-0 mt-3 w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {[
                    { id: 'math', name: '수학' },
                    { id: 'english', name: '영어' },
                    { id: 'science', name: '과학' },
                    { id: 'history', name: '역사' },
                  ].map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubject(sub.id);
                        setIsStudyExpanded(false);
                      }}
                      className={`text-sm py-3 px-4 cursor-pointer font-medium transition-all ${selectedSubject === sub.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                        }`}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <NavItem to="/main/exercise" icon={<DumbbellIcon size={18} />} label="운동 랩" active={currentPath.includes('exercise')} />
            <NavItem to="/main/community" icon={<UsersIcon size={18} />} label="커뮤니티" active={currentPath.includes('community')} />
            <NavItem to="/main/settings" icon={<SettingsIcon size={18} />} label="설정" active={currentPath.includes('settings')} />
          </nav>

          {/* 우측 컨트롤 영역 */}
          <div className="flex items-center gap-3">
            {/* 알림창 영역 */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300"
                title="알림"
              >
                <BellIcon size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 알림 드롭다운 창 */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {/* 알림 헤더 */}
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1a1a1a] flex items-center justify-between bg-gray-50/50 dark:bg-[#0e0e0e]/50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-gray-900 dark:text-white">알림</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                          새로운 알림 {unreadCount}개
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                        >
                          모두 읽음
                        </button>
                        <span className="text-gray-300 dark:text-gray-700 text-xs">|</span>
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                        >
                          모두 삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 알림 목록 본문 */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-[#161616]">
                    {notifications.length === 0 ? (
                      <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#121212] flex items-center justify-center text-gray-400 dark:text-gray-600 mb-3">
                          <BellIcon size={24} />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">새로운 알림이 없습니다.</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">학습이나 운동 일정을 채우고 소식을 받아보세요!</p>
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleNotificationRead(item.id)}
                          className={`relative px-5 py-4 flex gap-3 cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-[#121212] group ${!item.isRead ? 'bg-indigo-50/20 dark:bg-indigo-950/5' : ''
                            }`}
                        >
                          {/* 읽지 않은 알림을 위한 왼쪽 색상 인디케이터 바 */}
                          {!item.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r-md" />
                          )}

                          {/* 알림 유형별 아이콘 */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === 'study' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' :
                              item.type === 'exercise' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                                item.type === 'community' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' :
                                  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                            {item.type === 'study' && <BookIcon size={16} />}
                            {item.type === 'exercise' && <DumbbellIcon size={16} />}
                            {item.type === 'community' && <UsersIcon size={16} />}
                            {item.type === 'system' && <AlertIcon size={16} />}
                          </div>

                          {/* 알림 메세지 영역 */}
                          <div className="flex-grow min-w-0 pr-2">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className={`text-xs font-semibold ${item.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                {item.title}
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{item.date}</span>
                            </div>
                            <p className={`text-xs leading-relaxed ${item.isRead ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                              {item.content}
                            </p>
                          </div>

                          {/* 알림 개별 삭제 버튼 */}
                          <button
                            onClick={(e) => deleteNotification(item.id, e)}
                            className="p-1 rounded-md text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 self-start"
                            title="알림 삭제"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300"
              title={isDarkMode ? '라이트 모드' : '다크 모드'}
            >
              {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>

            {/* 모바일 햄버거 메뉴 토글 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300"
            >
              {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* 모바일 네비게이션 드롭다운 (lg 미만) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 rounded-3xl shadow-2xl px-6 py-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
            <NavItem to="/main/schedule" icon={<CalendarIcon size={18} />} label="일정 생성" active={currentPath.includes('schedule')} />

            <NavItem
              to="/main/study"
              icon={<BookIcon size={18} />}
              label="학습 스튜디오"
              active={currentPath.includes('study')}
              hasToggle={true}
              isExpanded={isStudyExpanded}
              onClickOverride={() => {
                if (currentPath.includes('study')) {
                  setIsStudyExpanded(!isStudyExpanded);
                } else {
                  setIsStudyExpanded(true);
                  navigate('/main/study');
                }
              }}
            />
            {/* 모바일 학습 스튜디오 과목 목록 */}
            {isStudyExpanded && (
              <div className="pl-10 pr-4 py-2 space-y-1">
                {[
                  { id: 'math', name: '수학' },
                  { id: 'english', name: '영어' },
                  { id: 'science', name: '과학' },
                  { id: 'history', name: '역사' },
                ].map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubject(sub.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-sm py-2 px-4 rounded-xl cursor-pointer font-medium transition-all ${selectedSubject === sub.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                      }`}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}

            <NavItem to="/main/exercise" icon={<DumbbellIcon size={18} />} label="운동 랩" active={currentPath.includes('exercise')} />
            <NavItem to="/main/community" icon={<UsersIcon size={18} />} label="커뮤니티" active={currentPath.includes('community')} />
            <NavItem to="/main/settings" icon={<SettingsIcon size={18} />} label="설정" active={currentPath.includes('settings')} />
          </div>
        )}
      </header>

      {/* ── 메인 콘텐츠 영역 ── */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto max-w-[1800px] mx-auto w-full transition-all duration-500">
        <Outlet context={{ selectedSubject }} />
      </main>
    </div>
  );
}
