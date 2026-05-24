import axios from 'axios';
import { useEffect, useRef } from 'react';
import { API_BASE_URL } from './apiClient';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '../store/useAuthStore';
import { HomeFooter } from '../components/home/HomeFooter';

function App() {
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const setAuthChecking = useAuthStore((state) => state.setAuthChecking);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  
  const isStarted = useRef(false);

  // 새로고침 직후 1회동안 리프레쉬 토큰 가져옴
  useEffect(() => {
    if (isStarted.current) return;
    isStarted.current = true;
    const silentRefresh = async () => {

      // 로그인 했던 기록이 없다면 서버에 요청 안 보냄 
      const loginHint = localStorage.getItem('login_hint');
      if (!loginHint) {
        setAuthChecking(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(response.data.accessToken);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('login_hint');
        }
      } finally {
        setAuthChecking(false);
      }
    };

      silentRefresh();
    }, [setAccessToken, setAuthChecking]);

  useEffect(() => {
    // 5초 후에는 무조건 로딩 해제 (무한 로딩 방지)
    const timeoutId = setTimeout(() => {
      setAuthChecking(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [setAuthChecking]);

  if (isAuthChecking) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 dark:bg-[#050505]">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-wide animate-pulse">인증 정보를 확인 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              // noLayout이 true인 라우트는 <main> 래퍼 없이 렌더링
              element={(route as { path: string; element: React.ReactNode; noLayout?: boolean }).noLayout ? route.element : <main>{route.element}</main>}
            />
          ))}
        </Routes>
      </div>
      <HomeFooter />
    </div>
  );
}

export default App;