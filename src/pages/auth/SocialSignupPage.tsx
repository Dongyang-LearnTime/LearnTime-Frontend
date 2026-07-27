import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, Loader2, Sparkles } from 'lucide-react';
import siteLogo from '../../assets/site-logo.svg';

import { usePageTitle } from '../../hooks/usePageTitle';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import { useAuthStore } from '../../store/useAuthStore';
import { useSocialSignupStore } from '../../store/useSocialSignupStore';
import { socialSignUpApi, checkNameApi } from './api/socialAuthApi';
import TermsAgreementSection from './componets/TermsAgreementSection';
import ErrorMessageBlock from './componets/ErrorMessageBlock';
import AuthInput from './componets/AuthInput';
import type { Terms } from '../../types/userEnums';
import { toast } from '../../utils/toast';

const REGEX_NAME = /^[a-zA-Z0-9가-힣]{2,15}$/;

export default function SocialSignupPage() {
  const navigate = useNavigate();
  usePageTitle("learn-time | 소셜 회원가입");

  const { socialToken, provider, clearSocialAuthData } = useSocialSignupStore();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [userName, setUserName] = useState('');
  const [termsAgreements, setTermsAgreements] = useState<Record<Terms, boolean>>({
    SERVICE_USE: false,
    PRIVACY_POLICY: false,
    BODY_DATA_COLLECT: false,
  });

  const [signupError, setSignupError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isCheckedName, setIsCheckedName] = useState(false);
  const [nameError, setNameError] = useState('');

  // 소셜 토큰이 없다면 로그인 페이지로 리다이렉트 (최초 마운트 시 1회만 체크)
  useEffect(() => {
    const { socialToken: token, provider: p } = useSocialSignupStore.getState();
    if (!token || !p) {
      toast.error('소셜 인증 정보가 없습니다. 다시 로그인해 주세요.');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const isNameValid = REGEX_NAME.test(userName);
  const isRequiredTermsAgreed = termsAgreements.SERVICE_USE && termsAgreements.PRIVACY_POLICY;
  const isFormValid = isNameValid && isCheckedName && isRequiredTermsAgreed;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setIsCheckedName(false);
    setNameError('');
  };

  const handleCheckUserName = async () => {
    if (!isNameValid) return;
    setIsCheckingName(true);
    setNameError('');
    try {
      const isAvailable = await checkNameApi(userName.trim());
      if (!isAvailable) {
        setNameError('이미 사용 중인 닉네임입니다.');
        setIsCheckedName(false);
      } else {
        setIsCheckedName(true);
      }
    } catch (error) {
      setNameError(getApiErrorUtil(error) || '닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsCheckedName(false);
    } finally {
      setIsCheckingName(false);
    }
  };

  const handleSocialSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socialToken || !provider) return;

    if (!isRequiredTermsAgreed) {
      setSignupError('필수 약관에 동의해야 가입이 완료됩니다.');
      return;
    }

    setLoading(true);
    setSignupError('');

    try {
      const response = await socialSignUpApi({
        provider,
        token: socialToken,
        userName: userName.trim(),
        termsAgreements,
      });

      setAccessToken(response.accessToken);
      localStorage.setItem('login_hint', 'true');
      clearSocialAuthData();
      toast.success('회원가입 및 로그인이 완료되었습니다!');
      navigate('/', { replace: true });
    } catch (error) {
      const msg = getApiErrorUtil(error);
      setSignupError(msg || '소셜 회원가입 처리 중 오류가 발생했습니다.');
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
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight [word-spacing:-0.15em] text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
              Learn Time
            </h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            추가 정보 입력 <Sparkles className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            구글 계정 인증이 완료되었습니다. 사용할 닉네임과 약관에 동의해 주세요.
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm rounded-4xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/40 dark:border-white/10">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSocialSignUp}>

            {/* 닉네임 입력 섹션 */}
            <AuthInput
              label="닉네임"
              icon={<User size={14} className="text-indigo-400" />}
              name="userName"
              type="text"
              value={userName}
              onChange={handleNameChange}
              placeholder="2-15자 한글/영문/숫자"
              minLength={2}
              maxLength={15}
              isValid={isNameValid}
              onCheckDuplicate={handleCheckUserName}
              isChecking={isCheckingName}
              isChecked={isCheckedName}
              checkDisabled={!isNameValid}
              hasError={!!nameError}
              errorMessage={nameError}
            />

            {/* 약관 동의 */}
            <TermsAgreementSection
              termsAgreements={termsAgreements}
              onChange={(term, checked) => {
                setTermsAgreements((prev) => ({
                  ...prev,
                  [term]: checked,
                }));
              }}
            />

            {/* 에러 메시지 */}
            {signupError && <ErrorMessageBlock message={signupError} />}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 text-sm sm:text-base ${isFormValid && !loading
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] hover:shadow-indigo-200 active:scale-[0.99]'
                  : 'bg-gray-200 dark:bg-[#222] text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : '가입 완료하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
