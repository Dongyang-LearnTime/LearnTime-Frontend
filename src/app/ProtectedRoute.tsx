import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useMemo } from 'react';

import type { Role } from '../types/userEnums';

interface JwtPayload {
    role: Role;
    userId: number;
    sub: string;
    exp: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
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

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {

    const { accessToken, isAuthenticated } = useAuthStore();

    const decoded = useMemo(() => { // 메모이제이션
        return accessToken ? parseJwt(accessToken) : null;
    }, [accessToken]);

    // 로그인 체크
    if (!isAuthenticated || !accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (!decoded) { // 토큰 이상
        return <Navigate to="/login" replace />;
    }

    // 권한 체크
    if (requiredRole && decoded.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}