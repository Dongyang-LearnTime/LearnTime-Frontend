import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { axiosInstance } from '../../app/apiClient';
import { getProfile } from '../../pages/profile/api/profileApi';
import type { ProfileResponse } from '../../pages/profile/types/profileTypes';
import type { CursorResponse } from '../../types/paginationType';

interface UserSearchBarProps {
  /** 헤더 배경에 따른 색상 테마. 기본값: 'light' */
  variant?: 'light' | 'dark';
}

export const UserSearchBar = ({ variant = 'light' }: UserSearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<ProfileResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  
  const debouncedKeyword = useDebounce(keyword, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 바깥쪽 클릭 시 모달 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 첫 페이지 검색 로직
  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setResults([]);
      setNextCursor(null);
      setHasNext(false);
      setIsSearching(false);
      return;
    }

    const fetchInitialUsers = async () => {
      setIsSearching(true);
      try {
        const searchRes = await axiosInstance.get<CursorResponse<number>>('/api/user/search', {
          params: { keyword: debouncedKeyword, size: 10 }
        });
        
        const userIds = searchRes.data.content;
        setNextCursor(searchRes.data.nextCursor);
        setHasNext(searchRes.data.hasNext);

        if (!userIds || userIds.length === 0) {
          setResults([]);
          return;
        }

        const profiles = await Promise.all(userIds.map(id => getProfile(id)));
        setResults(profiles);
      } catch (error) {
        console.error("Failed to search users:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    void fetchInitialUsers();
  }, [debouncedKeyword]);

  // 무한 스크롤 로직 (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isFetchingNext) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNext, isFetchingNext, nextCursor]);

  const fetchNextPage = async () => {
    if (!nextCursor || !hasNext) return;
    setIsFetchingNext(true);
    try {
      const searchRes = await axiosInstance.get<CursorResponse<number>>('/api/user/search', {
        params: { keyword: debouncedKeyword, lastUserId: nextCursor, size: 10 }
      });
      
      const userIds = searchRes.data.content;
      setNextCursor(searchRes.data.nextCursor);
      setHasNext(searchRes.data.hasNext);

      if (userIds && userIds.length > 0) {
        const newProfiles = await Promise.all(userIds.map(id => getProfile(id)));
        setResults(prev => [...prev, ...newProfiles]);
      }
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    } finally {
      setIsFetchingNext(false);
    }
  };

  const handleUserClick = (userId: number) => {
    setIsFocused(false);
    setKeyword('');
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="relative z-50 flex items-center" ref={searchRef}>
      <div className={`flex items-center rounded-full transition-all duration-300 ${isFocused ? 'w-64 ring-2 ring-indigo-500/50' : 'w-48'} px-4 py-2 ${
        variant === 'dark'
          ? 'bg-white/8 hover:bg-white/12'
          : 'bg-gray-100 dark:bg-[#1a1a1a]'
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="사용자 검색..."
          className={`bg-transparent border-none outline-none text-sm w-full ml-2 placeholder-gray-400 ${
            variant === 'dark' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
          }`}
        />
      </div>

      {/* 검색 결과 드롭다운 */}
      {isFocused && keyword.trim().length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl overflow-hidden max-h-80 overflow-y-auto ${
          variant === 'dark'
            ? 'bg-slate-900 border border-slate-700/60 shadow-black/70'
            : 'bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-[#222] shadow-gray-200/40 dark:shadow-black/70'
        }`}>
          {isSearching ? (
            <div className="p-4 text-center text-xs text-gray-500">검색 중...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map(user => (
                <div 
                  key={user.userId}
                  onClick={() => handleUserClick(user.userId)}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                    variant === 'dark'
                      ? 'hover:bg-white/5'
                      : 'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                  }`}
                >
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      variant === 'dark'
                        ? 'bg-indigo-900/50 text-indigo-400'
                        : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate ${
                      variant === 'dark' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>{user.name}</span>
                    <span className={`text-[10px] truncate ${
                      variant === 'dark' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>{user.tierName || '티어 없음'}</span>
                  </div>
                </div>
              ))}
              
              {/* 스크롤 감지용 요소 */}
              {hasNext && (
                <div ref={observerRef} className="p-3 flex justify-center items-center">
                  <div className="w-4 h-4 border-2 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-500">
              "{keyword}" 검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
