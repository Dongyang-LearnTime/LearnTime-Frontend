import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { 
    getReceivedPendingRequestsApi, 
    getSentPendingRequestsApi,
    acceptFriendRequestApi,
    rejectFriendRequestApi,
    cancelFriendRequestApi,
    getFriendsApi,
    deleteFriendApi
} from '../api/friendRequestApi';
import type { FriendRequestResponse, FriendResponse } from '../api/friendRequestApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import RequestListCard from '../../../components/common/RequestListCard';

export default function FriendRequestPage() {
    usePageTitle("learn-time | 친구 알림");
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = (searchParams.get('tab') ?? 'received') as 'received' | 'sent' | 'friends';

    const [requests, setRequests] = useState<FriendRequestResponse[]>([]);
    const [friends, setFriends] = useState<FriendResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            setError('');
            try {
                if (currentTab === 'friends') {
                    const data = await getFriendsApi();
                    setFriends(data);
                } else {
                    const data = currentTab === 'received' 
                        ? await getReceivedPendingRequestsApi() 
                        : await getSentPendingRequestsApi();
                    setRequests(data);
                }
            } catch (err) {
                setError(getApiErrorUtil(err));
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [currentTab]);

    const handleTabClick = (tabName: 'received' | 'sent' | 'friends') => {
        setSearchParams({ tab: tabName });
    };

    const handleFriendDelete = async (friendUserId: number) => {
        if (!confirm('정말로 친구를 삭제하시겠습니까?')) return;
        try {
            await deleteFriendApi(friendUserId);
            setFriends(prev => prev.filter(f => f.userId !== friendUserId));
            alert('친구가 삭제되었습니다.');
        } catch (err) {
            alert(getApiErrorUtil(err) || '친구 삭제에 실패했습니다.');
        }
    };

    const handleAccept = async (id: number) => {
        try {
            await acceptFriendRequestApi(id);
            setRequests(prev => prev.filter(req => req.friendRequestId !== id));
        } catch (err) {
            alert(getApiErrorUtil(err) || '친구 요청 승인에 실패했습니다.');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await rejectFriendRequestApi(id);
            setRequests(prev => prev.filter(req => req.friendRequestId !== id));
        } catch (err) {
            alert(getApiErrorUtil(err) || '친구 요청 거절에 실패했습니다.');
        }
    };

    const handleCancel = async (id: number) => {
        try {
            await cancelFriendRequestApi(id);
            setRequests(prev => prev.filter(req => req.friendRequestId !== id));
        } catch (err) {
            alert(getApiErrorUtil(err) || '친구 요청 취소에 실패했습니다.');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[80vh]">
            <h1 className="text-2xl font-black tracking-tight mb-8 text-gray-900 dark:text-white">친구 요청 알림</h1>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-100 dark:border-[#1a1a1a] mb-8 gap-4">
                <button
                    onClick={() => handleTabClick('received')}
                    className={`py-3 px-4 text-base font-bold transition-all border-b-2 ${
                        currentTab === 'received' 
                        ? 'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500' 
                        : 'text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-gray-800'
                    }`}
                >
                    받은 알림
                </button>
                <button
                    onClick={() => handleTabClick('sent')}
                    className={`py-3 px-4 text-base font-bold transition-all border-b-2 ${
                        currentTab === 'sent' 
                        ? 'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500' 
                        : 'text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-gray-800'
                    }`}
                >
                    보낸 알림
                </button>
                <button
                    onClick={() => handleTabClick('friends')}
                    className={`py-3 px-4 text-base font-bold transition-all border-b-2 ${
                        currentTab === 'friends' 
                        ? 'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500' 
                        : 'text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-gray-800'
                    }`}
                >
                    친구 목록
                </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="text-rose-500 text-center mt-4 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-sm font-bold">
                    {error}
                </div>
            )}

            {/* 로딩 중 */}
            {isLoading && !error && (
                <div className="text-center py-20 text-gray-400 font-bold text-sm">
                    로딩 중...
                </div>
            )}

            {/* 요청 목록 */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-4">
                    {currentTab === 'friends' ? (
                        friends.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
                                등록된 친구가 없습니다.
                            </div>
                        ) : (
                            friends.map(friend => (
                                <div key={friend.friendId} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-[#050505] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-[#333] transition-all gap-4">
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                            {friend.name}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
                                            친구 등록일: {new Date(friend.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleFriendDelete(friend.userId)}
                                            className="px-5 py-2.5 bg-white dark:bg-[#111] border border-rose-500 text-rose-500 text-sm font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                        >
                                            친구 삭제
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        requests.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
                                {currentTab === 'received' ? '대기 중인 받은 친구 요청이 없습니다.' : '대기 중인 보낸 친구 요청이 없습니다.'}
                            </div>
                        ) : (
                            requests.map(req => (
                                <RequestListCard 
                                    key={req.friendRequestId}
                                    title={currentTab === 'received' ? req.requesterName : req.receiverName}
                                    date={req.createdAt}
                                    type={currentTab}
                                    onAccept={() => handleAccept(req.friendRequestId)}
                                    onReject={() => handleReject(req.friendRequestId)}
                                    onCancel={() => handleCancel(req.friendRequestId)}
                                />
                            ))
                        )
                    )}
                </div>
            )}
        </div>
    );
}
