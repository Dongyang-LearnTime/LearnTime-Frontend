import axios from 'axios';
import { useEffect, useRef, Suspense } from 'react';
import { API_BASE_URL } from './apiClient';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '../store/useAuthStore';
import { HomeFooter } from '../components/home/HomeFooter';
import { useNotificationSSE } from '../hooks/useNotificationSSE';

// dynamic import 컴포넌트들이 활성화될 때 보일 스피너/로딩 표시
const PageFallback = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#050505]">
    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const setAuthChecking = useAuthStore((state) => state.setAuthChecking);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  
  // 실시간 알림 SSE 연결 유지
  useNotificationSSE();

  const isStarted = useRef<boolean>(false);

  // apiClient 인터셉터에서 발생시킨 에러 이벤트 감지 및 SPA 라우팅 리다이렉트
  useEffect(() => {
    const handleAuthError = () => {
      navigate('/login');
    };

    const handleForbiddenError = () => {
      alert('접근 권한이 없습니다.');
      navigate('/');
    };

    window.addEventListener('auth-error', handleAuthError);
    window.addEventListener('forbidden-error', handleForbiddenError);
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
      window.removeEventListener('forbidden-error', handleForbiddenError);
    };
  }, [navigate]);

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
        const response = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(response.data.accessToken);
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('login_hint');
        }
      } finally {
        setAuthChecking(false);
      }
    };

      void silentRefresh();
    }, [setAccessToken, setAuthChecking]);

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
        {/* Dynamic import 라우트 컴포넌트 로딩 대기를 위한 Suspense 경계 설정 */}
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {(() => {
              const renderRoutes = (routeList: typeof routes, isRoot = true) => {
                return routeList.map((route, index) => {
                  const hasChildren = 'children' in route && Array.isArray(route.children);
                  const element = isRoot 
                    ? ((route as { noLayout?: boolean }).noLayout ? route.element : <main>{route.element}</main>)
                    : route.element;

                  if (hasChildren) {
                    return (
                      <Route
                        key={route.path || `layout-${index}`}
                        path={route.path}
                        element={element}
                      >
                        {renderRoutes(route.children as typeof routes, false)}
                      </Route>
                    );
                  }

                  return (
                    <Route
                      key={route.path || `route-${index}`}
                      path={route.path}
                      element={element}
                    />
                  );
                });
              };
              return renderRoutes(routes);
            })()}
          </Routes>
        </Suspense>
      </div>
      <HomeFooter />
    </div>
  );
}

export default App;
