import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { NotificationApi } from './notificationApi';
import { useNotificationStore } from '../../store/useNotificationStore';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import { toast } from '../../utils/toast';

export default function NotificationPage() {
    usePageTitle("learn-time | 전체 알림");
    const navigate = useNavigate();

    // 전역 상태
    const notifications = useNotificationStore((state) => state.notifications);
    const hasNext = useNotificationStore((state) => state.hasNext);
    const nextCursor = useNotificationStore((state) => state.nextCursor);
    const setNotifications = useNotificationStore((state) => state.setNotifications);
    const appendNotifications = useNotificationStore((state) => state.appendNotifications);
    const markAsReadLocal = useNotificationStore((state) => state.markAsReadLocal);
    const markAllAsReadLocal = useNotificationStore((state) => state.markAllAsReadLocal);
    const deleteNotificationLocal = useNotificationStore((state) => state.deleteNotificationLocal);

    // 컴포넌트 로컬 상태
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // 무한 스크롤 옵저버 ref
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // 초기 데이터 로딩
    useEffect(() => {
        let isMounted = true;
        const fetchInitial = async () => {
            setIsLoading(true);
            try {
                const res = await NotificationApi.getNotifications(null);
                if (isMounted) setNotifications(res.content, res.hasNext, res.nextCursor);
            } catch (err) {
                if (isMounted) setError(getApiErrorUtil(err));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchInitial();
        return () => { isMounted = false; };
    }, [setNotifications]);

    // 무한 스크롤 다음 페이지 가져오기
    const fetchMore = useCallback(async () => {
        if (!hasNext || isFetchingMore) return;
        setIsFetchingMore(true);
        try {
            const res = await NotificationApi.getNotifications(nextCursor);
            appendNotifications(res.content, res.hasNext, res.nextCursor);
        } catch (err) {
            console.error("Failed to fetch more notifications:", err);
        } finally {
            setIsFetchingMore(false);
        }
    }, [hasNext, nextCursor, isFetchingMore, appendNotifications]);

    // Intersection Observer 셋업
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNext && !isFetchingMore) {
                fetchMore();
            }
        }, { threshold: 0.1 });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasNext, isFetchingMore, fetchMore]);

    // 단일 항목 클릭 (읽음 처리 및 라우팅)
    const handleNotificationClick = async (id: number, isRead: boolean, type: string) => {
        if (!isRead && id > 0) {
            try {
                await NotificationApi.readNotification(id);
                markAsReadLocal(id);
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
        
        if (type.includes("FRIEND_REQUEST")) {
            navigate("/friend/requests");
        } else if (type.includes("STUDY_INVITATION")) {
            navigate("/study/invitation");
        } else if (type.includes("MESSAGE") || type.includes("NOTE")) {
            navigate("/messages");
        }
    };

    // 체크박스 토글
    const toggleSelect = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // 전체 선택/해제
    const toggleSelectAll = () => {
        if (selectedIds.size === notifications.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(notifications.map(n => n.notificationId)));
        }
    };

    // 단일 삭제
    const handleDeleteSingle = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        
        try {
            if (id > 0) {
                await NotificationApi.deleteNotification(id);
            }
            deleteNotificationLocal(id);
            
            // 만약 선택된 목록에 있으면 제거
            const newSelected = new Set(selectedIds);
            if (newSelected.has(id)) {
                newSelected.delete(id);
                setSelectedIds(newSelected);
            }
        } catch (err) {
            toast.error(getApiErrorUtil(err) || "삭제 실패");
        }
    };

    // 다중 삭제
    const handleDeleteBulk = async () => {
        if (selectedIds.size === 0) return;

        try {
            const idsToDelete = Array.from(selectedIds).filter(id => id > 0);
            if (idsToDelete.length > 0) {
                await NotificationApi.deleteNotifications(idsToDelete);
            }
            
            // 로컬 스토어에서도 제거
            Array.from(selectedIds).forEach(id => deleteNotificationLocal(id));
            setSelectedIds(new Set());
        } catch (err) {
            toast.error(getApiErrorUtil(err) || "다중 삭제 실패");
        }
    };

    // 모두 읽음 처리
    const handleReadAll = async () => {
        if (notifications.length === 0) return;
        try {
            await NotificationApi.readAllNotifications();
            markAllAsReadLocal();
        } catch (err) {
            toast.error(getApiErrorUtil(err) || "모두 읽음 처리에 실패했습니다.");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[80vh]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">전체 알림</h1>
                
                {notifications.length > 0 && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReadAll}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                            모두 읽음
                        </button>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                        <button
                            onClick={toggleSelectAll}
                            className="text-sm font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            {selectedIds.size === notifications.length ? '선택 해제' : '전체 선택'}
                        </button>
                        <button
                            onClick={handleDeleteBulk}
                            disabled={selectedIds.size === 0}
                            className={`px-4 py-2 text-sm font-bold rounded-2xl transition-all ${
                                selectedIds.size > 0 
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400' 
                                : 'bg-gray-100 text-gray-400 dark:bg-[#1a1a1a] dark:text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            선택 삭제 ({selectedIds.size})
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="text-rose-500 text-center mb-6 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-sm font-bold">
                    {error}
                </div>
            )}

            {isLoading && notifications.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-bold text-sm">알림을 불러오는 중입니다...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
                    수신된 알림이 없습니다.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {notifications.map((item) => (
                        <div 
                            key={item.notificationId}
                            onClick={() => handleNotificationClick(item.notificationId, item.isRead, item.type)}
                            className={`flex items-start gap-4 p-5 rounded-3xl border transition-all cursor-pointer group ${
                                item.isRead 
                                ? 'bg-white dark:bg-[#050505] border-gray-100 dark:border-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#333]' 
                                : 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700/50'
                            }`}
                        >
                            <div className="mt-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-indigo-600 bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                    checked={selectedIds.has(item.notificationId)}
                                    onChange={(e) => toggleSelect(item.notificationId, e as any)}
                                />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <h3 className={`text-base font-black tracking-tight ${item.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                        {!item.isRead && <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2 mb-0.5" />}
                                        {item.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                                        {new Date(item.createdAt).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${item.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-400'}`}>
                                    {item.message}
                                </p>
                            </div>

                            <button
                                onClick={(e) => handleDeleteSingle(item.notificationId, e)}
                                className="p-2 text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label="삭제"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    
                    {/* Intersection Observer 타겟 엘리먼트 */}
                    <div ref={loadMoreRef} className="py-8 text-center text-gray-400 font-bold text-xs">
                        {isFetchingMore ? '더 불러오는 중...' : hasNext ? '' : '모든 알림을 불러왔습니다.'}
                    </div>
                </div>
            )}
        </div>
    );
}
