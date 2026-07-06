import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, CheckCircle, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import siteLogo from '../../assets/site-logo.svg';

import { usePageTitle } from '../../hooks/usePageTitle';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated';
import ErrorMessageBlock from './componets/ErrorMessageBlock';
import AuthInput from './componets/AuthInput';
import { API_BASE_URL } from '../../app/apiClient';
import { toast } from '../../utils/toast';
import { useSignupStore } from '../../store/useSignupStore';

export default function EmailVerifyPage() {
  useRedirectIfAuthenticated(); // 로그인 했으면 '/' 로 이동
  const navigate = useNavigate();
  usePageTitle("learn-time | 이메일 인증");

  // Zustand 스토어에서 사용자 정보 불러오기
  const { email, userName, password, termsAgreements, reset } = useSignupStore();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyError, setVerifyError] = useState<string>('');
  
  const isSuccessRef = useRef(false);

  // 스토어에 데이터가 없으면 다시 회원가입 폼으로 돌려보냄
  useEffect(() => {
    if (isSuccessRef.current) return;
    if (!email || !userName || !password) {
      toast.error('회원가입 정보가 유실되었습니다. 다시 진행해주세요.');
      navigate('/signup', { replace: true });
    }
  }, [email, userName, password, navigate]);

  // 코드 재발송 핸들러
  const handleResendCode = async () => {
    if (resending) return;
    setResending(true);
    setVerifyError('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/email-verifications`, { email });
      toast.success('인증 코드가 재발송되었습니다.');
    } catch (error) {
      setVerifyError(getApiErrorUtil(error) || '인증 코드 재발송에 실패했습니다.');
    } finally {
      setResending(false);
    }
  };

  // 폼 제출 핸들러
  const handleVerify = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== 6) {
      setVerifyError('6자리 인증 코드를 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setVerifyError('');

    try {
      // 1. 이메일 인증 확인 요청
      const verifyRes = await axios.post(`${API_BASE_URL}/api/auth/email-verifications/verify`, {
        email,
        code
      });
      
      const verificationToken = verifyRes.data.verificationToken;

      try {
        // 2. 이메일 인증 성공 시 바로 회원가입 진행
        await axios.post(`${API_BASE_URL}/api/auth/signup`, {
          userName,
          email,
          password,
          emailVerificationToken: verificationToken,
          termsAgreements
        });

        toast.success("회원 가입이 완료되었습니다!");
        isSuccessRef.current = true;
        reset(); // 스토어 초기화
        navigate("/login", { replace: true });
      } catch (signupError) {
        // 회원가입 실패 시 (예: 닉네임 중복 등)
        toast.error(getApiErrorUtil(signupError) || '가입에 실패했습니다. 정보를 수정해주세요.');
        useSignupStore.getState().setSignupData({ emailVerificationToken: verificationToken });
        navigate('/signup', { replace: true });
      }
    } catch (verifyError) {
      setVerifyError(getApiErrorUtil(verifyError) || '인증 코드 확인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-[#050505] dark:via-[#0a0a0a] dark:to-[#050505] flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        
        {/* 상단 헤더 섹션 */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-transparent rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-white/10 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img src={siteLogo} className="w-7.5 h-7.5 dark:invert" alt="Logo" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight [word-spacing:-0.15em] text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">Learn Time</h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            이메일 인증 <CheckCircle className="text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-keep">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{email}</span>(으)로 6자리 인증 코드를 발송했습니다. 코드를 확인해주세요.
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm rounded-4xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/40 dark:border-white/10 relative">
          
          <button 
            type="button" 
            onClick={() => navigate('/signup')} 
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="뒤로 가기"
          >
            <ArrowLeft size={20} />
          </button>

          <form className="space-y-4 sm:space-y-5 mt-4" onSubmit={handleVerify}>
            
            {/* 인증 코드 입력 섹션 */}
            <AuthInput
              label="인증 코드"
              icon={<Mail size={14} className="text-indigo-400" />}
              name="code"
              type="text"
              value={code}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 6) setCode(val);
              } }
              placeholder="6자리 숫자 입력"
              maxLength={6} isValid={false}            />

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleResendCode}
                disabled={resending}
                className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold disabled:opacity-50"
              >
                {resending ? '재발송 중...' : '인증 코드 재발송'}
              </button>
            </div>

            {/* 에러 메시지 */}
            {verifyError && (
              <ErrorMessageBlock message={verifyError} />
            )}

            {/* 제출 버튼 */}
            <button 
              type="submit" 
              disabled={code.length !== 6 || loading} 
              className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 text-sm sm:text-base ${(code.length === 6 && !loading) ? 'bg-linear-to-r from-emerald-500 to-teal-500 hover:scale-[1.01] hover:shadow-emerald-200 active:scale-[0.99]' : 'bg-gray-200 dark:bg-[#222] text-gray-400 cursor-not-allowed'}`}
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20}/> : '인증하고 가입하기'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
