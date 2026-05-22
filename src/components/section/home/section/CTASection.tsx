// 홈 화면 하단의 회원가입/로그인 유도(CTA) 섹션 컴포넌트
import { Link } from 'react-router-dom';
import { Button } from '../../../common/Button';
import { LayersIcon } from '../../../ui/Icons';

export const CTASection = () => {
  return (
    <section className="relative h-screen w-full snap-start flex items-center justify-center bg-white text-black p-6 md:p-12">
      <div className="max-w-4xl text-center space-y-12 md:space-y-20">
        <div className="reveal-content space-y-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <LayersIcon className="text-white" size={32} />
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tightest uppercase italic leading-[0.9] mb-6">
            START YOUR <br />
            <span className="text-indigo-600">NEW CHAPTER.</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-500 leading-relaxed max-w-2xl mx-auto">
            공부 습관을 희망하는 학생부터 자기계발러, 운동인까지. <br />
            지금 바로 Learn Time과 함께 당신의 성공을 설계하세요.
          </p>
        </div>

        <div className="reveal-content delay-300">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="!bg-black !text-white !py-6 !px-16 !rounded-full !text-lg font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
                회원가입
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="!border-black/10 !py-6 !px-16 !rounded-full !text-lg font-black hover:bg-gray-50 transition-all">
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
