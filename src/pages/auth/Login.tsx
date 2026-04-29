import { useState, useTransition } from 'react';
import { useNavigate, Link } from 'react-router'; 
import { usePageTitle } from '../../hooks/usePageTitle.ts';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated.ts';
import { axiosInstance } from '../../app/apiClient.ts';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil.ts';
import SocialLogin from './SocialLogin.tsx';
import ErrorMessageBlock from './componets/ErrorMessageBlock.tsx';


export default function LoginPage() {
  useRedirectIfAuthenticated(); // 로그인 했으면 '/' 로 이동
  const navigate = useNavigate();

  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');

  // 폼 데이터 및 상태 통합 관리
  const [ showPassword, setShowPassword ] = useState<boolean>(false);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  const [ loginError, setLoginError ] = useState<string>('');
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  
  const [ isPending, startTransition ] = useTransition();

  // 페이지 제목 변경
  usePageTitle("learn-time | 로그인");

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      const { accessToken } = response.data; // 응답 Body에서 Access Token 추출 후 Zustand 메모리 스토어에 저장
      
      startTransition(() => {
        setAccessToken(accessToken);
        localStorage.setItem('login_hint', 'true');
        navigate('/'); // 임시 링크, 수정 가능 
      });
      
    } catch (error: unknown) {
      const errorMessage = getApiErrorUtil(error);
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 공통 입력창 스타일
  const inputStyle = `
    appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 
    focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base
  `;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        
        {/* 헤더 섹션 */}
        <div className="text-center">
          <Link to="/" className="inline-block group">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Learn-Time
            </h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">다시 시작해볼까요?</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline">
              회원가입하기
            </Link>
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-4xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/20">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
            
            {/* 이메일 입력 */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="user-email" className="block text-xs sm:text-sm font-semibold text-gray-700 ml-1">이메일</label>
              <input
                id="user-email" name="email" type="email" required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className={inputStyle}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 ml-1">비밀번호</label>
              <div className="relative">
                <input
                  id="password" name="password" required
                  type={showPassword ? 'text' : 'password'}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 부가 기능 (미구현) */}
            {/* <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 transition-colors">로그인 유지</span>
              </label>
              <a href="#" className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-500">비밀번호 찾기</a>
            </div> */}

            {/* 에러 메시지 */}
            {loginError && (
              <ErrorMessageBlock message={loginError} />
            )}

            {/* 로그인 실행 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full flex justify-center items-center gap-2 py-3.5 sm:py-4 rounded-2xl shadow-lg font-bold text-white transition-all text-sm sm:text-base
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] hover:shadow-indigo-200'}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  로그인 중...
                </>
              ) : '로그인'}
            </button>
          </form>

          {/* 소셜 로그인 구분선 */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          </div>

          <SocialLogin isDark={false} />
        </div>

      </div>
    </div>
  );
}