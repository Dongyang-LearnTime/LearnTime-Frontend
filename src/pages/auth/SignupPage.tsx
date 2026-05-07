import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, User, Lock, Check, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

import { usePageTitle } from '../../hooks/usePageTitle';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated';
import TermsAgreementSection from './componets/TermsAgreementSection';
import ErrorMessageBlock from './componets/ErrorMessageBlock';
import AuthInput from './componets/AuthInput';

import type { Terms } from '../../types/userEnums';

// 유효성 검사 정규식 설정
const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PW: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])(?!.*(.)\1\1).{8,30}$/,
  NAME: /^[a-zA-Z0-9가-힣]{2,15}$/
};

export default function SignupPage() {
  useRedirectIfAuthenticated(); // 로그인 했으면 '/' 로 이동
  const navigate = useNavigate();

  const [ formData, setFormData ] = useState({ email: '', userName: '', password: '', confirm: '' });
  const [ termsAgreements, setTermsAgreements ] = useState<Record<Terms, boolean>>({
    SERVICE_USE: false,
    PRIVACY_POLICY: false,
    BODY_DATA_COLLECT: false,
  });

  const [ signupError, setSignupError ] = useState<string>('');

  const [ loading, setLoading ] = useState(false);
  const [ shows, setShows ] = useState({ pw: false, confirm: false });
  const [ isCapsLockOn, setIsCapsLockOn ] = useState<boolean>(false); // CapsLock 켜짐 여부
  
  const [ duplicateChecks, setDuplicateChecks ] = useState({ email: false, userName: false });
  const [ isChecking, setIsChecking ] = useState({ email: false, userName: false });
  const [ fieldErrors, setFieldErrors ] = useState({ email: '', userName: '' });

  const { email, userName, password, confirm } = formData;

  // 페이지 제목 변경
  usePageTitle("learn-time | 회원가입");

  const validity = {
    email: REGEX.EMAIL.test(email),
    name: REGEX.NAME.test(userName),
    pw: REGEX.PW.test(password),
    match: password !== '' && password === confirm
  };

  // 실시간 비밀번호 강도 체크리스트 연산
  const pwChecks = {
    length: password.length >= 8 && password.length <= 30,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
    special: /[\W_]/.test(password),
    consecutive: password.length > 0 && !(/(.)\1\1/.test(password))
  };

  // 폼 제출 가능 여부 판단 (모든 파생 유효성 조건 충족 및 중복 체크 완료 시 true)
  const isFormValid = !!(
    validity.email && 
    validity.name && 
    validity.pw && 
    validity.match && 
    duplicateChecks.email && 
    duplicateChecks.userName
  );

  // 폼 제출 핸들러
  const handleSignUp = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // 약관 동의 여부
    const isRequiredTermsAgreed = termsAgreements.SERVICE_USE && termsAgreements.PRIVACY_POLICY;

    if (!isRequiredTermsAgreed) {
      setSignupError("필수 약관에 동의해야 가입이 가능합니다.");
      setLoading(false);
      return;
    }

    try {
      // 프론트엔드 유효성 검사는 UX 개선용이며, 반드시 백엔드(Spring) 계층에서 최종 검증 필요
      await axios.post('http://localhost:8080/api/auth/signup', {
        userName : userName.trim(),
        email,
        password,
        termsAgreements
      });
      alert("회원 가입 성공");
      navigate("/login");
    } catch (error) {
      const errorMessage = getApiErrorUtil(error);
      setSignupError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setDuplicateChecks(prev => ({ ...prev, email: false }));
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
    if (name === 'userName') {
      setDuplicateChecks(prev => ({ ...prev, userName: false }));
      setFieldErrors(prev => ({ ...prev, userName: '' }));
    }
  };

  // 이메일 중복 체크
  const handleCheckEmail = async () => {
    if (!validity.email) return;
    setIsChecking(prev => ({ ...prev, email: true }));
    setFieldErrors(prev => ({ ...prev, email: '' }));
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/email/${email}`);
      
      if (response.data === false) {
        setFieldErrors(prev => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
      } else {
        setDuplicateChecks(prev => ({ ...prev, email: true }));
      }
    } catch (error) {
      setFieldErrors(prev => ({ ...prev, email: getApiErrorUtil(error) || "이미 사용 중인 이메일입니다." }));
    } finally {
      setIsChecking(prev => ({ ...prev, email: false }));
    }
  };

  // 닉네임 중복 체크
  const handleCheckUserName = async () => {
    if (!validity.name) return;
    setIsChecking(prev => ({ ...prev, userName: true }));
    setFieldErrors(prev => ({ ...prev, userName: '' }));
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/name/${userName.trim()}`);
      
      if (response.data === false) {
        setFieldErrors(prev => ({ ...prev, userName: "이미 사용 중인 닉네임입니다." }));
      } else {
        setDuplicateChecks(prev => ({ ...prev, userName: true }));
      }
    } catch (error) {
      setFieldErrors(prev => ({ ...prev, userName: getApiErrorUtil(error) || "이미 사용 중인 닉네임입니다." }));
    } finally {
      setIsChecking(prev => ({ ...prev, userName: false }));
    }
  };

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  // 비밀번호 입력창 포커스 이탈 시 CapsLock 경고 숨김
  const resetCapsLock = () => setIsCapsLockOn(false);



  const getPasswordInputClass = () => `
    flex-1 pl-4 py-3
    bg-transparent outline-none
    text-sm sm:text-base
  `;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        
        {/* 상단 헤더 섹션 */}
        <div className="text-center">
          <Link to="/" className="inline-block group">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">Learn-Time</h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
            회원가입 <Sparkles className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">이미 계정이 있으신가요? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">로그인하기</Link></p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-4xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/40">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSignUp}>
            
            {/* 1. 이메일 입력 섹션 */}
            <AuthInput
              label="이메일"
              icon={<Mail size={14} className="text-indigo-400"/>}
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="example@email.com"
              isValid={validity.email}
              onCheckDuplicate={handleCheckEmail}
              isChecking={isChecking.email}
              isChecked={duplicateChecks.email}
              checkDisabled={!validity.email}
              hasError={!!fieldErrors.email}
              errorMessage={fieldErrors.email}
            />

            {/* 2. 닉네임 입력 섹션 */}
            <AuthInput
              label="닉네임"
              icon={<User size={14} className="text-indigo-400"/>}
              name="userName"
              type="text"
              value={userName}
              onChange={handleChange}
              placeholder="2-25자 한글/영문/숫자"
              minLength={2}
              maxLength={25}
              isValid={validity.name}
              onCheckDuplicate={handleCheckUserName}
              isChecking={isChecking.userName}
              isChecked={duplicateChecks.userName}
              checkDisabled={!validity.name}
              hasError={!!fieldErrors.userName}
              errorMessage={fieldErrors.userName}
            />

            {/* 3. 비밀번호 입력 섹션 및 체크리스트 */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
                <Lock size={14} className="text-indigo-400"/> 비밀번호
              </label>

              <div className={`
                flex items-center
                border-2 rounded-xl
                transition-all duration-300
                focus-within:ring-4 text-sm sm:text-base
                ${validity.pw 
                  ? 'border-blue-500 focus-within:ring-blue-100'
                  : 'border-gray-200 focus-within:border-indigo-500 focus-within:ring-indigo-100'}
              `}>
                
                <input
                  name="password"
                  type={shows.pw ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  onBlur={resetCapsLock}
                  className={getPasswordInputClass()}
                  placeholder="강력한 암호를 설정하세요"
                />

                <button
                  type="button"
                  onClick={() => setShows(s => ({ ...s, pw: !s.pw }))}
                  className="px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {shows.pw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {/* 체크리스트 */}
              {password && !validity.pw && (
                <div className="mt-3 p-3 sm:p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/50">
                  <p className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2.5 ml-0.5">
                    보안 요구사항
                  </p>

                  <ul className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-2">
                    {[
                      { label: '8~30자 이내', met: pwChecks.length },
                      { label: '영문 포함', met: pwChecks.letter },
                      { label: '숫자 포함', met: pwChecks.number },
                      { label: '특수문자 포함', met: pwChecks.special },
                      { label: '연속 3자리 금지', met: pwChecks.consecutive }
                    ].map((check, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold transition-colors duration-300 
                          ${check.met ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        <div className={`rounded-full flex items-center justify-center transition-all 
                          ${check.met ? 'bg-blue-100' : 'bg-gray-100'} w-3 h-3 sm:w-3.5 sm:h-3.5`}>
                          <Check
                            strokeWidth={4}
                            className={`${check.met ? 'text-blue-600' : 'text-gray-300'} w-2 sm:w-2.5 h-2 sm:h-2.5`}
                          />
                        </div>
                        {check.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>


            {/* 4. 비밀번호 확인 섹션 */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                비밀번호 확인
              </label>

              <div className={`
                flex items-center
                border-2 rounded-xl
                transition-all duration-300
                focus-within:ring-4 text-sm sm:text-base
                ${validity.match 
                  ? 'border-blue-500 focus-within:ring-blue-100'
                  : 'border-gray-200 focus-within:border-indigo-500 focus-within:ring-indigo-100'}
              `}>
                
                <input
                  name="confirm"
                  type={shows.confirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={handleChange}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  onBlur={resetCapsLock}
                  className={getPasswordInputClass()}
                  placeholder="다시 입력해 주세요"
                />

                <button
                  type="button"
                  onClick={() => setShows(s => ({ ...s, confirm: !s.confirm }))}
                  className="px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {shows.confirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {confirm && validity.match && (
                <p className="text-[10px] sm:text-[11px] font-bold ml-1 mt-1 text-blue-600">
                  ✓ 비밀번호가 일치합니다.
                </p>
              )}
            </div>

            {/* 약관 창 */}
            <TermsAgreementSection
              termsAgreements={termsAgreements}
              onChange={(term, checked) => {
                setTermsAgreements(prev => ({
                  ...prev,
                  [term]: checked
                }));
              }}
            />

            {/* 에러 메시지 (LoginPage와 동일하게 버튼 위에 배치) */}
            {(signupError || isCapsLockOn) && (
              <div className="space-y-2">
                {signupError && (
                  <ErrorMessageBlock message={signupError} />
                )}
                {isCapsLockOn && (
                  <ErrorMessageBlock message="Caps Lock이 켜져 있습니다." />
                )}
              </div>
            )}

            {/* 제출 버튼 */}
            <button type="submit" disabled={!isFormValid || loading} className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 text-sm sm:text-base ${isFormValid && !loading ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] hover:shadow-blue-200 active:scale-[0.99]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {loading ? <Loader2 className="animate-spin mx-auto" size={20}/> : 'Learn-Time 시작하기'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}