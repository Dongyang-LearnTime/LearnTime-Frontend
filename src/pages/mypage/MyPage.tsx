import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuthStore } from '../../store/useAuthStore';
import {
    User, FileText, MessageSquare, Heart, Coins, Settings,
    ChevronRight, LogOut, Trash2, Eye, Edit3, Lock, UserX, Archive
} from 'lucide-react';
import {
    getMyInfo, getMyPageSummary, updateMyName, updateMyPassword,
    deleteMyAccount, getMyPosts, getMyComments
} from './api/mypageApi';
import type { MyPageInfoResponse, MyPageSummaryResponse, MyPostItem, MyCommentItem } from '../../types/myPageTypes';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';

import BlockedUserList from './BlockedUserList';
import ArchivedStudyList from './ArchivedStudyList';

// ─────────────── 날짜 포맷 헬퍼 ───────────────
const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

// ─────────────── 오프셋 페이지네이션 UI ───────────────
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    const pages = Array.from({ length: total }, (_, i) => i);
    const visible = pages.filter(p => p >= current - 2 && p <= current + 2);
    return (
        <div className="flex items-center gap-1 justify-center mt-5">
            <button
                onClick={() => onChange(current - 1)} disabled={current === 0}
                className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >←</button>
            {visible[0] > 0 && <span className="text-gray-400 px-2">...</span>}
            {visible.map(p => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${p === current
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                >{p + 1}</button>
            ))}
            {visible[visible.length - 1] < total - 1 && <span className="text-gray-400 px-2">...</span>}
            <button
                onClick={() => onChange(current + 1)} disabled={current === total - 1}
                className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >→</button>
        </div>
    );
}

// ─────────────── 탭 타입 ───────────────
type Tab = 'info' | 'posts' | 'comments' | 'blocks' | 'archive';

