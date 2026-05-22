// 홈 화면 최상단의 메인 히어로 배너 섹션 컴포넌트
import { Link } from 'react-router-dom';
import { Button } from '../../../common/Button';
import bannerImage from '../../../../assets/images/banner.png';

export const HeroSection = () => {
  return (
    <section className="relative h-screen w-full snap-start overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[#020202]">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="reveal-content space-y-8">
          <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.5em] mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">Run Toward Success with Learn-Time</h2>
          <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-[1.05] uppercase italic">
            SMART PERSONALIZED <br />
            <span className="text-white">GROWTH PARTNER</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed max-w-3xl mx-auto">
            당신의 공부, 운동, 루틴수행 등을 도와줍니다. <br />
            스마트 자동 진도, 피드백, 커뮤니티 기능등으로 당신을 성장시키세요
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button className="!bg-white !text-black !py-5 !px-12 !rounded-full !text-sm font-black hover:scale-110 transition-transform shadow-2xl">
                지금 바로 시작하기
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="!border-white/20 !text-white !py-5 !px-12 !rounded-full !text-sm font-black hover:bg-white/10 transition-all">
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[0.65rem] font-bold tracking-[0.4em] uppercase">Scroll to Explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};
