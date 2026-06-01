// 홈 화면의 각 기능별 미리보기 컴포넌트들을 조합하는 컨테이너 섹션 컴포넌트
import { StudyPreview } from '../preview/StudyPreview';
import { HealthPreview } from '../preview/HealthPreview';
import { CalendarPreview } from '../preview/CalendarPreview';
import { CommunityPreview } from '../preview/CommunityPreview';
import { MobileMockupPreview } from '../preview/MobileMockupPreview';

export const PreviewSection = () => {
  return (
    // 배경: 흰색, 텍스트: 검정 — 다른 섹션들의 다크 테마와 의도적으로 대비
    <section
      id="interface"
      className="relative min-h-screen w-full snap-start bg-white text-black py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-8 w-full">

        {/* 섹션 헤더 */}
        <div className="mb-20 text-center">
          <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">
            Live Preview
          </h3>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            강력한 기능을 담은 심플한 UI
          </h2>
        </div>

        {/* 1. 학습 스튜디오 프리뷰 */}
        <StudyPreview />

        {/* 2. 운동 랩 프리뷰 */}
        <HealthPreview />

        {/* 3. 일정 관리 프리뷰 */}
        <CalendarPreview />

        {/* 4. 커뮤니티 프리뷰 */}
        <CommunityPreview />

        {/* 5. 모바일 목업 프리뷰 (Coming Soon) */}
        <MobileMockupPreview />

      </div>
    </section>
  );
};
