import { Link } from 'react-router-dom';
import { Button } from '../../common/Button';
import { LayersIcon } from '../../ui/Icons';

export const HomeHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-8 md:px-12 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
            <LayersIcon className="text-black" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white uppercase">Learn Time</span>
        </div>

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

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors hidden sm:block">Login</Link>
          <Link to="/signup">
            <Button className="!bg-white !text-black !py-2.5 !px-6 !rounded-full !text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              GET STARTED
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
