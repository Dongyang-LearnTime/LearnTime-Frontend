import { useEffect, useState } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { getSiteStats } from './api/adminApi';
import type { SiteStatsResponse } from './types/adminTypes';
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  usePageTitle('관리자 대시보드');
  const [stats, setStats] = useState<SiteStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteStats()
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const StatCard = ({ title, total = 0, today = 0, icon, colorClass }: { title: string, total?: number, today?: number, icon: React.ReactNode, colorClass: string }) => (
    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-black text-gray-900 dark:text-white">{(total ?? 0).toLocaleString()}</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">전체</span>
      </div>
      <div className="flex items-center gap-1 mt-3 text-sm font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
        <TrendingUp size={14} />
        <span>오늘 +{(today ?? 0).toLocaleString()}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">대시보드</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">사이트 전체 현황을 한눈에 파악하세요.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="총 가입자 수" 
            total={stats.totalUsers} 
            today={stats.newUsersToday} 
            icon={<Users size={20} className="text-indigo-500" />}
            colorClass="bg-indigo-500"
          />
          <StatCard 
            title="총 게시글 수" 
            total={stats.totalPosts} 
            today={stats.newPostsToday} 
            icon={<FileText size={20} className="text-emerald-500" />}
            colorClass="bg-emerald-500"
          />
          <StatCard 
            title="총 댓글 수" 
            total={stats.totalComments} 
            today={stats.newCommentsToday} 
            icon={<MessageSquare size={20} className="text-amber-500" />}
            colorClass="bg-amber-500"
          />
        </div>
      ) : (
        <div className="p-10 text-center text-gray-500">통계 데이터를 불러오지 못했습니다.</div>
      )}
    </div>
  );
}
