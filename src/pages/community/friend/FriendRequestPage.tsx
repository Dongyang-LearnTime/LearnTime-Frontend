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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">친구 요청 알림</h1>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => handleTabClick('received')}
                    className={`py-3 px-6 text-lg font-medium transition-colors ${
                        currentTab === 'received' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    받은 알림
                </button>
                <button
                    onClick={() => handleTabClick('sent')}
                    className={`py-3 px-6 text-lg font-medium transition-colors ${
                        currentTab === 'sent' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    보낸 알림
                </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="text-red-500 text-center mt-4 bg-red-50 p-4 rounded-md border border-red-100">
                    {error}
                </div>
            )}

            {/* 로딩 중 */}
            {isLoading && !error && (
                <div className="text-center py-12 text-gray-500">
                    로딩 중...
                </div>
            )}

            {/* 요청 목록 */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-4">
                    {requests.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">
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
