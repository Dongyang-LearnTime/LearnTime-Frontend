import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, User, Lock, Check, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

// 유효성 검사 정규식 설정
const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PW: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, // 영문, 숫자, 특수문자 포함 8자 이상
  NAME: /^[a-zA-Z0-9가-힣]{2,15}$/ // 2-15자 한글, 영문, 숫자
};

// 가짜 API (중복 체크 및 등록 시뮬레이션)
const mockApi = {
  checkEmail: (email: string) => new Promise(res => setTimeout(() => res(false), 600)),
  checkName: (name: string) => new Promise(res => setTimeout(() => res(false), 600)),
  register: () => new Promise(res => setTimeout(() => res({ success: true }), 1500))
};

export function SignupPage() {
  const navigate = useNavigate();

  // 1. 폼 데이터 통합 상태 관리
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirm: '' });
  
  // 2. 유효성 검사 상태 (TypeScript 에러 방지를 위해 타입 지정)
  const [validity, setValidity] = useState<Record<string, boolean | null>>({ 
    email: null, name: null, pw: null, match: null 
  });
  
  // 3. 중복 확인 상태
  const [duplicates, setDuplicates] = useState<Record<string, boolean | null>>({ 
    email: null, name: null 
  });
  
  // 4. 로딩 및 UI 표시 상태
  const [loading, setLoading] = useState({ email: false, name: false, submit: false });
  const [shows, setShows] = useState({ pw: false, confirm: false }); // 비밀번호 보기/숨기기

  const { email, username, password, confirm } = formData;

  // 비밀번호 강도 체크리스트 실시간 연산
  const pwChecks = {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*#?&]/.test(password)
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Side Effect: 이메일 유효성 및 중복 체크 (Debounce 적용)
  useEffect(() => {
    const checkEmail = async () => {
      const isEValid = REGEX.EMAIL.test(email);
      setValidity(v => ({ ...v, email: isEValid }));
      if (isEValid) {
        setLoading(l => ({ ...l, email: true }));
        const isDup = await mockApi.checkEmail(email) as boolean;
        setDuplicates(d => ({ ...d, email: isDup }));
        setLoading(l => ({ ...l, email: false }));
      }
    };
    const timer = setTimeout(checkEmail, 500); // 0.5초 타이핑 멈추면 실행
    return () => clearTimeout(timer);
  }, [email]);

  // Side Effect: 닉네임 유효성 및 중복 체크
  useEffect(() => {
    const checkName = async () => {
      const isNValid = REGEX.NAME.test(username);
      setValidity(v => ({ ...v, name: isNValid }));
      if (isNValid) {
        setLoading(l => ({ ...l, name: true }));
        const isDup = await mockApi.checkName(username) as boolean;
        setDuplicates(d => ({ ...d, name: isDup }));
        setLoading(l => ({ ...l, name: false }));
      }
    };
    const timer = setTimeout(checkName, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Side Effect: 비밀번호 일치 여부 체크
  useEffect(() => {
    setValidity(v => ({ 
      ...v, 
      pw: REGEX.PW.test(password), 
      match: password !== '' && password === confirm 
    }));
  }, [password, confirm]);

  // 전체 폼 제출 가능 여부 판단
  const isFormValid = !!(validity.email && !duplicates.email && validity.name && !duplicates.name && validity.pw && validity.match);

  // 입력창 동적 스타일 함수
  const getInputClass = (isValid: any, isDup: any) => `
    w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 text-sm sm:text-base
    ${(isValid && !isDup) 
      ? 'border-blue-500 focus:ring-blue-100' // 유효성 통과 시 파란색
      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'} // 기본 상태
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        
        {/* 상단 헤더 섹션 */}
        <div className="text-center">
          <Link to="/" className="inline-block group">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">Learn-Time</h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
            회원가입 <Sparkles className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">이미 계정이 있으신가요? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">로그인하기</Link></p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/40">
          <form className="space-y-4 sm:space-y-5" onSubmit={(e) => { e.preventDefault(); if (isFormValid) navigate('/main'); }}>
            
            {/* 1. 이메일 입력 섹션 */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5"><Mail size={14} className="text-indigo-400"/> 이메일</label>
              <div className="relative">
                <input name="email" type="email" value={email} onChange={handleChange} className={getInputClass(validity.email, duplicates.email)} placeholder="example@email.com" />
                <div className="absolute right-4 top-3.5">
                  {loading.email ? <Loader2 className="animate-spin text-indigo-500" size={16}/> : 
                   validity.email && !duplicates.email && <Check className="text-blue-500" size={16}/>}
                </div>
              </div>
            </div>

            {/* 2. 닉네임 입력 섹션 */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5"><User size={14} className="text-indigo-400"/> 닉네임</label>
              <div className="relative">
                <input name="username" type="text" value={username} onChange={handleChange} className={getInputClass(validity.name, duplicates.name)} placeholder="2-15자 한글/영문/숫자" />
                <div className="absolute right-4 top-3.5">
                  {loading.name ? <Loader2 className="animate-spin text-indigo-500" size={16}/> : 
                   validity.name && !duplicates.name && <Check className="text-blue-500" size={16}/>}
                </div>
              </div>
            </div>

            {/* 3. 비밀번호 입력 섹션 및 체크리스트 */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5"><Lock size={14} className="text-indigo-400"/> 비밀번호</label>
              <div className="relative">
                <input name="password" type={shows.pw ? 'text' : 'password'} value={password} onChange={handleChange} className={getInputClass(validity.pw, null)} placeholder="강력한 암호를 설정하세요" />
                <button type="button" onClick={() => setShows(s => ({...s, pw: !s.pw}))} className="absolute right-4 top-3.5 text-gray-400">{shows.pw ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>

              {/* 실시간 보안 요구사항 피드백 UI */}
              {password && !validity.pw && (
                <div className="mt-3 p-3 sm:p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/50">
                  <p className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2.5 ml-0.5">보안 요구사항</p>
                  <ul className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-2">
                    {[
                      { label: '8자 이상', met: pwChecks.length },
                      { label: '영문 포함', met: pwChecks.letter },
                      { label: '숫자 포함', met: pwChecks.number },
                      { label: '특수문자 포함', met: pwChecks.special },
                    ].map((check, idx) => (
                      <li key={idx} className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold transition-colors duration-300 ${check.met ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`rounded-full flex items-center justify-center transition-all ${check.met ? 'bg-blue-100' : 'bg-gray-100'} w-3 h-3 sm:w-3.5 sm:h-3.5`}>
                          <Check strokeWidth={4} className={`${check.met ? 'text-blue-600' : 'text-gray-300'} w-2 sm:w-2.5 h-2 sm:h-2.5`} />
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
              <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">비밀번호 확인</label>
              <div className="relative">
                <input name="confirm" type={shows.confirm ? 'text' : 'password'} value={confirm} onChange={handleChange} className={getInputClass(validity.match, null)} placeholder="다시 입력해 주세요" />
                <button type="button" onClick={() => setShows(s => ({...s, confirm: !s.confirm}))} className="absolute right-4 top-3.5 text-gray-400">{shows.confirm ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
              {confirm && validity.match && (
                <p className="text-[10px] sm:text-[11px] font-bold ml-1 text-blue-600">✓ 비밀번호가 일치합니다.</p>
              )}
            </div>

            {/* 제출 버튼 */}
            <button type="submit" disabled={!isFormValid || loading.submit} className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 text-sm sm:text-base ${isFormValid && !loading.submit ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] hover:shadow-blue-200 active:scale-[0.99]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {loading.submit ? <Loader2 className="animate-spin mx-auto" size={20}/> : 'Learn-Time 시작하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}