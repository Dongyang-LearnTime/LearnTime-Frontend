import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { CheckCircle2, PlayCircle, Clock, BookOpen, PenTool } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getTodayPlans } from './study/api/StudyApi';
import { getUserSummary, getRecentActivities } from '../api/UserApi';
import type { TodayStudyPlanResponse } from './study/types/StudyTypes';
import type { UserSummaryResponse, RecentActivityResponse } from '../types/UserTypes';

// 게이미피케이션 자산 import 
import BicycleTier from '../assets/tier/Bicycle.svg';
import CarTier from '../assets/tier/Car.svg';
import HelicopterTier from '../assets/tier/Helicopter.svg';
import PlainTier from '../assets/tier/Plain.svg';

import Days30Badge from '../assets/badge/30Days.svg';
import Days90Badge from '../assets/badge/90Days.svg';
import Days180Badge from '../assets/badge/180Days.svg';
import FirstPlanBadge from '../assets/badge/FirstPlan.svg';
import Notes80Badge from '../assets/badge/Notes80.svg';
import MorningFirstTimeBadge from '../assets/badge/MorningFirstTime.svg';
import MorningFiveTimeBadge from '../assets/badge/MorningFiveTime.svg';
import Quiz10TimeBadge from '../assets/badge/Quiz10Time.svg';
import SpaceShipBadge from '../assets/badge/SpaceShip.svg';

// 헬퍼: 티어 이름에 따른 이미지 매핑
const getTierImage = (tierName: string) => {
    if (tierName?.toLowerCase().includes('car')) return CarTier;
    if (tierName?.toLowerCase().includes('helicopter')) return HelicopterTier;
    if (tierName?.toLowerCase().includes('plain') || tierName?.toLowerCase().includes('plane')) return PlainTier;
    return BicycleTier;
};

// 헬퍼: 배지 타입에 따른 이미지 매핑
const getBadgeImage = (badgeType: string) => {
    switch(badgeType) {
        case '30Days': return Days30Badge;
        case '90Days': return Days90Badge;
        case '180Days': return Days180Badge;
        case 'FirstPlan': return FirstPlanBadge;
        case 'Notes80': return Notes80Badge;
        case 'MorningFirstTime': return MorningFirstTimeBadge;
        case 'MorningFiveTime': return MorningFiveTimeBadge;
        case 'Quiz10Time': return Quiz10TimeBadge;
        case 'SpaceShip': return SpaceShipBadge;
        default: return Days30Badge;
    }
};

