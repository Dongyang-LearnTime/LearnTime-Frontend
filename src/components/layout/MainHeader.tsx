import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { NotificationApi } from '../../pages/notification/NotificationApi';
import { axiosInstance } from '../../app/apiClient';
import {
  BookIcon, DumbbellIcon, UsersIcon, SunIcon, MoonIcon, CalendarIcon,
  ChevronDownIcon, MenuIcon, XIcon, BellIcon, LayersIcon, MessageSquareIcon
} from '../ui/Icons';

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
    const fetchInitialData = async () => {
      try {
        const countRes = await NotificationApi.getUnreadCount();
        setUnreadCount(Number(countRes.unreadCount));
        const listRes = await NotificationApi.getNotifications();
        setNotifications(listRes.content, listRes.hasNext, listRes.nextCursor);
      } catch (error) {
        console.error("Failed to load initial notification data:", error);
      }
    };
    fetchInitialData();
  }, [setNotifications, setUnreadCount]);

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
    <header className="sticky top-4 z-50 max-w-450 w-[calc(100%-2rem)] lg:w-[calc(100%-5rem)] mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 rounded-full shadow-xl shadow-gray-200/50 dark:shadow-black/50 transition-all duration-500 mb-8">
      <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-white/5 shrink-0">
            <LayersIcon className="text-white dark:text-gray-900" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase hidden sm:block">Learn Time</span>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavItem to="/main/schedule" icon={<CalendarIcon size={18} />} label="일정 생성" active={currentPath.includes('schedule')} />
          
          <div className="relative">
            <NavItem
              to="/study"
              icon={<BookIcon size={18} />}
              label="학습 스튜디오"
              active={currentPath.includes('study') && !currentPath.includes('plan')}
            />
          </div>

          <NavItem to="/main/exercise" icon={<DumbbellIcon size={18} />} label="운동 랩" active={currentPath.includes('exercise')} />
          <NavItem to="/main/community" icon={<UsersIcon size={18} />} label="커뮤니티" active={currentPath.includes('community')} />
          <div className="relative" ref={inviteMenuRef}>
            <NavItem 
              to="#" 
              icon={<MessageSquareIcon size={18} />} 
              label="초대 수신함" 
              active={currentPath.includes('requests') || currentPath.includes('invitation')} 
              onClickOverride={() => setIsInviteMenuOpen(!isInviteMenuOpen)}
              hasToggle={true}
              isExpanded={isInviteMenuOpen}
            />
            {/* 초대 수신함 드롭다운 */}
            {isInviteMenuOpen && (
              <div className="absolute left-0 mt-3 w-48 bg-white/98 dark:bg-[#0c0c0c]/98 backdrop-blur-xl border border-gray-200 dark:border-[#222] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/80 overflow-hidden z-50 py-2">
                <button 
                  onClick={() => { setIsInviteMenuOpen(false); navigate("/friend/requests"); }} 
                  className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${currentPath.includes('requests') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#141414] hover:text-gray-900 dark:hover:text-white'}`}
                >
                  친구 초대
                </button>
                <button 
                  onClick={() => { setIsInviteMenuOpen(false); navigate("/study/invitation"); }} 
                  className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${currentPath.includes('invitation') ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#141414] hover:text-gray-900 dark:hover:text-white'}`}
                >
                  스터디 초대
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 우측 컨트롤 영역 */}
        <div className="flex items-center gap-3">
          {/* 알림창 영역 */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300"
            >
              <BellIcon size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* 알림 드롭다운 창 (투명도 개선: bg-white/95) */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/98 dark:bg-[#0c0c0c]/98 backdrop-blur-xl border border-gray-200 dark:border-[#222] rounded-3xl shadow-2xl shadow-gray-300/50 dark:shadow-black/80 overflow-hidden z-50">
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
                  {notifications.length === 0 ? (
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
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
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
                  <button onClick={() => { setIsNotificationOpen(false); navigate("/notifications"); }} className="w-full py-3 text-sm text-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold">전체 알림 보기</button>
                </div>
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white transition-all duration-300">
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>
          
          <button onClick={handleLogout} className="text-xs font-bold px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors">
            로그아웃
          </button>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2.5 rounded-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 hover:text-black dark:hover:text-white">
            {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
