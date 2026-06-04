import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { getBadgeTierInfo } from '../../../api/userApi';
import { getTierImage, getBadgeImage } from '../../../utils/gamificationAssets';
import type { BadgeTierInfoResponse } from '../../../types/UserTypes';
import { ArrowLeft as ArrowLeftIcon, Trophy as TrophyIcon, ShieldCheck as ShieldCheckIcon, Star as StarIcon, X as XIcon } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

// 로그인하지 않은 사용자 또는 API 조회 실패 시 사용할 정적 마일스톤 등급 데이터
const FALLBACK_TIERS = [
  { tierName: '자전거', minPoint: 0 },
  { tierName: '자동차', minPoint: 1000 },
  { tierName: '헬리콥터', minPoint: 3000 },
  { tierName: '비행기', minPoint: 10000 },
  { tierName: '우주선', minPoint: 30000 }
];

// 로그인하지 않은 사용자 또는 API 조회 실패 시 사용할 정적 도전 배지 데이터
const FALLBACK_BADGES = [
  { badgeType: 'FIRST_STEP', displayName: '첫 걸음', description: '첫 스터디 일정을 생성했습니다.' },
  { badgeType: 'DILIGENT_PLANNER', displayName: '성실한 계획러', description: '30일 동안 스터디를 계획하고 실행했습니다.' },
  { badgeType: 'EXCELLENT_STRATEGIST', displayName: '탁월한 전략가', description: '90일 동안 스터디를 성실히 지속했습니다.' },
  { badgeType: 'TRUE_J_MBTI', displayName: '완벽한 계획형(J)', description: '180일 스터디 달성을 이루어냈습니다.' },
  { badgeType: 'HUMAN_GPT', displayName: '퀴즈 정복자', description: 'AI 생성 퀴즈를 10번 이상 풀었습니다.' },
  { badgeType: 'TRIPITAKA_COREANA', displayName: '기록의 달인', description: '학습 노트를 80개 이상 작성했습니다.' },
  { badgeType: 'EARLY_BIRD', displayName: '얼리버드', description: '오전 6시 이전에 첫 학습을 시작했습니다.' },
  { badgeType: 'MIRACLE_MORNING_ADDICT', displayName: '미라클 모닝 중독', description: '오전 6시 이전 학습을 5회 이상 성공했습니다.' }
];

