import axios from 'axios'; 
import { useEffect, useRef } from 'react'; // useRef 추가
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '../store/useAuthStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:8080/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        setAccessToken(response.data.accessToken);
        console.log("되는 중");
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('login_hint');
        }
      } 
    };

      silentRefresh();
    }, [setAccessToken]);

  return (
    <>
      {/* 로그인 기능 확인용 테스트 문장 */}
      {isAuthenticated ? "로그인 상태임" : "로그아웃 상태임"}
      <hr />


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