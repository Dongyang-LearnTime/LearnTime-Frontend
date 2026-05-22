import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { SiteLogo } from '../common/SiteLogo';

// HomePage는 미인증 상태에서만 렌더링되므로 로그인 분기 불필요
export const HomeHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-8 md:px-12 h-20 md:h-24 flex items-center justify-between">
        {/* 로고 */}
        <SiteLogo />

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-12 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-2.5 rounded-full">
          {['About', 'Modes', 'Interface', 'Gamification'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[0.75rem] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* 우측: 로그인 / 회원가입 */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors hidden sm:block"
          >
            Login
          </Link>
          <Link to="/signup">
            <Button className="bg-white! text-black! py-2.5! px-6! rounded-full! text-xs! font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              GET STARTED
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
