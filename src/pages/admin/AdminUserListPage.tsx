import { useState, useEffect } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { getAdminUsers } from './api/adminApi';
import type { AdminUserListResponse } from './types/adminTypes';
import type { Role } from '../../types/userEnums';
import { Search, MoreVertical, Shield } from 'lucide-react';
import AdminUserDetailModal from './components/AdminUserDetailModal';
import { getAuthProviderLabel } from '../../utils/authProviderUtil';

// 오프셋 기반 페이징 UI (MyPage 스타일 차용)
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i);
  const visible = pages.filter(p => p >= current - 2 && p <= current + 2);
  return (
      <div className="flex items-center gap-1 justify-center mt-6">
          <button
              onClick={() => onChange(current - 1)} disabled={current === 0}
              className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
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
              className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
          >→</button>
      </div>
  );
}

const fmt = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function AdminUserListPage() {
  usePageTitle('사용자 관리');
  const [users, setUsers] = useState<AdminUserListResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 검색 및 필터 상태
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');

  // 모달 상태
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    getAdminUsers(page, 15, keyword || undefined, selectedRole ? selectedRole as Role : undefined)
      .then(res => {
        setUsers(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, keyword, selectedRole]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">사용자 관리</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">전체 가입자를 조회하고 관리합니다.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value as Role | ''); setPage(0); }}
            className="px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">모든 권한</option>
            <option value="ROLE_USER">일반 사용자</option>
            <option value="ROLE_ADMIN">관리자</option>
          </select>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="이름 또는 이메일 검색..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">가입 정보</th>
                <th className="px-6 py-4 font-medium">이름</th>
                <th className="px-6 py-4 font-medium">가입 경로</th>
                <th className="px-6 py-4 font-medium text-right">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-8" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-16" /></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400 text-sm font-bold">
                    조건에 맞는 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.userId} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                      {user.userId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{user.email}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{fmt(user.createdAt)} 가입</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</span>
                      {user.role === 'ROLE_ADMIN' && (
                        <span title="관리자"><Shield size={14} className="text-indigo-500" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {getAuthProviderLabel(user.socialProvider)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUserId(user.userId)}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 pb-6">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      {selectedUserId && (
        <AdminUserDetailModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
          onUpdated={fetchUsers}
        />
      )}
    </div>
  );
}
