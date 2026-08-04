import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGoogleLogin } from '@react-oauth/google';
import { socialLoginApi } from './api/socialAuthApi';
import { useAuthStore } from '../../store/useAuthStore';
import { useSocialSignupStore } from '../../store/useSocialSignupStore';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import { toast } from '../../utils/toast';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

interface SocialLoginButtonsProps {
  isDark?: boolean;
}

export default function SocialLogin({ isDark = false }: SocialLoginButtonsProps) {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setSocialAuthData = useSocialSignupStore((state) => state.setSocialAuthData);

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await socialLoginApi({
        provider: 'GOOGLE',
        token,
      });

      if (response.isRegistered && response.accessToken) {
        // 기존 가입된 사용자 -> 로그인 성공
        setAccessToken(response.accessToken);
        localStorage.setItem('login_hint', 'true');
        toast.success('구글 계정으로 로그인되었습니다.');
        navigate('/');
      } else {
        // 미가입 사용자 -> 소셜 회원가입 정보 저장 후 회원가입 페이지로 이동
        setSocialAuthData(token, 'GOOGLE');
        toast.info('추가 회원가입 정보(닉네임, 약관 동의)를 입력해 주세요.');
        navigate('/signup/social');
      }
    } catch (error) {
      const errorMsg = getApiErrorUtil(error);
      toast.error(errorMsg || '구글 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      if (codeResponse?.access_token) {
        handleGoogleSuccess(codeResponse.access_token);
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login Failed:', errorResponse);
      toast.error('구글 로그인에 실패했습니다.');
    },
  });

  const handleKakaoSuccess = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await socialLoginApi({
        provider: 'KAKAO',
        token,
      });

      if (response.isRegistered && response.accessToken) {
        // 기존 가입된 사용자 -> 로그인 성공
        setAccessToken(response.accessToken);
        localStorage.setItem('login_hint', 'true');
        toast.success('카카오 계정으로 로그인되었습니다.');
        navigate('/');
      } else {
        // 미가입 사용자 -> 소셜 회원가입 정보 저장 후 회원가입 페이지로 이동
        setSocialAuthData(token, 'KAKAO');
        toast.info('추가 회원가입 정보(닉네임, 약관 동의)를 입력해 주세요.');
        navigate('/signup/social');
      }
    } catch (error) {
      const errorMsg = getApiErrorUtil(error);
      toast.error(errorMsg || '카카오 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const initKakaoSDK = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || 'a9769cc494dae144014aa14bdfb5c6d3';
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }
      return true;
    }
    console.warn('Kakao SDK is not loaded on window object.');
    return false;
  };

  const handleKakaoLogin = () => {
    if (!initKakaoSDK()) {
      toast.error('카카오 로그인 서비스를 불러오는 중 오류가 발생했습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj: { access_token: string }) => {
        if (authObj?.access_token) {
          handleKakaoSuccess(authObj.access_token);
        }
      },
      fail: (err: any) => {
        console.error('Kakao Login Failed:', err);
        toast.error('카카오 로그인에 실패했습니다.');
      },
    });
  };

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
        disabled={isLoading}
        onClick={() => loginWithGoogle()}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-medium text-sm transition-all hover:scale-[1.02] hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: '#ffffff',
          color: '#374151',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: isDark ? 'none' : '1px solid #e5e7eb',
        }}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Google로 계속하기
      </button>

      {/* ── Kakao ── */}
      <button
        type="button"
        disabled={isLoading}
        onClick={handleKakaoLogin}
        aria-label="카카오 계정으로 계속하기"
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-medium text-sm transition-all hover:scale-[1.02] hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: '#FEE500',
          color: '#191919',
          boxShadow: '0 4px 16px rgba(254,229,0,0.35)',
        }}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#191919">
            <path d="M12 3C6.477 3 2 6.477 2 10.771c0 2.766 1.83 5.197 4.613 6.554l-1.171 4.3c-.104.382.285.71.627.505l5.067-3.042c.287.025.577.039.864.039 5.523 0 10-3.477 10-7.771C22 6.477 17.523 3 12 3z" />
          </svg>
        )}
        카카오로 계속하기
      </button>
    </div>
  );
}

