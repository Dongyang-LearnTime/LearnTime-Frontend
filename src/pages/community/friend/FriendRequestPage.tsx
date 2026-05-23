import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { 
    getReceivedPendingRequestsApi, 
    getSentPendingRequestsApi,
    acceptFriendRequestApi,
    rejectFriendRequestApi,
    cancelFriendRequestApi
} from '../api/FriendRequestApi';
import type { FriendRequestResponse } from '../api/FriendRequestApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import RequestListCard from '../../../components/common/RequestListCard';

export default function FriendRequestPage() {
    usePageTitle("learn-time | 친구 알림");
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = (searchParams.get('tab') ?? 'received') as 'received' | 'sent';

    const [requests, setRequests] = useState<FriendRequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = currentTab === 'received' 
                    ? await getReceivedPendingRequestsApi() 
                    : await getSentPendingRequestsApi();
                setRequests(data);
            } catch (err) {
                setError(getApiErrorUtil(err));
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [currentTab]);

    const handleTabClick = (tabName: 'received' | 'sent') => {
        setSearchParams({ tab: tabName });
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
        <div className="max-w-4xl mx-auto p-4 mt-8">
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
                    {requests.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
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
                    )}
                </div>
            )}
        </div>
    );
}
