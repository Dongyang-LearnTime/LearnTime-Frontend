import axios from 'axios';
import { useEffect, useRef } from 'react';
import { API_BASE_URL } from './apiClient';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '../store/useAuthStore';

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

  if (isAuthChecking) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <>
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
    </>
  );
}

export default App;