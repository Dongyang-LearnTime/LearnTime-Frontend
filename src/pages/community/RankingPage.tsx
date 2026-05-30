import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankingApi } from '../community/api/communityApi';
import type { PointRankingResponse } from './types/postTypes';
import { usePageTitle } from '../../hooks/usePageTitle';
import { TrophyIcon } from '../../components/ui/Icons';
import UserPopover from '../../components/common/UserPopover';
import { getTierImage } from '../../utils/gamificationAssets';

export default function RankingPage() {
    const navigate = useNavigate();
    const [rankingList, setRankingList] = useState<PointRankingResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    usePageTitle("learn-time | 전체 랭킹");

    useEffect(() => {
        const fetchRanking = async () => {
            setIsLoading(true);
            try {
                const response = await getRankingApi(page, 20);
                setRankingList(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Failed to fetch ranking:", error);
                alert("랭킹 데이터를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRanking();
    }, [page]);

    return (
        <div className="relative w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative max-w-4xl mx-auto z-10">
                <header className="mb-8">
                    <button 
                        onClick={() => navigate('/community')}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block"
                    >
                        &larr; 커뮤니티 광장으로 돌아가기
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        <TrophyIcon size={28} className="text-amber-500" /> 전체 학습자 랭킹
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">포인트를 쌓고 상위 학습자로 도약해보세요!</p>
                </header>

                <div className="bg-white dark:bg-[#111] border border-gray-200/80 dark:border-[#222] rounded-4xl p-6 sm:p-8 shadow-xl">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-gray-500 mt-4">랭킹을 산정하고 있습니다...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#222]">
                                <span className="col-span-2 text-center">순위</span>
                                <span className="col-span-4">학습자명</span>
                                <span className="col-span-3 text-center">티어</span>
                                <span className="col-span-3 text-right">포인트</span>
                            </div>

                            {rankingList.map((user, idx) => {
                                const overallRank = page * 20 + idx + 1;
                                return (
                                    <div key={user.userId} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl transition-all hover:bg-white dark:hover:bg-black">
                                        <div className="col-span-2 flex justify-center">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                                                overallRank === 1 ? 'bg-yellow-400 text-white shadow-md shadow-yellow-500/20' : 
                                                overallRank === 2 ? 'bg-slate-300 text-white shadow-md shadow-slate-500/20' : 
                                                overallRank === 3 ? 'bg-orange-400 text-white shadow-md shadow-orange-500/20' : 
                                                'text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5'
                                            }`}>
                                                {overallRank}
                                            </span>
                                        </div>
                                        <div className="col-span-4 font-bold text-sm text-gray-800 dark:text-gray-200">
                                            <UserPopover userId={user.userId} userName={user.name} hasBlocked={user.hasBlocked}>
                                                <span className="hover:underline cursor-pointer">{user.name}</span>
                                            </UserPopover>
                                        </div>
                                        <div className="col-span-3 flex justify-center">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-[rgba(99,102,241,0.1)] border border-indigo-200 dark:border-[rgba(99,102,241,0.2)] rounded-md text-xs font-bold text-indigo-700 dark:text-indigo-300 w-fit">
                                                <img src={getTierImage(user.tierName || '일반')} alt={user.tierName || '일반'} className="w-5 h-5" />
                                                <span>{user.tierName || '일반'}</span>
                                            </div>
                                        </div>
                                        <span className="col-span-3 text-right text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                            {user.point.toLocaleString()} PT
                                        </span>
                                    </div>
                                );
                            })}

                            {rankingList.length === 0 && (
                                <div className="text-center py-12 text-sm text-gray-400 font-bold">
                                    랭킹 데이터가 존재하지 않습니다.
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-[#222]">
                                    <button 
                                        disabled={page === 0}
                                        onClick={() => setPage(prev => prev - 1)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        이전
                                    </button>
                                    <span className="text-xs font-bold text-gray-500">
                                        {page + 1} / {totalPages}
                                    </span>
                                    <button 
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(prev => prev + 1)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
