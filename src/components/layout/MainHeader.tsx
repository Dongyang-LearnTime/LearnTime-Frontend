import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import siteLogo from '../../assets/site-logo.svg';
import { useNotificationStore } from '../../store/useNotificationStore';
import { NotificationApi } from '../../pages/notification/notificationApi';
import { axiosInstance } from '../../app/apiClient';
import { UserSearchBar } from './UserSearchBar';
import {
  BookIcon, DumbbellIcon, UsersIcon, SunIcon, MoonIcon, CalendarIcon,
  ChevronDownIcon, MenuIcon, XIcon, BellIcon, MessageSquareIcon
} from '../ui/Icons';
import { UserCircle } from 'lucide-react';

export function MainHeader() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Auth state
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  // Menu states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isInviteMenuOpen, setIsInviteMenuOpen] = useState(false);
  const [isNotificationListLoaded, setIsNotificationListLoaded] = useState(false);
  const [isNotificationListLoading, setIsNotificationListLoading] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const inviteMenuRef = useRef<HTMLDivElement>(null);

  // Notification logic (from original NotificationDropdown)
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const markAsReadLocal = useNotificationStore((state) => state.markAsReadLocal);
  const markAllAsReadLocal = useNotificationStore((state) => state.markAllAsReadLocal);
  const deleteNotificationLocal = useNotificationStore((state) => state.deleteNotificationLocal);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const countRes = await NotificationApi.getUnreadCount();
        setUnreadCount(Number(countRes.unreadCount));
      } catch (error) {
        console.error("Failed to load unread notification count:", error);
      }
    };
    fetchUnreadCount();
  }, [setUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (inviteMenuRef.current && !inviteMenuRef.current.contains(event.target as Node)) {
        setIsInviteMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReadNotification = async (notificationId: number) => {
    if (notificationId < 0) {
      markAsReadLocal(notificationId);
      return;
    }
    try {
      await NotificationApi.readNotification(notificationId);
      markAsReadLocal(notificationId);
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
    }
  };

  const handleNotificationClick = async (notificationId: number, isRead: boolean, type: string) => {
    if (!isRead) {
      await handleReadNotification(notificationId);
    }
    setIsNotificationOpen(false);
    if (type.includes("FRIEND_REQUEST")) {
      navigate("/friend/requests");
    } else if (type.includes("STUDY_INVITATION")) {
      navigate("/study/invitation");
    } else if (type.includes("MESSAGE") || type.includes("NOTE")) {
      navigate("/messages");
    } else if (type.includes("CALENDAR")) {
      navigate("/schedule");
    } else {
      navigate("/notifications");
    }
  };

  const handleReadAllNotifications = async () => {
    try {
      await NotificationApi.readAllNotifications();
      markAllAsReadLocal();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (event: React.MouseEvent, notificationId: number) => {
    event.stopPropagation();
    if (notificationId < 0) {
      deleteNotificationLocal(notificationId);
      return;
    }
    try {
      await NotificationApi.deleteNotification(notificationId);
      deleteNotificationLocal(notificationId);
    } catch (error) {
      console.error(`Failed to delete notification ${notificationId}:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      localStorage.removeItem('login_hint');
      navigate('/login');
    }
  };

  const loadNotificationsIfNeeded = async () => {
    if (isNotificationListLoaded || isNotificationListLoading) return;

    try {
      setIsNotificationListLoading(true);
      const listRes = await NotificationApi.getNotifications();
      setNotifications(listRes.content, listRes.hasNext, listRes.nextCursor);
      setIsNotificationListLoaded(true);
    } catch (error) {
      console.error("Failed to load notification list:", error);
    } finally {
      setIsNotificationListLoading(false);
    }
  };

  const handleToggleNotification = () => {
    const nextOpen = !isNotificationOpen;
    setIsNotificationOpen(nextOpen);
    if (nextOpen) {
      void loadNotificationsIfNeeded();
    }
  };

  // 네비게이션 아이템 컴포넌트
  const NavItem = ({ to, icon, label, active, onClickOverride, hasToggle, isExpanded }: {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClickOverride?: () => void;
    hasToggle?: boolean;
    isExpanded?: boolean;
  }) => {
    const handleNavigation = () => {
      if (onClickOverride) {
        onClickOverride();
      } else {
        // 이미 학습 스튜디오 상세 영역 내에 있다면 중복 리다이렉터 호출을 차단하여 쿼리 및 ID 유실 방지
        if (to === '/study' && location.pathname.startsWith('/study')) {
          return;
        }
        navigate(to);
      }
    };

    return (
      <div
        onClick={handleNavigation}
        className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 group ${active
            ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md shadow-gray-900/20 dark:shadow-white/20'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
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
  };

  return (
    <>
      {/* ── 상위 헤더 : 로고 · 알림 · 다크모드 · 로그아웃 ── */}
      {/* 데스크탑에서는 스크롤 시 위로 사라짐(static), 모바일에서는 상단 고정(sticky) */}
      <header className="lg:relative sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* 로고 */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-transparent rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <img src={siteLogo} className="w-7.5 h-7.5 dark:invert" alt="Logo" />
            </div>
            <span className="text-xl font-extrabold tracking-tight [word-spacing:-0.15em] text-gray-900 dark:text-white hidden sm:block">Learn Time</span>
          </div>

          {/* 우측 컨트롤 */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* 사용자 검색 (xl 이상) */}
            <div className="hidden xl:block">
              <UserSearchBar />
            </div>

            {/* 알림 */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleToggleNotification}
                className="relative p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300"
              >
                <BellIcon size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* 알림 드롭다운 */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-[#222] rounded-3xl shadow-xl shadow-gray-300/40 dark:shadow-black/70 overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1a1a1a] flex items-center justify-between bg-gray-50/80 dark:bg-[#111]/80">
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
                        <button onClick={handleReadAllNotifications} className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">모두 읽음</button>
                      </div>
                    )}
                  </div>

                  <div className="max-h-95 overflow-y-auto divide-y divide-gray-100 dark:divide-[#1a1a1a] bg-white dark:bg-[#0a0a0a]">
                    {isNotificationListLoading ? (
                      <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 dark:border-indigo-900 dark:border-t-indigo-400 rounded-full animate-spin mb-3"></div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">알림을 불러오는 중입니다.</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#151515] flex items-center justify-center text-gray-400 mb-3"><BellIcon size={24} /></div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">새로운 알림이 없습니다.</p>
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div
                          key={item.notificationId}
                          onClick={() => handleNotificationClick(item.notificationId, item.isRead, item.type)}
                          className={`relative px-5 py-4 flex gap-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#141414] group ${!item.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                        >
                          {!item.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r-md" />}
                          <div className="grow min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className={`text-xs font-bold ${item.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{item.title}</span>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className={`text-xs leading-relaxed ${item.isRead ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>{item.message}</p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteNotification(e, item.notificationId)}
                            className="p-1 rounded-md text-gray-300 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-[#222] transition-all opacity-0 group-hover:opacity-100 self-start"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-gray-100 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#111]">
                    <button onClick={() => { setIsNotificationOpen(false); navigate('/notifications'); }} className="w-full py-3 text-sm text-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold">전체 알림 보기</button>
                  </div>
                </div>
              )}
            </div>

            {/* 마이페이지 */}
            <button
              onClick={() => navigate('/mypage')}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                currentPath === '/mypage'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title="마이페이지"
            >
              <UserCircle size={20} />
            </button>

            {/* 다크모드 토글 */}
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300">
              {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            </button>

            {/* 로그아웃 (lg 이상) */}
            <button onClick={handleLogout} className="hidden lg:block text-xs font-bold px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors whitespace-nowrap">
              로그아웃
            </button>

            {/* 모바일 햄버거 */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white">
              {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 (fixed header 내부) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-4 py-3 flex flex-col gap-1">
            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/schedule'); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm text-left ${currentPath.includes('schedule') ? 'bg-gray-900 dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <CalendarIcon size={18} /><span>일정 생성</span>
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/study'); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm text-left ${currentPath.includes('study') && !currentPath.includes('plan') ? 'bg-gray-900 dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <BookIcon size={18} /><span>학습 스튜디오</span>
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/exercise'); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm text-left ${currentPath.includes('exercise') ? 'bg-gray-900 dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <DumbbellIcon size={18} /><span>운동 랩</span>
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/community'); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm text-left ${currentPath.includes('community') ? 'bg-gray-900 dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
              <UsersIcon size={18} /><span>커뮤니티</span>
            </button>

            <hr className="border-gray-100 dark:border-slate-800 my-1" />

            <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
              로그아웃
            </button>

            <hr className="border-gray-100 dark:border-slate-800 my-1" />

            <div className="flex flex-col gap-1 bg-gray-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-2 mb-1">수신함</span>
              <button onClick={() => { setIsMobileMenuOpen(false); navigate('/friend/requests'); }} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${currentPath.includes('requests') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'}`}>
                <span>친구 초대</span><MessageSquareIcon size={14} />
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); navigate('/study/invitation'); }} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${currentPath.includes('invitation') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'}`}>
                <span>스터디 초대</span><MessageSquareIcon size={14} />
              </button>
              <button onClick={() => { setIsMobileMenuOpen(false); navigate('/notifications'); }} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${currentPath.includes('notifications') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'}`}>
                <span>알림 목록</span><BellIcon size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── 하위 네비게이션 바 : 데스크탑에서 스크롤 시 상단 고정(sticky top-0) ── */}
      <nav className="hidden lg:block sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b border-gray-200/50 dark:border-slate-800/60 transition-colors duration-200">
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 h-16 flex items-center justify-center gap-6">
          <NavItem to="/schedule" icon={<CalendarIcon size={20} />} label="일정 생성" active={currentPath.includes('schedule')} />
          <NavItem to="/study" icon={<BookIcon size={20} />} label="학습 스튜디오" active={currentPath.includes('study') && !currentPath.includes('plan')} />
          <NavItem to="/exercise" icon={<DumbbellIcon size={20} />} label="운동 랩" active={currentPath.includes('exercise')} />
          <NavItem to="/community" icon={<UsersIcon size={20} />} label="커뮤니티" active={currentPath.includes('community')} />

          <div className="relative" ref={inviteMenuRef}>
            <NavItem
              to="#"
              icon={<MessageSquareIcon size={20} />}
              label="수신함"
              active={currentPath.includes('requests') || currentPath.includes('invitation') || currentPath.includes('notifications')}
              onClickOverride={() => setIsInviteMenuOpen(!isInviteMenuOpen)}
              hasToggle={true}
              isExpanded={isInviteMenuOpen}
            />
            {isInviteMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-[#222] rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/70 overflow-hidden z-50 py-2">
                <button onClick={() => { setIsInviteMenuOpen(false); navigate('/friend/requests'); }} className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${currentPath.includes('requests') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#141414] hover:text-gray-900 dark:hover:text-white'}`}>친구 초대</button>
                <button onClick={() => { setIsInviteMenuOpen(false); navigate('/study/invitation'); }} className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${currentPath.includes('invitation') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#141414] hover:text-gray-900 dark:hover:text-white'}`}>스터디 초대</button>
                <button onClick={() => { setIsInviteMenuOpen(false); navigate('/notifications'); }} className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${currentPath.includes('notifications') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#141414] hover:text-gray-900 dark:hover:text-white'}`}>알림 목록</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
