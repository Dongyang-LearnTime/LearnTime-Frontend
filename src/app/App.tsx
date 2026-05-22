import axios from 'axios'; 
import { useEffect, useRef } from 'react'; // useRef 추가
import { API_BASE_URL } from './apiClient';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationSSE } from '../hooks/useNotificationSSE';
import { NotificationDropdown } from '../components/layout/NotificationDropdown';
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const setAuthChecking = useAuthStore((state) => state.setAuthChecking);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  
  const isStarted = useRef(false);

  // 실시간 SSE 알림 수신 연결 활성화
  useNotificationSSE();

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
      {/* 로그인 기능 확인용 테스트 문장 */}
      {isAuthenticated ? "로그인 상태임" : "로그아웃 상태임"}
      <hr />
      
      {/* 실시간 알림 수신 아이콘 및 드롭다운 */}
      {isAuthenticated && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
          <NotificationDropdown />
        </div>
      )}


      <Routes>
        {routes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path}
            element={
              <main>
                {route.element} 
              </main>
            } 
          />
        ))}
      </Routes>
    </>
  );
}

export default App;