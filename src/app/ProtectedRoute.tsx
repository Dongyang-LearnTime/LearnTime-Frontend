import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useMemo } from 'react';

import type { Role } from '../types/UserEnums';

interface JwtPayload {
    role: Role;
    userId: number;
    sub: string;
    exp: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  /** 미인증 시 리다이렉트 대신 렌더링할 컴포넌트 (선택) */
  fallback?: React.ReactNode;
}

// JWT decode
function parseJwt(token: string): JwtPayload | null {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

export default function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {

    const { accessToken, isAuthenticated } = useAuthStore();

    const decoded = useMemo(() => { // 메모이제이션
        return accessToken ? parseJwt(accessToken) : null;
    }, [accessToken]);

    // 로그인 체크: fallback이 있으면 로그인 페이지 대신 fallback 렌더링
    if (!isAuthenticated || !accessToken) {
        return fallback ? <>{fallback}</> : <Navigate to="/login" replace />;
    }

    if (!decoded) { // 토큰 이상
        return fallback ? <>{fallback}</> : <Navigate to="/login" replace />;
    }

    // 권한 체크
    if (requiredRole && decoded.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500 font-sans selection:bg-indigo-500/30 flex flex-col">
            {children}
        </div>
    );
}