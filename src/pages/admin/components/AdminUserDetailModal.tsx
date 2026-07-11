import { useState, useEffect } from 'react';
import { getAdminUserDetail, grantAdminRole, forceWithdrawUser, sendEmailToUser } from '../api/adminApi';
import type { AdminUserDetailResponse } from '../types/adminTypes';
import { X, Shield, Mail, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '../../../utils/toast';

interface Props {
  userId: number;
  onClose: () => void;
  onUpdated: () => void;
}

const fmt = (iso: string | null) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function AdminUserDetailModal({ userId, onClose, onUpdated }: Props) {
  const [detail, setDetail] = useState<AdminUserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 이메일 발송 폼 상태
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTitle, setEmailTitle] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    getAdminUserDetail(userId)
      .then(setDetail)
      .catch((err) => {
        console.error(err);
        toast.error('사용자 정보를 불러오지 못했습니다.');
        onClose();
      })
      .finally(() => setLoading(false));
  }, [userId, onClose]);

  const handleGrantAdmin = async () => {
    if (!window.confirm('이 사용자에게 관리자 권한을 부여하시겠습니까?')) return;
    try {
      await grantAdminRole(userId);
      toast.success('관리자 권한이 부여되었습니다.');
      onUpdated();
      onClose();
    } catch (e) {
      toast.error('권한 부여에 실패했습니다.');
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('경고: 이 사용자를 강제 탈퇴시키겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await forceWithdrawUser(userId);
      toast.success('사용자가 강제 탈퇴 처리되었습니다.');
      onUpdated();
      onClose();
    } catch (e) {
      toast.error('탈퇴 처리에 실패했습니다.');
    }
  };

  const handleSendEmail = async () => {
    if (!emailTitle.trim() || !emailContent.trim()) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }
    setSendingEmail(true);
    try {
      await sendEmailToUser(userId, emailTitle, emailContent);
      toast.success('이메일이 성공적으로 발송되었습니다.');
      setShowEmailForm(false);
      setEmailTitle('');
      setEmailContent('');
    } catch (e) {
      toast.error('이메일 발송에 실패했습니다.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-base font-black text-gray-900 dark:text-white">사용자 상세 정보</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl" />
              <div className="h-40 bg-gray-100 dark:bg-white/5 rounded-xl" />
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* 기본 프로필 */}
              <div className="flex items-center gap-4">
                {detail.profileImageUrl ? (
                  <img 
                    src={detail.profileImageUrl} 
                    alt={detail.name} 
                    className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-100 dark:border-white/10"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                      {detail.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {detail.name}
                    {detail.role === 'ROLE_ADMIN' && <Shield size={16} className="text-indigo-500" />}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{detail.email}</p>
                </div>
              </div>

              {/* 상세 스탯 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <p className="text-xs font-bold text-gray-400 uppercase">보유 포인트</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{detail.point} P</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <p className="text-xs font-bold text-gray-400 uppercase">AI 남은 횟수</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{detail.aiRemainingCount}회</p>
                </div>
              </div>

              {/* 세부 정보 리스트 */}
              <div className="space-y-3">
                {[
                  { label: '가입 경로', value: detail.socialProvider === 'LOCAL' ? '일반 (이메일)' : detail.socialProvider },
                  { label: '가입일', value: fmt(detail.createdAt) },
                  { label: '최근 수정일', value: fmt(detail.updatedAt) },
                  { label: '로그인 실패 횟수', value: `${detail.failedAttempts}회` },
                  { 
                    label: '계정 상태', 
                    value: detail.isLocked ? (
                      <span className="flex items-center gap-1 text-red-500"><XCircle size={14} /> 잠금 상태 ({fmt(detail.lockedAt)})</span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={14} /> 정상</span>
                    )
                  },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* 이메일 발송 폼 */}
              {showEmailForm && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                  <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                    <Mail size={16} /> 이메일 직접 발송
                  </h4>
                  <input
                    type="text"
                    placeholder="제목"
                    value={emailTitle}
                    onChange={e => setEmailTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <textarea
                    placeholder="내용을 입력하세요..."
                    value={emailContent}
                    onChange={e => setEmailContent(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-sm mb-3 min-h-25 resize-y focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setShowEmailForm(false)} className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors">취소</button>
                    <button onClick={handleSendEmail} disabled={sendingEmail} className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50">
                      {sendingEmail ? '발송 중...' : '보내기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">데이터가 없습니다.</div>
          )}
        </div>

        {/* Footer Actions */}
        {detail && (
          <div className="p-5 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-2 bg-gray-50 dark:bg-black/20">
            {detail.role !== 'ROLE_ADMIN' && (
              <button onClick={handleGrantAdmin} className="flex-1 min-w-30 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-white/5 transition-all">
                <Shield size={16} /> 관리자 임명
              </button>
            )}
            <button onClick={() => setShowEmailForm(true)} className="flex-1 min-w-30 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-white/5 transition-all">
              <Mail size={16} /> 메일 보내기
            </button>
            <button onClick={handleWithdraw} className="flex-1 min-w-30 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              <Trash2 size={16} /> 강제 탈퇴
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
