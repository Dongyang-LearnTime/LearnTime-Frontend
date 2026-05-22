// 홈 화면의 커뮤니티 기능 미리보기 컴포넌트
// 사용자 카드, 게시글 내용, 좋아요 및 댓글 수 등의 피드 카드 UI를 렌더링함
import { MessageSquareIcon, TrophyIcon, ThumbsUpIcon } from '../../../ui/Icons';

export const CommunityPreview = () => {
  return (
    <div className="grid lg:grid-cols-12 gap-16 items-center mb-40">
      <div className="lg:col-span-5 reveal-left space-y-8 order-2 lg:order-1">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-400/20">
          <MessageSquareIcon size={24} />
        </div>
        <h4 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">서로의 동기가 되는 <br /> 러닝메이트 커뮤니티</h4>
        <p className="text-gray-500 font-medium leading-relaxed">
          비슷한 목표를 가진 사람들과 경험을 공유하세요. 댓글과 추천을 통해 서로를 응원하며 함께 성공을 향해 달려갑니다.
        </p>
      </div>
      <div className="lg:col-span-7 reveal-right order-1 lg:order-2">
        <div className="relative group float-animation" style={{ animationDelay: '0.5s' }}>
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-2xl opacity-50 glow-pulse group-hover:opacity-70 transition-opacity duration-500" />
          <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 card-3d-hover">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <TrophyIcon size={20} />
              </div>
              <div>
                <span className="block text-[0.7rem] font-black">김철수</span>
                <span className="text-[0.55rem] font-bold text-gray-400 uppercase">15분 전</span>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-700 leading-relaxed mb-6 italic">
              "오늘 미적분 2장 끝냈습니다! 생각보다 도함수 개념이 어렵네요. 다들 화이팅!"
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-rose-500 font-black text-[0.65rem]">
                <ThumbsUpIcon size={14} /> 24
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-black text-[0.65rem]">
                <MessageSquareIcon size={14} /> 8
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
