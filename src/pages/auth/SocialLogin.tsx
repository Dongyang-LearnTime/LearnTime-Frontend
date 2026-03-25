// ── SocialLoginButtons.tsx ───────────────────────────────────────────────────
// 랜딩 페이지(AuthButtons)와 로그인 페이지(LoginPage) 양쪽에서 공용으로 사용하는
// 소셜 로그인 버튼 컴포넌트

interface SocialLoginButtonsProps {
  isDark?: boolean;
}

export function SocialLogin({ isDark = false }: SocialLoginButtonsProps) {
  const divider = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const dividerText = isDark ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const dividerTextBg = isDark ? 'transparent' : '#ffffff';

  return (
    <div className="w-full space-y-3">
      {/* ── 구분선 ── */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: divider }} />
        <span
          className="text-xs font-medium px-2"
          style={{ color: dividerText, background: dividerTextBg }}>
          또는 소셜 계정으로
        </span>
        <div className="flex-1 h-px" style={{ background: divider }} />
      </div>

      {/* ── Google ── */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-medium text-sm transition-all hover:scale-[1.02] hover:brightness-95"
        style={{
          background: '#ffffff',
          color: '#374151',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: isDark ? 'none' : '1px solid #e5e7eb',
        }}>
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Google로 계속하기
      </button>

      {/* ── Naver ── */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-medium text-sm transition-all hover:scale-[1.02] hover:brightness-110"
        style={{
          background: '#03C75A',
          color: '#ffffff',
          boxShadow: '0 4px 16px rgba(3,199,90,0.3)',
        }}>
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="white">
          <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
        </svg>
        네이버로 계속하기
      </button>
    </div>
  );
}