export default function MyPage() {
    usePageTitle('마이페이지');
    const navigate = useNavigate();
    const { userName, clearAuth } = useAuthStore();

    const [activeTab, setActiveTab] = useState<Tab>('info');
    const [info, setInfo] = useState<MyPageInfoResponse | null>(null);
    const [summary, setSummary] = useState<MyPageSummaryResponse | null>(null);
    const [infoLoading, setInfoLoading] = useState(true);

    // ── 게시글 탭 상태
    const [posts, setPosts] = useState<MyPostItem[]>([]);
    const [postPage, setPostPage] = useState(0);
    const [postTotalPages, setPostTotalPages] = useState(0);
    const [postsLoading, setPostsLoading] = useState(false);

    // ── 댓글 탭 상태
    const [comments, setComments] = useState<MyCommentItem[]>([]);
    const [commentPage, setCommentPage] = useState(0);
    const [commentTotalPages, setCommentTotalPages] = useState(0);
    const [commentsLoading, setCommentsLoading] = useState(false);

    // ── 모달 상태
    const [showEditName, setShowEditName] = useState(false);
    const [showEditPw, setShowEditPw] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ── 폼 상태
    const [newName, setNewName] = useState('');
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [deleteInput, setDeleteInput] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    // ── 초기 데이터 로드
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const [i, s] = await Promise.all([getMyInfo(), getMyPageSummary()]);
                if (isMounted) {
                    setInfo(i);
                    setSummary(s);
                }
            } catch { /* noop */ }
            finally { if (isMounted) setInfoLoading(false); }

            if (!isMounted) return;
            // URL 쿼리로 탭 지정 가능하게
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab') as Tab;
            if (['info', 'posts', 'comments', 'blocks', 'archive'].includes(tabParam)) {
                setActiveTab(tabParam);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    // ── 게시글 탭 데이터
    useEffect(() => {
        if (activeTab !== 'posts') return;
        let isMounted = true;
        setPostsLoading(true);
        getMyPosts(postPage, 10).then(r => {
            if (isMounted) {
                setPosts(r.content);
                setPostTotalPages(r.totalPages);
            }
        }).finally(() => { if (isMounted) setPostsLoading(false); });
        return () => { isMounted = false; };
    }, [activeTab, postPage]);

    // ── 댓글 탭 데이터
    useEffect(() => {
        if (activeTab !== 'comments') return;
        let isMounted = true;
        setCommentsLoading(true);
        getMyComments(commentPage, 10).then(r => {
            if (isMounted) {
                setComments(r.content);
                setCommentTotalPages(r.totalPages);
            }
        }).finally(() => { if (isMounted) setCommentsLoading(false); });
        return () => { isMounted = false; };
    }, [activeTab, commentPage]);

    // ── 이름 수정
    const handleNameUpdate = async () => {
        if (!newName.trim()) { setFormError('이름을 입력해주세요.'); return; }
        setFormLoading(true); setFormError('');
        try {
            const data = await updateMyName(newName.trim());
            if (data?.accessToken) useAuthStore.getState().setAccessToken(data.accessToken);
            setInfo(prev => prev ? { ...prev, userName: newName.trim() } : prev);
            setShowEditName(false); setNewName('');
        } catch (e) {
            setFormError(getApiErrorUtil(e, '이름 변경에 실패했습니다.'));
        } finally { setFormLoading(false); }
    };

    // ── 비밀번호 수정
    const handlePwUpdate = async () => {
        if (!currentPw || !newPw) { setFormError('모든 항목을 입력해주세요.'); return; }
        if (newPw !== confirmPw) { setFormError('새 비밀번호가 일치하지 않습니다.'); return; }
        setFormLoading(true); setFormError('');
        try {
            await updateMyPassword(currentPw, newPw);
            clearAuth();
            navigate('/login');
        } catch (e) {
            setFormError(getApiErrorUtil(e, '비밀번호 변경에 실패했습니다.'));
        } finally { setFormLoading(false); }
    };

    // ── 회원 탈퇴
    const handleDelete = async () => {
        if (deleteInput !== '회원 탈퇴') return;
        setFormLoading(true); setFormError('');
        try {
            await deleteMyAccount(deleteInput);
            clearAuth();
            navigate('/');
        } catch (e) {
            setFormError(getApiErrorUtil(e, '탈퇴 처리 중 오류가 발생했습니다.'));
        } finally { setFormLoading(false); }
    };

    // ── 정보 가져오는 중 스켈레톤
    const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) => (
        <div className={`relative flex-1 min-w-[130px] rounded-2xl p-5 overflow-hidden border bg-white dark:bg-[#111] border-gray-100 dark:border-white/5 shadow-sm group hover:scale-[1.02] transition-all duration-300`}>
            <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10 dark:opacity-20 ${color}`} />
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color} bg-opacity-15`}>{icon}</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
        </div>
    );

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'info', label: '내 정보', icon: <User size={15} /> },
        { id: 'posts', label: '내 게시글', icon: <FileText size={15} /> },
        { id: 'comments', label: '내 댓글', icon: <MessageSquare size={15} /> },
        { id: 'blocks', label: '차단 관리', icon: <UserX size={15} /> },
        { id: 'archive', label: '스터디 아카이브', icon: <Archive size={15} /> },
    ];

    const handleTabChange = (id: Tab) => {
        setActiveTab(id);
        navigate(`/mypage?tab=${id}`, { replace: true });
    };

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-24">
            {/* 배경 글로우 */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/3" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-8 z-10">
                {/* ─── 헤더 ─── */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-indigo-500 tracking-widest uppercase mb-1">My Page</p>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                        {infoLoading ? '...' : (info?.userName || userName || '사용자')}님의 공간
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{info?.email}</p>
                </div>

                {/* ─── 요약 대시보드 카드 ─── */}
                {infoLoading ? (
                    <div className="flex gap-4 mb-8 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex-1 h-[100px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3 mb-8">
                        <StatCard icon={<FileText size={18} className="text-indigo-500" />} label="작성 게시글" value={summary?.postCount ?? 0} color="bg-indigo-500" />
                        <StatCard icon={<MessageSquare size={18} className="text-emerald-500" />} label="작성 댓글" value={summary?.commentCount ?? 0} color="bg-emerald-500" />
                        <StatCard icon={<Heart size={18} className="text-rose-500" />} label="받은 좋아요" value={summary?.totalLikeReceived ?? 0} color="bg-rose-500" />
                        <StatCard icon={<Coins size={18} className="text-amber-500" />} label="보유 포인트" value={`${summary?.point ?? 0} P`} color="bg-amber-500" />
                    </div>
                )}

                {/* ─── 탭 ─── */}
                <div className="flex flex-wrap gap-1 mb-6 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-1 shadow-sm w-fit">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleTabChange(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === t.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* ─── 내 정보 탭 ─── */}
                {activeTab === 'info' && (
                    <div className="space-y-4">
                        {/* 프로필 카드 */}
                        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={14} /> 기본 정보
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { label: '이메일', value: info?.email },
                                    { label: '이름', value: info?.userName },
                                    { label: '가입일', value: info?.createdAt ? fmt(info.createdAt) : '-' },
                                    { label: '가입 방식', value: info?.socialProvider === 'LOCAL' ? '일반 가입' : info?.socialProvider },
                                ].map(row => (
                                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                                        <span className="text-sm font-bold text-gray-400 dark:text-gray-500">{row.label}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{row.value || '-'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 설정 메뉴 */}
                        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                            <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider p-6 pb-3 flex items-center gap-2">
                                <Settings size={14} /> 계정 설정
                            </h2>
                            {[
                                { icon: <Edit3 size={15} />, label: '이름 변경', color: 'text-indigo-500', onClick: () => { setFormError(''); setNewName(''); setShowEditName(true); } },
                                { icon: <Lock size={15} />, label: '비밀번호 변경', color: 'text-amber-500', onClick: () => { setFormError(''); setCurrentPw(''); setNewPw(''); setConfirmPw(''); setShowEditPw(true); }, hide: info?.socialProvider !== 'LOCAL' },
                                { icon: <LogOut size={15} />, label: '로그아웃', color: 'text-gray-500', onClick: () => { clearAuth(); navigate('/'); } },
                            ].filter(m => !m.hide).map(menu => (
                                <button
                                    key={menu.label}
                                    onClick={menu.onClick}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-t border-gray-50 dark:border-white/5 first:border-0"
                                >
                                    <span className={`flex items-center gap-2.5 text-sm font-bold ${menu.color}`}>{menu.icon}{menu.label}</span>
                                    <ChevronRight size={14} className="text-gray-400" />
                                </button>
                            ))}
                        </div>

                        {/* 회원 탈퇴 */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => { setDeleteInput(''); setFormError(''); setShowDeleteModal(true); }}
                                className="text-xs font-bold text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 py-1"
                            >
                                <Trash2 size={12} /> 회원 탈퇴
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── 내 게시글 탭 ─── */}
                {activeTab === 'posts' && (
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                            <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> 내가 쓴 게시글
                            </h2>
                            <span className="text-xs font-bold text-gray-400">{summary?.postCount ?? 0}개</span>
                        </div>
                        {postsLoading ? (
                            <div className="p-6 space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                                <FileText size={36} className="mb-3 opacity-40" />
                                <p className="text-sm font-bold">작성한 게시글이 없습니다.</p>
                            </div>
                        ) : (
                            <>
                                {/* 테이블 헤더 */}
                                <div className="hidden sm:grid grid-cols-[1fr_60px_60px_60px_100px] gap-3 px-6 py-2 bg-gray-50 dark:bg-white/5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    <span>제목</span>
                                    <span className="text-center">조회</span>
                                    <span className="text-center">좋아요</span>
                                    <span className="text-center">댓글</span>
                                    <span className="text-right">작성일</span>
                                </div>
                                <div className="divide-y divide-gray-50 dark:divide-white/5">
                                    {posts.map(post => (
                                        <button
                                            key={post.postId}
                                            onClick={() => navigate(`/community/post/${post.postId}`)}
                                            className="w-full px-6 py-3.5 hover:bg-indigo-50/50 dark:hover:bg-white/5 transition-colors text-left group"
                                        >
                                            <div className="sm:grid sm:grid-cols-[1fr_60px_60px_60px_100px] sm:gap-3 sm:items-center">
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {post.title}
                                                </p>
                                                <div className="flex sm:contents gap-3 mt-1.5 sm:mt-0">
                                                    <span className="flex items-center gap-1 text-xs text-gray-400 sm:justify-center">
                                                        <Eye size={11} />{post.viewCount}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-400 sm:justify-center">
                                                        <Heart size={11} />{post.likeCount}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-400 sm:justify-center">
                                                        <MessageSquare size={11} />{post.commentCount}
                                                    </span>
                                                    <span className="text-xs text-gray-400 sm:text-right">{fmt(post.createdAt)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="px-6 pb-6">
                                    <Pagination current={postPage} total={postTotalPages} onChange={p => setPostPage(p)} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ─── 내 댓글 탭 ─── */}
                {activeTab === 'comments' && (
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                            <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare size={14} /> 내가 쓴 댓글
                            </h2>
                            <span className="text-xs font-bold text-gray-400">{summary?.commentCount ?? 0}개</span>
                        </div>
                        {commentsLoading ? (
                            <div className="p-6 space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                                <MessageSquare size={36} className="mb-3 opacity-40" />
                                <p className="text-sm font-bold">작성한 댓글이 없습니다.</p>
                            </div>
                        ) : (
                            <>
                                {/* 테이블 헤더 */}
                                <div className="hidden sm:grid grid-cols-[220px_1fr_100px] gap-4 px-6 py-2 bg-gray-50 dark:bg-white/5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    <span>원문 게시글</span>
                                    <span>댓글 내용</span>
                                    <span className="text-right">작성일</span>
                                </div>
                                <div className="divide-y divide-gray-50 dark:divide-white/5">
                                    {comments.map(comment => (
                                        <button
                                            key={comment.commentId}
                                            onClick={() => navigate(`/community/post/${comment.postId}`)}
                                            className="w-full px-6 py-3.5 hover:bg-indigo-50/50 dark:hover:bg-white/5 transition-colors text-left group"
                                        >
                                            <div className="sm:grid sm:grid-cols-[220px_1fr_100px] sm:gap-4 sm:items-center">
                                                <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 truncate group-hover:underline">
                                                    {comment.postTitle}
                                                </p>
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate mt-0.5 sm:mt-0">
                                                    {comment.content}
                                                </p>
                                                <span className="text-xs text-gray-400 sm:text-right block mt-0.5 sm:mt-0">{fmt(comment.createdAt)}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="px-6 pb-6">
                                    <Pagination current={commentPage} total={commentTotalPages} onChange={p => setCommentPage(p)} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ─── 차단 관리 탭 ─── */}
                {activeTab === 'blocks' && <BlockedUserList />}

                {/* ─── 스터디 아카이브 탭 ─── */}
                {activeTab === 'archive' && <ArchivedStudyList />}
            </div>

            {/* ══════════ 이름 변경 모달 ══════════ */}
            {showEditName && (
                <ModalOverlay onClose={() => setShowEditName(false)}>
                    <ModalCard title="이름 변경" icon={<Edit3 size={16} className="text-indigo-400" />}>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">새로 사용할 이름을 입력해주세요. 중복된 이름은 사용할 수 없습니다.</p>
                        <input
                            id="new-name-input"
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleNameUpdate()}
                            placeholder="새 이름"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                        {formError && <p className="text-xs text-red-500 mt-2 font-bold">{formError}</p>}
                        <div className="flex gap-2 mt-5">
                            <button onClick={() => setShowEditName(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">취소</button>
                            <button onClick={handleNameUpdate} disabled={formLoading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                                {formLoading ? '변경 중...' : '변경하기'}
                            </button>
                        </div>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* ══════════ 비밀번호 변경 모달 ══════════ */}
            {showEditPw && (
                <ModalOverlay onClose={() => setShowEditPw(false)}>
                    <ModalCard title="비밀번호 변경" icon={<Lock size={16} className="text-amber-400" />}>
                        <p className="text-xs text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-xl px-3 py-2 font-bold mb-4">
                            변경 완료 시 보안을 위해 자동 로그아웃됩니다.
                        </p>
                        {[
                            { id: 'cur-pw', value: currentPw, onChange: setCurrentPw, placeholder: '현재 비밀번호' },
                            { id: 'new-pw', value: newPw, onChange: setNewPw, placeholder: '새 비밀번호' },
                            { id: 'confirm-pw', value: confirmPw, onChange: setConfirmPw, placeholder: '새 비밀번호 확인' },
                        ].map(f => (
                            <input
                                key={f.id}
                                id={f.id}
                                type="password"
                                value={f.value}
                                onChange={e => f.onChange(e.target.value)}
                                placeholder={f.placeholder}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-2 transition-all"
                            />
                        ))}
                        {formError && <p className="text-xs text-red-500 mt-1 font-bold">{formError}</p>}
                        <div className="flex gap-2 mt-5">
                            <button onClick={() => setShowEditPw(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">취소</button>
                            <button onClick={handlePwUpdate} disabled={formLoading} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors disabled:opacity-50">
                                {formLoading ? '변경 중...' : '변경하기'}
                            </button>
                        </div>
                    </ModalCard>
                </ModalOverlay>
            )}

            {/* ══════════ 회원 탈퇴 모달 ══════════ */}
            {showDeleteModal && (
                <ModalOverlay onClose={() => setShowDeleteModal(false)}>
                    <ModalCard title="회원 탈퇴" icon={<Trash2 size={16} className="text-red-400" />}>
                        <div className="text-sm text-gray-500 dark:text-gray-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 mb-4 space-y-1">
                            <p className="font-bold text-red-600 dark:text-red-400">이 작업은 되돌릴 수 없습니다.</p>
                            <p>탈퇴 시 계정 정보는 복구되지 않으며, 작성하신 게시글과 댓글의 작성자는 <span className="font-bold text-gray-700 dark:text-gray-300">탈퇴한 사용자</span>로 표시됩니다.</p>
                        </div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            탈퇴를 확인하려면 아래에 <span className="text-red-500 font-black">회원 탈퇴</span>라고 정확히 입력하세요.
                        </p>
                        <input
                            id="delete-confirm-input"
                            type="text"
                            value={deleteInput}
                            onChange={e => setDeleteInput(e.target.value)}
                            placeholder="회원 탈퇴"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-3 transition-all"
                        />
                        {formError && <p className="text-xs text-red-500 font-bold">{formError}</p>}
                        <div className="flex gap-2 mt-5">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">취소</button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteInput !== '회원 탈퇴' || formLoading}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {formLoading ? '처리 중...' : '탈퇴하기'}
                            </button>
                        </div>
                    </ModalCard>
                </ModalOverlay>
            )}
        </div>
    );
}

// ─────────────── 공통 모달 래퍼 ───────────────
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div onClick={e => e.stopPropagation()} className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>
    );
}

function ModalCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2 mb-5">
                {icon} {title}
            </h3>
            {children}
        </div>
    );
}
