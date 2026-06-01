import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { MenuIcon, XIcon, UsersIcon, StarIcon } from '../ui/Icons';
import siteLogo from '../../assets/site-logo.svg';
import { UserSearchBar } from './UserSearchBar';

export function PublicHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const [isScrolled, setIsScrolled] = useState(!isHomePage);

  useEffect(() => {
    const threshold = window.innerHeight * 0.8;

    const handleScroll = () => {
      // 홈이 아닌 페이지는 항상 라이트 테마(어두운 글씨) 유지
      setIsScrolled(!isHomePage || window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── 스크롤 단계별 스타일 토큰 ──────────────────────────────────────
  const headerBg = isScrolled
    ? 'bg-white/95 border-gray-200/70 shadow-gray-300/20'
    : 'bg-white/10 border-white/20 shadow-black/30';

  const logoText = isScrolled ? 'text-gray-900' : 'text-white';

  const navText  = isScrolled
    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    : 'text-white/70 hover:text-white hover:bg-white/15';

  const loginText = isScrolled
    ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    : 'text-white/60 hover:text-white hover:bg-white/15';

  const ctaBtn = isScrolled
    ? 'bg-gray-900! text-white! shadow-gray-900/10'
    : 'bg-white! text-gray-900! shadow-white/10';

  const hamburgerBtn = isScrolled
    ? 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20';

  const searchVariant = isScrolled ? 'light' : 'dark';
  // ────────────────────────────────────────────────────────────────────

  return (
    <>
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:w-[calc(100%-5rem)] max-w-7xl backdrop-blur-xl border rounded-full shadow-lg transition-all duration-500 ${headerBg}`}
    >
      <div className="px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* 로고 */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-transparent rounded-xl flex items-center justify-center shadow-lg shrink-0 transition-all duration-500">
            <img src={siteLogo} className="w-7 h-7 dark:invert transition-all duration-500" alt="Logo" />
          </div>
          <span className={`text-xl font-extrabold tracking-tight [word-spacing:-0.15em] hidden sm:block transition-colors duration-500 ${logoText}`}>
            Learn Time
          </span>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-2">
          <div
            onClick={() => navigate('/community')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${navText}`}
          >
            <UsersIcon size={18} />
            <span className="text-[0.95rem] font-bold tracking-tight whitespace-nowrap">
              커뮤니티
            </span>
          </div>
          <div
            onClick={() => navigate('/community/ranking')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${navText}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span className="text-[0.95rem] font-bold tracking-tight whitespace-nowrap">
              랭킹
            </span>
          </div>
          <div
            onClick={() => navigate('/badge-tier-info')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${navText}`}
          >
            <StarIcon size={18} />
            <span className="text-[0.95rem] font-bold tracking-tight whitespace-nowrap">
              마일스톤
            </span>
          </div>
        </nav>

        {/* 우측 컨트롤 */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <UserSearchBar variant={searchVariant} />
          </div>

          <button
            onClick={() => navigate('/login')}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hidden sm:block ${loginText}`}
          >
            로그인
          </button>
          <Button
            onClick={() => navigate('/signup')}
            className={`py-2! px-5! rounded-full! text-xs! font-black hover:scale-105 active:scale-95 transition-all shadow-lg ${ctaBtn}`}
          >
            시작하기
          </Button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-full transition-all ${hamburgerBtn}`}
          >
            {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden absolute top-20 left-0 right-0 w-full border rounded-3xl shadow-xl p-5 flex flex-col gap-3 z-50 backdrop-blur-xl ${isScrolled ? 'bg-white/95 border-gray-200' : 'bg-slate-900/95 border-slate-800/80'}`}>
          <button
            onClick={() => { setIsMobileMenuOpen(false); navigate('/community'); }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all text-sm text-left ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <UsersIcon size={18} />
            <span>커뮤니티</span>
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); navigate('/community/ranking'); }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all text-sm text-left ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span>랭킹</span>
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); navigate('/badge-tier-info'); }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all text-sm text-left ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <StarIcon size={18} />
            <span>마일스톤</span>
          </button>
          <hr className={isScrolled ? 'border-gray-200' : 'border-slate-800'} />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
              className={`w-full px-5 py-3 rounded-2xl text-sm font-bold transition-colors text-left ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              로그인
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}
              className="w-full px-5 py-3 rounded-2xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors text-left"
            >
              시작하기
            </button>
          </div>
        </div>
      )}
    </header>
    {/* 홈 이외 페이지에서만 fixed 헤더(h-16) + top-4(1rem) 높이 보상 */}
    {!isHomePage && <div className="h-24" aria-hidden="true" />}
    </>
  );
}