export default function BadgeTierInfoPage() {
  usePageTitle('업적 및 등급 상세');
  const navigate = useNavigate();
  const [data, setData] = useState<BadgeTierInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'TIER' | 'BADGE'>('TIER');
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; description?: string } | null>(null);

  // Zustand 스토어에서 인증 여부 조회
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        // 로그아웃 상태인 경우 즉시 로컬 정적 데이터 공급
        setData({
          allTiers: FALLBACK_TIERS,
          allBadges: FALLBACK_BADGES,
          currentTierName: '자전거',
          acquiredBadges: []
        });
        setIsLoading(false);
        return;
      }

      try {
        const res = await getBadgeTierInfo();
        setData(res);
      } catch (error) {
        console.error('Failed to load badge and tier information:', error);
        // API 조회 실패 시 정적 백업 데이터로 노출 보장
        setData({
          allTiers: FALLBACK_TIERS,
          allBadges: FALLBACK_BADGES,
          currentTierName: '자전거',
          acquiredBadges: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-400">정보를 불러오는 중입니다...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-[#0a0a0a] px-4">
        <p className="text-base font-bold text-gray-500 mb-4">데이터 로딩에 실패했습니다.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm">
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      {/* 뒤로 가기 및 헤더 */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeftIcon size={14} /> 이전 페이지로
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white border-l-8 border-indigo-600 pl-4 tracking-tight">
          리워드 마일스톤 & 배지
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-2 ml-2">
          열심히 학습하여 포인트를 모으고, 특별한 도전 업적을 달성해 보세요!
        </p>
      </div>

      {/* 현재 티어 개요 요약 카드 */}
      {isAuthenticated ? (
        <div className="w-full bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-4xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between mb-10 shadow-lg shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute right-[-5%] top-[-10%] w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="z-10 text-center sm:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 border border-white/20 rounded-full text-[10px] font-black tracking-wider uppercase mb-3">
              My Status
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-2 flex items-center justify-center sm:justify-start gap-2">
              현재 획득 등급: <span className="underline decoration-indigo-200 decoration-4 underline-offset-4">{data.currentTierName}</span>
            </h2>
            <p className="text-xs text-indigo-100 font-bold">
              획득한 도전 배지: {data.acquiredBadges.length}개 / 전체 {data.allBadges.length}개
            </p>
          </div>
          <div className="mt-6 sm:mt-0 z-10 shrink-0 flex items-center justify-center">
            <img 
              src={getTierImage(data.currentTierName)} 
              alt={data.currentTierName} 
              className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ) : (
        <div className="w-full bg-linear-to-br from-gray-800 to-slate-900 text-white rounded-4xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between mb-10 shadow-lg shadow-slate-900/10 relative overflow-hidden">
          <div className="absolute right-[-5%] top-[-10%] w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="z-10 text-center sm:text-left">
            <span className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black tracking-wider uppercase mb-3">
              Welcome to Learn Time
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              로그인하고 등급 및 배지를 확인해 보세요!
            </h2>
            <p className="text-xs text-slate-300 font-bold mb-4 sm:mb-0">
              학습 시간을 채우고 마일스톤 등급을 업그레이드하여 다양한 학습 도전 과제 배지를 모으실 수 있습니다.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 z-10 shrink-0 flex items-center justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 transition-all font-black text-sm rounded-2xl shadow-xl hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-100 dark:border-[#1a1a1a] mb-8 gap-4">
        <button
          onClick={() => setActiveTab('TIER')}
          className={`py-3 px-5 text-base font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'TIER'
              ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <TrophyIcon size={16} /> 등급 마일스톤
        </button>
        <button
          onClick={() => setActiveTab('BADGE')}
          className={`py-3 px-5 text-base font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'BADGE'
              ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <ShieldCheckIcon size={16} /> 도전 배지 정보
        </button>
      </div>

      {/* 탭 내부 콘텐츠 */}
      {activeTab === 'TIER' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.allTiers.map((tier, idx) => {
            const isCurrent = isAuthenticated && tier.tierName.toLowerCase() === data.currentTierName.toLowerCase();
            return (
              <div 
                key={idx}
                className={`p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between gap-4 group hover:shadow-md ${
                  isCurrent 
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-md ring-2 ring-indigo-500/10' 
                    : 'bg-white dark:bg-[#050505] border-gray-100 dark:border-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => setSelectedImage({
                      src: getTierImage(tier.tierName),
                      title: tier.tierName,
                      description: `달성 조건: ${tier.minPoint.toLocaleString()} XP 이상`
                    })}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner cursor-pointer hover:scale-105 transition-transform duration-200 ${
                      isCurrent ? 'bg-indigo-100/80 dark:bg-indigo-950/40' : 'bg-gray-50 dark:bg-[#111]'
                    }`}
                  >
                    <img 
                      src={getTierImage(tier.tierName)} 
                      alt={tier.tierName} 
                      className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      {tier.tierName}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
                      달성 조건: {tier.minPoint.toLocaleString()} XP 이상
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {tier.minPoint.toLocaleString()} PT
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.allBadges.map((badge, idx) => {
            // 사용자가 해당 배지를 취득했는지 대조
            const acquiredInfo = data.acquiredBadges.find(
              ab => ab.badgeType.toLowerCase() === badge.badgeType.toLowerCase()
            );
            const isAcquired = !!acquiredInfo;

            return (
              <div 
                key={idx}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md ${
                  isAcquired 
                    ? 'bg-white dark:bg-[#050505] border-indigo-100 dark:border-indigo-900/30' 
                    : 'bg-gray-50/50 dark:bg-[#030303]/30 border-gray-100 dark:border-[#121212]'
                }`}
              >
                {/* 획득 완료 리본 장식 */}
                {isAcquired && (
                  <div className="absolute top-2 right-2 text-amber-500">
                    <StarIcon size={18} className="fill-current animate-pulse" />
                  </div>
                )}

                <div 
                  onClick={() => setSelectedImage({
                    src: getBadgeImage(badge.badgeType),
                    title: badge.displayName,
                    description: badge.description
                  })}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shrink-0 transition-transform hover:scale-105 duration-300 cursor-pointer ${
                    isAcquired 
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm' 
                      : 'bg-gray-100 dark:bg-gray-900/50 filter grayscale contrast-50 opacity-40'
                  }`}
                >
                  <img 
                    src={getBadgeImage(badge.badgeType)} 
                    alt={badge.displayName} 
                    className="w-14 h-14 object-contain"
                  />
                </div>

                <h3 className={`text-base font-black mb-1.5 ${
                  isAcquired ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {badge.displayName}
                </h3>
                
                <p className={`text-xs font-medium leading-relaxed max-w-[90%] mb-4 flex-1 ${
                  isAcquired ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400/80 dark:text-gray-700'
                }`}>
                  {badge.description}
                </p>

                {isAcquired ? (
                  <div className="w-full pt-3 border-t border-gray-100 dark:border-[#151515]">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">
                      획득일: {new Date(acquiredInfo.acquiredAt).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div className="w-full pt-3 border-t border-gray-100 dark:border-[#151515] opacity-50">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      미획득
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 팝업 모달창 (리워드/등급 확대 보기) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-4xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl relative transition-transform duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <XIcon size={20} />
            </button>
            <div className="w-36 h-36 rounded-3xl bg-gray-50 dark:bg-[#111] flex items-center justify-center mb-6 shadow-inner p-4">
              <img src={selectedImage.src} alt={selectedImage.title} className="w-28 h-28 object-contain animate-pulse-subtle" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{selectedImage.title}</h3>
            {selectedImage.description && (
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed">{selectedImage.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
