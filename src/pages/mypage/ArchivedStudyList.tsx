import { useState, useEffect } from 'react';
import { getMyArchivedStudiesApi } from '../study/api/studyApi';
import type { StudyArchiveResponse } from '../study/api/studyApi';
import { useNavigate } from 'react-router-dom';
import { Archive, Users, History } from 'lucide-react';

// ─────────────── 날짜 포맷 헬퍼 ───────────────
const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function ArchivedStudyList() {
    const [studies, setStudies] = useState<StudyArchiveResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchStudies = async () => {
        setLoading(true);
        try {
            const data = await getMyArchivedStudiesApi();
            setStudies(data);
        } catch (err) {
            console.error("아카이브 조회 실패", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudies();
    }, []);

    // 탈퇴한 스터디(WITHDRAWN)와 참여 중인 스터디 분리 렌더링도 가능하지만 요구사항상 모두 보여주고 뱃지로 구분
    return (
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-3 flex items-center justify-between border-b border-gray-50 dark:border-white/5">
                <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Archive size={14} /> 스터디 아카이브
                </h2>
                <span className="text-xs font-bold text-gray-400">{studies.length}개</span>
            </div>
            
            {loading ? (
                <div className="p-6 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : studies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                    <History size={36} className="mb-3 opacity-40" />
                    <p className="text-sm font-bold">참여했던 스터디 기록이 없습니다.</p>
                </div>
            ) : (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {studies.map(study => (
                        <button
                            key={study.studyId}
                            onClick={() => navigate(`/study/${study.studyId}`)}
                            className="text-left w-full flex flex-col p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-sm transition-all group"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-widest uppercase ${
                                    study.status === 'WITHDRAWN' 
                                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                }`}>
                                    {study.status === 'WITHDRAWN' ? '탈퇴함' : '활동 중'}
                                </span>
                                {study.role === 'OWNER' && (
                                    <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                                        방장
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                {study.studyTitle}
                            </h3>
                            <p className="text-xs font-bold text-gray-400 mt-auto pt-2 flex items-center gap-1">
                                <Users size={12} /> {fmt(study.joinedAt)} 가입
                            </p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
