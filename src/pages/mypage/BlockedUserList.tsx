import { useState, useEffect } from 'react';
import { getMyBlockedUsers, unblockUserApi, type MyBlockedUserListResponse } from '../../api/userApi';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import Avatar from '../../components/common/Avatar';
import { UserX } from 'lucide-react';

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

export default function BlockedUserList() {
    const [blocks, setBlocks] = useState<MyBlockedUserListResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchBlocks = async () => {
        setLoading(true);
        try {
            const data = await getMyBlockedUsers(page, 10);
            setBlocks(data.content);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalElements);
        } catch (err) {
            console.error("차단 목록 조회 실패", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, [page]);

    const handleUnblock = async (blockedId: number, name: string) => {
        if (!window.confirm(`${name} 님의 차단을 해제하시겠습니까?`)) return;
        try {
            await unblockUserApi(blockedId);
            alert(`${name} 님의 차단이 해제되었습니다.`);
            fetchBlocks(); // 리스트 갱신
        } catch (err) {
            alert(getApiErrorUtil(err) || "차단 해제에 실패했습니다.");
        }
    };

    return (
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-3 flex items-center justify-between border-b border-gray-50 dark:border-white/5">
                <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <UserX size={14} /> 차단 관리
                </h2>
                <span className="text-xs font-bold text-gray-400">{totalCount}명</span>
            </div>
            
            {loading ? (
                <div className="p-6 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                    <UserX size={36} className="mb-3 opacity-40" />
                    <p className="text-sm font-bold">차단한 사용자가 없습니다.</p>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                        {blocks.map(user => (
                            <div key={user.blockedId} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar src={user.profileImageUrl} alt={user.name} className="w-10 h-10" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                            {user.name}
                                            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                                {user.tierName}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{fmt(user.blockedAt)} 차단됨</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUnblock(user.blockedId, user.name)}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                                >
                                    차단 해제
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 pb-6">
                        <Pagination current={page} total={totalPages} onChange={p => setPage(p)} />
                    </div>
                </>
            )}
        </div>
    );
}
