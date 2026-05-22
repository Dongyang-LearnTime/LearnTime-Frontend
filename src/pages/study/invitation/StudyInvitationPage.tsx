import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import RequestListCard from '../../../components/common/RequestListCard';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import {
    getReceivedInvitationsApi,
    getSentInvitationsApi,
    acceptInvitationApi,
    rejectInvitationApi,
    cancelInvitationApi,
    type StudyInvitationResponse
} from '../api/StudyInvitationApi';

export default function StudyInvitationPage() {
    usePageTitle("learn-time | 스터디 초대");
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = (searchParams.get('tab') as 'received' | 'sent') || 'received';

    const [invitations, setInvitations] = useState<StudyInvitationResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // 데이터 로딩
    useEffect(() => {
        const fetchInvitations = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = currentTab === 'received'
                    ? await getReceivedInvitationsApi()
                    : await getSentInvitationsApi();
                setInvitations(data);
            } catch (err) {
                setError(getApiErrorUtil(err));
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvitations();
    }, [currentTab]);

    const handleTabClick = (tabName: 'received' | 'sent') => {
        setSearchParams({ tab: tabName });
    };

    const handleAccept = async (id: number) => {
        try {
            await acceptInvitationApi(id);
            setInvitations(prev => prev.filter(inv => inv.studyInvitationId !== id));
        } catch (err) {
            alert(getApiErrorUtil(err) || '초대 수락에 실패했습니다.');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await rejectInvitationApi(id);
            setInvitations(prev => prev.filter(inv => inv.studyInvitationId !== id));
        } catch (err) {
            alert(getApiErrorUtil(err) || '초대 거절에 실패했습니다.');
        }
    };

    const handleCancel = async (id: number) => {
        try {
            await cancelInvitationApi(id);
            setInvitations(prev => prev.filter(inv => inv.studyInvitationId !== id));
        } catch (err) {
            alert(getApiErrorUtil(err) || '초대 취소에 실패했습니다.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 mt-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">스터디 초대 관리</h1>

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
                    받은 초대
                </button>
                <button
                    onClick={() => handleTabClick('sent')}
                    className={`py-3 px-6 text-lg font-medium transition-colors ${
                        currentTab === 'sent' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    보낸 초대
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

            {/* 초대 목록 */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-4">
                    {invitations.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">
                            {currentTab === 'received' 
                                ? '대기 중인 받은 스터디 초대가 없습니다.' 
                                : '대기 중인 보낸 스터디 초대가 없습니다.'}
                        </div>
                    ) : (
                        invitations.map(invitation => (
                            <RequestListCard 
                                key={invitation.studyInvitationId} 
                                title={currentTab === 'received' ? `${invitation.userName}님의 초대` : `${invitation.userName}님에게 보낸 초대`}
                                date={invitation.requestedAt}
                                badgeText={invitation.studyTitle}
                                type={currentTab}
                                onAccept={() => handleAccept(invitation.studyInvitationId)}
                                onReject={() => handleReject(invitation.studyInvitationId)}
                                onCancel={() => handleCancel(invitation.studyInvitationId)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
