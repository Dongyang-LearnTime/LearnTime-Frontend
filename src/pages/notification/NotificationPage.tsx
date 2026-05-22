import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { NotificationApi } from './NotificationApi';
import { useNotificationStore } from '../../store/useNotificationStore';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';

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
        const fetchInitial = async () => {
            setIsLoading(true);
            try {
                const res = await NotificationApi.getNotifications(null);
                setNotifications(res.content, res.hasNext, res.nextCursor);
            } catch (err) {
                setError(getApiErrorUtil(err));
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitial();
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
            alert(getApiErrorUtil(err) || "삭제 실패");
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
            alert(getApiErrorUtil(err) || "다중 삭제 실패");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">전체 알림</h1>
                
                {notifications.length > 0 && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleSelectAll}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {selectedIds.size === notifications.length ? '선택 해제' : '전체 선택'}
                        </button>
                        <button
                            onClick={handleDeleteBulk}
                            disabled={selectedIds.size === 0}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                selectedIds.size > 0 
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            선택 삭제 ({selectedIds.size})
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="text-red-500 text-center mb-4 bg-red-50 p-4 rounded-md border border-red-100">
                    {error}
                </div>
            )}

            {isLoading && notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">로딩 중...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">
                    수신된 알림이 없습니다.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map((item) => (
                        <div 
                            key={item.notificationId}
                            onClick={() => handleNotificationClick(item.notificationId, item.isRead, item.type)}
                            className={`flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
                                item.isRead 
                                ? 'bg-white border-gray-200 hover:border-gray-300 shadow-sm' 
                                : 'bg-blue-50/30 border-blue-100 shadow-sm hover:border-blue-200'
                            }`}
                        >
                            <div className="mt-0.5" onClick={e => e.stopPropagation()}>
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    checked={selectedIds.has(item.notificationId)}
                                    onChange={(e) => toggleSelect(item.notificationId, e as any)}
                                />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className={`text-base font-semibold ${item.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                                        {!item.isRead && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mb-0.5" />}
                                        {item.title}
                                    </h3>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                                        {new Date(item.createdAt).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className={`mt-1 text-sm ${item.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                    {item.message}
                                </p>
                            </div>

                            <button
                                onClick={(e) => handleDeleteSingle(item.notificationId, e)}
                                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                                aria-label="삭제"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    
                    {/* Intersection Observer 타겟 엘리먼트 */}
                    <div ref={loadMoreRef} className="py-4 text-center text-gray-500 text-sm h-12 flex items-center justify-center">
                        {isFetchingMore ? '더 불러오는 중...' : hasNext ? '' : '모든 알림을 불러왔습니다.'}
                    </div>
                </div>
            )}
        </div>
    );
}
