import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, SearchIcon, SparklesIcon, ThumbsUpIcon, TrophyIcon } from '../../components/ui/Icons';
import { PostCard } from './components/PostCard';
import { getPostListApi, searchPostListApi, getWeeklyPopularPostsApi, getRankingApi, getNoticePostsApi } from './api/postApi';
import { useAuthStore } from '../../store/useAuthStore';
import type { PostListResponse, PointRankingResponse } from './types/postTypes';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function CommunityPage() {
  usePageTitle('커뮤니티 광장');
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [ posts, setPosts ] = useState<PostListResponse[]>([]);
  const [ notices, setNotices ] = useState<PostListResponse[]>([]);
  const [ topPosts, setTopPosts ] = useState<PostListResponse[]>([]);
  const [ ranking, setRanking ] = useState<PointRankingResponse[]>([]);
  const [ searchInput, setSearchInput ] = useState('');
  const [ searchKeyword, setSearchKeyword ] = useState('');

  const fetchPosts = useCallback(async (currentPage: number, keyword: string) => {
    try {
      if (keyword.trim()) {
        const response = await searchPostListApi(keyword, currentPage);
        if (currentPage === 0) setPosts(response.content);
        else setPosts(prev => [...prev, ...response.content]);
      } else {
        const response = await getPostListApi(currentPage);
        if (currentPage === 0) setPosts(response.content);
        else setPosts(prev => [...prev, ...response.content]);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      alert('서버로부터 게시글 목록을 불러오는 데 실패했습니다.');
    }
  }, []);

  const fetchTopPosts = async () => {
    try {
      const popular = await getWeeklyPopularPostsApi();
      setTopPosts(popular.slice(0, 2));
    } catch (error) {
      console.error('Failed to fetch top posts:', error);
    }
  };

  const fetchRanking = async () => {
    try {
      const response = await getRankingApi(0, 5);
      setRanking(response.content);
    } catch (error) {
      console.error('Failed to fetch ranking:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const data = await getNoticePostsApi();
      setNotices(data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  // 선언형 아키텍처: searchKeyword 상태 변화 감지 시 자동으로 데이터 갱신
  useEffect(() => {
    fetchTopPosts();
    fetchRanking();
    fetchNotices();
    fetchPosts(0, searchKeyword);
  }, [fetchPosts, searchKeyword]);

  // 엔터/클릭 시 검색어 상태만 업데이트하여 선언형 이벤트를 유도
  const triggerSearch = () => {
    setSearchKeyword(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const goToCreatePost = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    navigate('/community/post/create');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 상단 헤더 영역 */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6 text-gray-900 dark:text-white">커뮤니티 광장</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium ml-2 mb-8">함께 성장하는 학습자들의 이야기를 만나보세요.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goToCreatePost}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusIcon size={16} /> 게시글 작성
          </button>
        </div>
      </header>

      {/* 2열 그리드 구조 도입 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 좌측 9열: 기존 메인 콘텐츠 */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* 검색 인풋 영역 */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex items-center grow w-full gap-3">
              <div className="relative grow">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="검색어를 입력하세요..."
                  className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-[#1a1a1a] rounded-4xl pl-14 pr-24 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-sm"
                />
                <button
                  onClick={triggerSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-3xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  검색
                </button>
              </div>
            </div>
          </div>

          {topPosts.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                <span className="text-rose-500"><SparklesIcon size={20} /></span> 주간 인기글 랭킹
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topPosts.map((post, idx) => (
                  <div key={post.postId} onClick={() => navigate(`/community/post/${post.postId}`)} className="bg-linear-to-br from-indigo-50 to-rose-50 dark:from-[#111] dark:to-[#1a1a1a] p-6 rounded-4xl border border-indigo-100 dark:border-[#222] hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl font-black text-indigo-200 dark:text-indigo-900 italic">0{idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mb-3 text-lg">{post.title}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500">{post.userName}</span>
                        <span className="flex items-center gap-1 text-rose-500 font-black text-xs">
                          <ThumbsUpIcon size={14} /> {post.likeCount}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2 text-gray-500">최신 게시글</h3>
            
            {/* 공지글 목록 렌더링 */}
            {notices.length > 0 && notices.map(post => (
              <div key={post.postId} className="border-l-4 border-rose-500 rounded-r-3xl bg-rose-50/5 dark:bg-rose-950/5 overflow-hidden">
                <PostCard
                  post={post}
                  onClick={() => navigate(`/community/post/${post.postId}`)}
                />
              </div>
            ))}

            {/* 일반 최신 게시글 목록 렌더링 */}
            {posts.map(post => (
              <PostCard
                key={post.postId}
                post={post}
                onClick={() => navigate(`/community/post/${post.postId}`)}
              />
            ))}
            {posts.length === 0 && notices.length === 0 && (
              <div className="py-20 text-center text-gray-400 font-bold">
                게시글이 존재하지 않습니다. 첫 글을 작성해보세요!
              </div>
            )}
          </div>
        </div>

        {/* 우측 3열: 포인트 순위 Top 5 미니 박스 */}
        <div className="lg:col-span-3 space-y-10">
          {/* 리워드 마일스톤 상세 배너 */}
          <div 
            onClick={() => navigate('/badge-tier-info')}
            className="cursor-pointer bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-900/40 hover:from-indigo-100 hover:to-purple-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] select-none group"
          >
            <div className="absolute right-[-10%] bottom-[-10%] w-24 h-24 bg-indigo-200/40 dark:bg-indigo-600/20 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform"></div>
            <h4 className="text-base font-black mb-1.5 flex items-center gap-1.5 text-indigo-900 dark:text-indigo-100">
              🏆 리워드 마일스톤
            </h4>
            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 font-bold leading-relaxed mb-4">
              학습하고 진도를 완수해 포인트를 쌓으세요! 티어를 업그레이드하고 고유 배지를 수집할 수 있습니다.
            </p>
            <span className="inline-block bg-white dark:bg-indigo-900/80 border border-indigo-100 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl shadow-xs group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-colors">
              업적 정보 보기 &rarr;
            </span>
          </div>

          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border border-gray-200/60 dark:border-[#222]/80 rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all hover:shadow-xl duration-300">
            {/* 상단 장식 라인 */}
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-amber-400 via-indigo-500 to-violet-500" />
            
            <h3 className="text-sm font-black tracking-tight mb-4 flex items-center gap-1.5 text-gray-900 dark:text-white">
              <TrophyIcon size={18} className="text-amber-500" /> 포인트 랭킹 Top 5
            </h3>
            
            <div className="space-y-2">
              {ranking.map((user, idx) => (
                <div 
                  key={user.userId} 
                  className="flex items-center justify-between p-2 bg-gray-50/40 dark:bg-white/2 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-gray-100/30 dark:border-white/2 rounded-xl group transition-all duration-300 hover:translate-x-1"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 transition-transform group-hover:scale-110 ${
                      idx === 0 ? 'bg-linear-to-br from-amber-300 to-amber-500 text-white shadow-sm shadow-amber-500/30' : 
                      idx === 1 ? 'bg-linear-to-br from-slate-300 to-slate-400 text-white shadow-sm shadow-slate-400/30' : 
                      idx === 2 ? 'bg-linear-to-br from-amber-600 to-amber-700 text-white shadow-sm shadow-amber-700/30' : 
                      'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-gray-700 dark:text-gray-300 truncate max-w-21.25 sm:max-w-25">
                      {user.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider shrink-0 font-mono">
                    {user.point.toLocaleString()} PT
                  </span>
                </div>
              ))}

              {ranking.length === 0 && (
                <p className="text-center py-6 text-xs text-gray-400 font-bold">랭킹이 존재하지 않습니다.</p>
              )}

              {ranking.length > 0 && (
                <button
                  onClick={() => navigate('/community/ranking')}
                  className="w-full mt-3 py-2 px-3 bg-gray-50 hover:bg-indigo-50/80 dark:bg-white/5 dark:hover:bg-indigo-950/30 text-center text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  전체 순위 보기
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

