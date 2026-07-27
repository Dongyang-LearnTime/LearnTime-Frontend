import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { KeyRound, Mail, CheckCircle, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck, Check, X } from 'lucide-react';
import siteLogo from '../../assets/site-logo.svg';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated';
import { getApiErrorUtil } from '../../utils/getApiErrorUtil';
import ErrorMessageBlock from './componets/ErrorMessageBlock';
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from './api/passwordResetApi';
import { toast } from '../../utils/toast';

type Step = 'REQUEST' | 'VERIFY' | 'CONFIRM' | 'SUCCESS';

export default function PasswordResetPage() {
  useRedirectIfAuthenticated(); // 로그인되어 있다면 홈으로 이동
  const navigate = useNavigate();
  usePageTitle('learn-time | 비밀번호 재설정');

  // Step 관리
  const [step, setStep] = useState<Step>('REQUEST');

  // 폼 입력 필드
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // 타이머 (인증코드 만료 10분 = 600초)
  const [timer, setTimer] = useState<number>(600);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  // 비밀번호 유효성 검사 규칙
  const passwordRules = [
    { label: '8~30자 이내', pass: newPassword.length >= 8 && newPassword.length <= 30 },
    { label: '영문자 포함', pass: /[A-Za-z]/.test(newPassword) },
    { label: '숫자 포함', pass: /\d/.test(newPassword) },
    { label: '특수문자 포함', pass: /[\W_]/.test(newPassword) },
    { label: '동일 문자 3회 연속 사용 불가', pass: newPassword.length > 0 && !/(.)\1\1/.test(newPassword) },
    { label: '비밀번호 일치', pass: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  const isPasswordValid = passwordRules.every((r) => r.pass);

  // Step 1: 인증 코드 발송 요청
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('이메일을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await sendPasswordResetCode(email.trim());
      toast.success('비밀번호 재설정 인증 코드가 이메일로 발송되었습니다.');
      setTimer(600);
      setTimerActive(true);
      setStep('VERIFY');
    } catch (error) {
      setErrorMessage(getApiErrorUtil(error) || '인증 코드 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 코드 재발송
  const handleResendCode = async () => {
    if (resending) return;
    setResending(true);
    setErrorMessage('');

    try {
      await sendPasswordResetCode(email.trim());
      toast.success('인증 코드가 재발송되었습니다.');
      setTimer(600);
      setTimerActive(true);
    } catch (error) {
      setErrorMessage(getApiErrorUtil(error) || '인증 코드 재발송에 실패했습니다.');
    } finally {
      setResending(false);
    }
  };

  // Step 2: 인증 코드 확인
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMessage('6자리 인증 코드를 입력해 주세요.');
      return;
    }

    if (timer === 0) {
      setErrorMessage('인증 시간이 만료되었습니다. 인증 코드를 재발송해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await verifyPasswordResetCode(email.trim(), code.trim());
      setResetToken(res.resetToken);
      toast.success('이메일 인증이 완료되었습니다. 새 비밀번호를 입력해 주세요.');
      setStep('CONFIRM');
    } catch (error) {
      setErrorMessage(getApiErrorUtil(error) || '인증 코드 확인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: 새 비밀번호 최종 변경
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMessage('비밀번호 조건이 올바르지 않습니다.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await confirmPasswordReset({
        email: email.trim(),
        resetToken,
        newPassword,
      });
      toast.success('비밀번호가 성공적으로 변경되었습니다!');
      setStep('SUCCESS');
    } catch (error) {
      setErrorMessage(getApiErrorUtil(error) || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `
    appearance-none block w-full px-4 py-3 border-2 border-gray-200 dark:border-[#333] rounded-xl bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50
    focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base
  `;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-[#050505] dark:via-[#0a0a0a] dark:to-[#050505] flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* 상단 브랜드 헤더 */}
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
            비밀번호 재설정 <KeyRound className="text-indigo-500 w-6 h-6" />
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-keep">
            {step === 'REQUEST' && '가입 시 사용한 이메일 주소를 입력해 주세요.'}
            {step === 'VERIFY' && '이메일로 발송된 6자리 인증 코드를 입력해 주세요.'}
            {step === 'CONFIRM' && '새로 사용할 비밀번호를 설정해 주세요.'}
            {step === 'SUCCESS' && '비밀번호 변경이 완료되었습니다.'}
          </p>
        </div>

        {/* 메인 폼 카드 */}
        <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm rounded-4xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/40 dark:border-white/10 relative">
          {/* 뒤로 가기 버튼 */}
          {step !== 'SUCCESS' && (
            <button
              type="button"
              onClick={() => {
                if (step === 'VERIFY') setStep('REQUEST');
                else if (step === 'CONFIRM') setStep('VERIFY');
                else navigate('/login');
              }}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#222]"
              title="뒤로 가기"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* STEP 1: 이메일 입력 및 코드 발송 */}
          {step === 'REQUEST' && (
            <form className="space-y-5 mt-2" onSubmit={handleSendCode}>
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="reset-email" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-1.5">
                  <Mail size={16} className="text-indigo-500" /> 이메일 주소
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={inputStyle}
                />
              </div>

              {errorMessage && <ErrorMessageBlock message={errorMessage} />}

              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
                  loading || !email
                    ? 'bg-gray-300 dark:bg-[#222] text-gray-500 cursor-not-allowed'
                    : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] hover:shadow-indigo-200'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : '인증 코드 발송'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  로그인 화면으로 돌아가기
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: 인증 코드 확인 */}
          {step === 'VERIFY' && (
            <form className="space-y-5 mt-2" onSubmit={handleVerifyCode}>
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 flex justify-between items-center">
                <span className="truncate font-medium">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('REQUEST')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2"
                >
                  변경
                </button>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="verify-code" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                    인증 코드 6자리
                  </label>
                  <span className={`text-xs font-bold ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    남은 시간 {formatTimer(timer)}
                  </span>
                </div>
                <input
                  id="verify-code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length <= 6) setCode(val);
                  }}
                  placeholder="6자리 숫자 입력"
                  className={`${inputStyle} text-center tracking-widest text-lg font-mono`}
                />
              </div>

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

              {errorMessage && <ErrorMessageBlock message={errorMessage} />}

              <button
                type="submit"
                disabled={loading || code.length !== 6 || timer === 0}
                className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
                  loading || code.length !== 6 || timer === 0
                    ? 'bg-gray-300 dark:bg-[#222] text-gray-500 cursor-not-allowed'
                    : 'bg-linear-to-r from-emerald-500 to-teal-500 hover:scale-[1.01] active:scale-[0.99] hover:shadow-emerald-200'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : '인증 완료'}
              </button>
            </form>
          )}

          {/* STEP 3: 새 비밀번호 설정 */}
          {step === 'CONFIRM' && (
            <form className="space-y-4 mt-2" onSubmit={handleConfirmReset}>
              {/* 새 비밀번호 입력 */}
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    placeholder="새 비밀번호 입력"
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

              {/* 새 비밀번호 확인 */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    placeholder="새 비밀번호 다시 입력"
                    className={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* 비밀번호 유효성 검사 요구조건 가이드 */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-200/80 dark:border-[#333] space-y-1.5">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-indigo-500" /> 비밀번호 보안 조건
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {passwordRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        rule.pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {rule.pass ? <Check size={13} className="shrink-0" /> : <X size={13} className="shrink-0" />}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(errorMessage || isCapsLockOn) && (
                <div className="space-y-2">
                  {errorMessage && <ErrorMessageBlock message={errorMessage} />}
                  {isCapsLockOn && <ErrorMessageBlock message="Caps Lock이 켜져 있습니다." />}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
                  loading || !isPasswordValid
                    ? 'bg-gray-300 dark:bg-[#222] text-gray-500 cursor-not-allowed'
                    : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] hover:shadow-indigo-200'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : '비밀번호 변경하기'}
              </button>
            </form>
          )}

          {/* STEP 4: 성공 화면 */}
          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">비밀번호 변경 완료</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-keep">
                  비밀번호가 성공적으로 변경되었습니다.<br />
                  새로운 비밀번호로 로그인해 주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] shadow-lg transition-all text-sm sm:text-base"
              >
                로그인하러 가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
