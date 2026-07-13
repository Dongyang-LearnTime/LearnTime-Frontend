import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Menu, ChevronLeft } from 'lucide-react';

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
}

export function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

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
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: '대시보드', path: '/admin', icon: <LayoutDashboard size={isExpanded ? 16 : 20} /> },
    { name: '사용자 관리', path: '/admin/users', icon: <Users size={isExpanded ? 16 : 20} /> },
  ];

  return (
    <div className="flex flex-1 w-full relative items-start bg-gray-50 dark:bg-[#050505] min-h-screen">
      <aside 
        className={`z-20 flex flex-col border-r border-gray-200 dark:border-[#222] bg-white dark:bg-[#050505] transition-all duration-300 ease-in-out shadow-sm
          ${isExpanded ? 'w-64 absolute md:sticky md:top-16 h-[calc(100vh-64px)]' : 'w-0 md:w-16 overflow-hidden md:sticky md:top-16 h-[calc(100vh-64px)]'}
        `}
      >
        <div className={`p-4 flex items-center border-b border-gray-100 dark:border-[#1a1a1a] transition-all duration-300 ${isExpanded ? 'justify-between px-6' : 'justify-center'}`}>
          <span className={`text-xs font-black uppercase tracking-widest text-indigo-500 whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Admin Panel</span>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer shrink-0 hidden md:block"
          >
            {isExpanded ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white font-medium'
                } ${!isExpanded && 'justify-center'}`}
                title={!isExpanded ? item.name : undefined}
              >
                <span className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isExpanded ? 'ml-0' : 'ml-0'}`}>
        <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* 모바일 배경 오버레이 */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
