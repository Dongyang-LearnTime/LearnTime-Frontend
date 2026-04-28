import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    
  const isAuthenticated = useAuthStore(state => state.isAuthenticated); // 전역 상태 (Zustand)

  // 인증 체크
  if (!isAuthenticated) {
    // 로그인 안 되어 있으면 리다이렉트
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // 인증 됐으면 자식 컴포넌트 렌더링
}