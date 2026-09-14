import { toast } from '../../../utils/toast';
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
} from '../api/studyInvitationApi';
import {
    getMyStudyJoinRequestsApi,
    cancelStudyJoinRequestApi
} from '../api/studyJoinRequestApi';
import type { StudyJoinRequestResponse } from '../types/StudyTypes';

export default function StudyInvitationPage() {
    usePageTitle("learn-time | 스터디 초대");
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = (searchParams.get('tab') as 'received' | 'sent' | 'join-requests') || 'received';

    const [invitations, setInvitations] = useState<StudyInvitationResponse[]>([]);
    const [joinRequests, setJoinRequests] = useState<StudyJoinRequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // 데이터 로딩
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                if (currentTab === 'join-requests') {
                    const data = await getMyStudyJoinRequestsApi();
                    setJoinRequests(data);
                } else {
                    const data = currentTab === 'received'
                        ? await getReceivedInvitationsApi()
                        : await getSentInvitationsApi();
                    setInvitations(data);
                }
            } catch (err) {
                setError(getApiErrorUtil(err));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentTab]);

    const handleTabClick = (tabName: 'received' | 'sent' | 'join-requests') => {
        setSearchParams({ tab: tabName });
    };

    const handleCancelJoinRequest = async (id: number) => {
        try {
            await cancelStudyJoinRequestApi(id);
            toast.info('가입 신청이 취소되었습니다.');
            setJoinRequests(prev => prev.map(r => r.studyJoinRequestId === id ? { ...r, status: 'CANCELED' } : r));
        } catch (err) {
            toast.error(getApiErrorUtil(err) || '가입 신청 취소에 실패했습니다.');
        }
    };

    const handleAccept = async (id: number) => {
        try {
            await acceptInvitationApi(id);
            setInvitations(prev => prev.filter(inv => inv.studyInvitationId !== id));
        } catch (err) {
            toast.info(getApiErrorUtil(err) || '초대 수락에 실패했습니다.');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await rejectInvitationApi(id);
            setInvitations(prev => prev.filter(inv => inv.studyInvitationId !== id));
        } catch (err) {
            toast.info(getApiErrorUtil(err) || '초대 거절에 실패했습니다.');
        }
    };

    const handleCancel = async (id: number) => {
        try {
            await cancelInvitationApi(id);
            setInvitations(prev => prev.filter(inv => inv.studyInvitationId !== id));
        } catch (err) {
            toast.info(getApiErrorUtil(err) || '초대 취소에 실패했습니다.');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[80vh]">
            <h1 className="text-2xl font-black tracking-tight mb-8 text-gray-900 dark:text-white">스터디 초대 관리</h1>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-200 dark:border-[#1a1a1a] mb-6">
                <button
                    onClick={() => handleTabClick('received')}
                    className={`py-3 px-6 text-lg font-medium transition-colors ${
                        currentTab === 'received' 
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    받은 초대
                </button>
                <button
                    onClick={() => handleTabClick('sent')}
                    className={`py-3 px-6 text-lg font-medium transition-colors ${
                        currentTab === 'sent' 
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    보낸 초대
                </button>
                <button
                    onClick={() => handleTabClick('join-requests')}
                    className={`py-3 px-6 text-lg font-medium transition-colors ${
                        currentTab === 'join-requests' 
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    내 가입 신청 내역
                </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="text-red-500 text-center mt-4 bg-red-50 dark:bg-red-950/20 p-4 rounded-md border border-red-100 dark:border-red-900/40">
                    {error}
                </div>
            )}

            {/* 로딩 중 */}
            {isLoading && !error && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    로딩 중...
                </div>
            )}

            {/* 목록 영역 */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-4">
                    {currentTab === 'join-requests' ? (
                        joinRequests.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-100 dark:border-[#1a1a1a] text-gray-500 dark:text-gray-400">
                                신청한 스터디 가입 내역이 없습니다.
                            </div>
                        ) : (
                            joinRequests.map(req => (
                                <div key={req.studyJoinRequestId} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-[#1a1a1a] shadow-xs">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-base font-black text-gray-900 dark:text-white">{req.studyTitle}</span>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                                req.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' :
                                                'bg-gray-100 text-gray-500 dark:bg-[#222]'
                                            }`}>
                                                {req.status === 'PENDING' ? '대기 중' : req.status === 'APPROVED' ? '승인됨' : req.status === 'REJECTED' ? '거절됨' : '취소됨'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">신청일: {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {req.status === 'PENDING' && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancelJoinRequest(req.studyJoinRequestId)}
                                            className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-[#333] text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors cursor-pointer"
                                        >
                                            신청 취소
                                        </button>
                                    )}
                                </div>
                            ))
                        )
                    ) : (
                        invitations.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-100 dark:border-[#1a1a1a] text-gray-500 dark:text-gray-400">
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
                        )
                    )}
                </div>
            )}
        </div>
    );
}