// 헬퍼: 날짜 포맷팅 (방금 전, n분 전, n시간 전, 어제, 그 외엔 YYYY.MM.DD)
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export default function LearnTimeMainPage() {
    usePageTitle('홈');
    const navigate = useNavigate();
    const userName = useAuthStore((state) => state.userName);

    const [isLoading, setIsLoading] = useState(true);
    const [todayPlans, setTodayPlans] = useState<TodayStudyPlanResponse[]>([]);
    const [userSummary, setUserSummary] = useState<UserSummaryResponse | null>(null);
    const [recentActivities, setRecentActivities] = useState<RecentActivityResponse[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 백엔드 API 연동 병렬 호출
                const [plans, summary, activities] = await Promise.all([
                    getTodayPlans(),
                    getUserSummary(),
                    getRecentActivities()
                ]);
                
                setTodayPlans(plans);
                setUserSummary(summary);
                setRecentActivities(activities);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // 현재 XP 로직 처리 (nextMinPoint 기준)
    const currentPoint = userSummary?.point || 0;
    const nextPoint = userSummary?.nextMinPoint || 100;
    const xpPercentage = Math.min(100, Math.max(0, (currentPoint / nextPoint) * 100));

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] pb-32">
            <div className="fixed top-[-10%] left-[-10%] w-128 h-128 bg-indigo-400/5 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-128 h-128 bg-emerald-400/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10">
                
                {isLoading ? (
                    <div className="mb-8 w-full min-h-80 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                ) : (
                    <div className="mb-8 w-full min-h-80 rounded-3xl 
                        bg-linear-to-br from-indigo-50 via-purple-50 to-white border border-indigo-100 
                        dark:from-indigo-950 dark:via-purple-900/40 dark:to-[#0a0a0a] dark:border-indigo-500/20 
                        p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl gap-8 transition-colors duration-500">
                        
                        <div className="absolute left-[10%] top-[-20%] w-72 h-72 bg-indigo-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col justify-center w-full text-left">
                            <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-purple-500/20 text-indigo-700 dark:text-purple-200 border border-indigo-200 dark:border-purple-500/30 rounded-full text-xs font-bold mb-4 w-max shadow-sm">
                                WELCOME BACK
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2 drop-shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
                                {userName || '학습자'} 님 오늘도 달려봐요!
                            </h1>
                            <p className="text-gray-600 dark:text-purple-200/80 text-sm font-semibold mb-6">현재 등급: {userSummary?.tierName || 'Bicycle 1'} • 포기하지 않고 달리는 단계입니다.</p>
                            
                            <div className="w-full max-w-md mb-6">
                                <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-purple-200/60 mb-2">
                                    <span>다음 티어까지 {Math.max(0, nextPoint - currentPoint)} XP</span>
                                    <span>{currentPoint} / {nextPoint} XP</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3 overflow-hidden border border-gray-300/50 dark:border-white/5">
                                    <div className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${xpPercentage}%` }}></div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[11px] font-bold text-gray-400 dark:text-purple-300/60 tracking-wider uppercase">보유 뱃지 {userSummary?.badges?.length || 0}개</span>
                                <div className="flex gap-3">
                                    {userSummary?.badges?.slice(0, 4).map((badge, index) => (
                                        <div key={index} className="group relative bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 p-2.5 rounded-2xl border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm">
                                            <img src={getBadgeImage(badge.badgeType)} className="w-10 h-10" alt={badge.displayName} />
                                            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md">{badge.displayName}</span>
                                        </div>
                                    ))}
                                    {(!userSummary?.badges || userSummary.badges.length === 0) && (
                                        <span className="text-sm font-bold text-gray-400 dark:text-gray-500">아직 획득한 뱃지가 없습니다.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative z-10 shrink-0 flex items-center justify-center w-full md:w-auto mt-8 md:mt-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-300/30 dark:bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <img 
                                    src={getTierImage(userSummary?.tierName || 'Bicycle')} 
                                    alt="Tier Illustration" 
                                    className="relative z-10 w-36 h-36 md:w-44 md:h-44 drop-shadow-xl transform hover:scale-105 hover:rotate-3 transition-all duration-500" 
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    
                    {isLoading ? (
                        <>
                            <div className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        </>
                    ) : (
                        <>
                            {/* 좌측: 오늘의 진도 리스트 */}
                            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-sm flex flex-col h-96">
                                <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2 shrink-0">
                                    <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" /> 오늘 마쳐야 할 진도
                                </h2>
                                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                    {todayPlans.length > 0 ? (
                                        todayPlans.map(item => (
                                            <div key={item.studyDailyPlanId} onClick={() => navigate(`/study/${item.studyId}`)} className="flex justify-between items-center group cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-gray-100 dark:hover:border-[#222]">
                                                <div className="flex items-center gap-3">
                                                    {item.progressStatus === 'COMPLETED' ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> :
                                                    item.progressStatus === 'IN_PROGRESS' ? <PlayCircle size={18} className="text-indigo-500 shrink-0" /> : <Clock size={18} className="text-gray-300 shrink-0" />}
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{item.studyTitle}</span>
                                                        <span className={`font-bold text-sm ${item.progressStatus === 'COMPLETED' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'}`}>
                                                            {item.planContent}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors shrink-0 ${
                                                    item.progressStatus === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' :
                                                    item.progressStatus === 'IN_PROGRESS' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400' : 
                                                    'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {item.progressStatus === 'COMPLETED' ? '완료됨' : item.progressStatus === 'IN_PROGRESS' ? '진행 중' : '대기 중'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 font-bold text-sm">
                                            <BookOpen size={32} className="mb-2 opacity-50" />
                                            <span>오늘 마쳐야 할 진도가 없습니다.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 우측: 최근 학습 활동 기록 */}
                            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-sm flex flex-col h-96">
                                <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2 shrink-0">
                                    <PenTool size={18} className="text-emerald-600 dark:text-emerald-400" /> 최근 학습 활동
                                </h2>
                                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map(activity => (
                                            <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-[#222]">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                    activity.type === 'NOTE' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 group-hover:text-emerald-600' :
                                                    activity.type === 'QUIZ' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 group-hover:text-indigo-600' :
                                                    'bg-amber-50 dark:bg-amber-900/20 text-amber-500 group-hover:text-amber-600'
                                                }`}>
                                                    {activity.type === 'NOTE' && <PenTool size={16} />}
                                                    {activity.type === 'QUIZ' && <CheckCircle2 size={16} />}
                                                    {activity.type === 'FEEDBACK' && <PlayCircle size={16} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate">{activity.studyTitle}</p>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{activity.title}</p>
                                                    <p className="text-[11px] font-bold text-gray-400 mt-0.5">{formatTimeAgo(activity.createdAt)} 작성됨</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 font-bold text-sm">
                                            <PenTool size={32} className="mb-2 opacity-50" />
                                            <span>최근 학습 활동이 없습니다.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
