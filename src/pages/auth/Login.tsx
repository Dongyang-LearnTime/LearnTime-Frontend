import { useState } from 'react';
import { useNavigate, Link } from 'react-router'; 
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { login } from '../../utils/api';
import { SocialLogin } from '../../components/section/Button/SocialLogin.tsx';
=======
import { SocialLogin } from './SocialLogin.tsx';
>>>>>>> Stashed changes
=======
import { SocialLogin } from './SocialLogin.tsx';
>>>>>>> Stashed changes

export function LoginPage() {
  const navigate = useNavigate();

  // 폼 데이터 및 상태 통합 관리
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { username, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setLoginError('닉네임과 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    try {
      const token = await login(username, password);
      if (token) {
        navigate('/main');
      } else {
        setLoginError('닉네임 또는 비밀번호가 올바르지 않습니다.');
      }
=======
=======
>>>>>>> Stashed changes
    // --- 프론트 전용 테스트용 로직 시작 ---
    try {
      // 실제 API 호출 대신 1초 대기 후 성공한 것으로 처리
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 테스트를 위해 아무 값이나 입력해도 /main으로 이동하도록 설정
      navigate('/main');
      
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    } catch {
      setLoginError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 공통 입력창 스타일
  const inputStyle = `
    appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    focus:border-indigo-500 transition-all duration-200
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
=======
=======
>>>>>>> Stashed changes
    focus:border-indigo-500 transition-all duration-200 text-sm sm:text-base
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        
        {/* 헤더 섹션 */}
        <div className="text-center">
          <Link to="/" className="inline-block group">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Learn-Time
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">다시 시작해볼까요?</h2>
          <p className="mt-2 text-sm text-gray-600">
=======
=======
>>>>>>> Stashed changes
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Learn-Time
            </h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">다시 시작해볼까요?</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            계정이 없으신가요?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline">
              회원가입하기
            </Link>
          </p>
        </div>

        {/* 폼 카드 */}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* 닉네임 입력 */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 ml-1">닉네임</label>
=======
=======
>>>>>>> Stashed changes
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-white/20">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            
            {/* 닉네임 입력 */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-gray-700 ml-1">닉네임</label>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              <input
                id="username" name="username" type="text" required
                value={username} onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                className={inputStyle}
              />
            </div>

            {/* 비밀번호 입력 */}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1">비밀번호</label>
=======
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 ml-1">비밀번호</label>
>>>>>>> Stashed changes
=======
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 ml-1">비밀번호</label>
>>>>>>> Stashed changes
              <div className="relative">
                <input
                  id="password" name="password" required
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                >
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
=======
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
>>>>>>> Stashed changes
=======
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
>>>>>>> Stashed changes
                </button>
              </div>
            </div>

            {/* 부가 기능 */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">로그인 상태 유지</span>
              </label>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">비밀번호 찾기</a>
=======
=======
>>>>>>> Stashed changes
                <input type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 transition-colors">로그인 유지</span>
              </label>
              <a href="#" className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-500">비밀번호 찾기</a>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            </div>

            {/* 에러 메시지 */}
            {loginError && (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p className="text-sm font-medium">{loginError}</p>
=======
              <div className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} className="flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">{loginError}</p>
>>>>>>> Stashed changes
=======
              <div className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} className="flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">{loginError}</p>
>>>>>>> Stashed changes
              </div>
            )}

            {/* 로그인 실행 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                w-full flex justify-center items-center gap-2 py-4 rounded-2xl shadow-lg font-bold text-white transition-all
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-indigo-200'}
=======
=======
>>>>>>> Stashed changes
                w-full flex justify-center items-center gap-2 py-3.5 sm:py-4 rounded-2xl shadow-lg font-bold text-white transition-all text-sm sm:text-base
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] hover:shadow-indigo-200'}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              `}
            >
              {isSubmitting ? (
                <>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  <Loader2 className="animate-spin" size={20} />
=======
                  <Loader2 className="animate-spin" size={18} />
>>>>>>> Stashed changes
=======
                  <Loader2 className="animate-spin" size={18} />
>>>>>>> Stashed changes
                  로그인 중...
                </>
              ) : '로그인'}
            </button>
          </form>

          {/* 소셜 로그인 구분선 */}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">또는 소셜 계정으로 로그인</span></div>
=======
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-[10px] sm:text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">또는 소셜 계정으로 로그인</span></div>
>>>>>>> Stashed changes
=======
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-[10px] sm:text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">또는 소셜 계정으로 로그인</span></div>
>>>>>>> Stashed changes
          </div>

          <SocialLogin isDark={false} />
        </div>

      </div>
    </div>
  );
}