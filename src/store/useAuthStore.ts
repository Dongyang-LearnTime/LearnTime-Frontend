import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import type { Role } from '../types/userEnums';

// Custom JWT Payload 타입 정의
interface CustomJwtPayload {
  sub?: string;      // subject (이메일)
  userId?: number;   // 발급 유저의 id
  role?: Role;       // 발급 유저의 권한
  name?: string;     // 발급 유저의 이름
  [key: string]: any;
}

interface AuthState {
  accessToken: string | null;
  userId: number | string | null;
  userName: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  setAccessToken: (token: string) => void;
  setUserId: (id: number | string | null) => void;
  clearAuth: () => void;
  setAuthChecking: (isChecking: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  userName: null,
  role: null,
  isAuthenticated: false,
  isAuthChecking: true,

  setAccessToken: (token: string) => {
    let extractedUserId: number | string | null = null;
    let extractedUserName: string | null = null;
    let extractedRole: Role | null = null;

    try {
      // jwt-decode 라이브러리를 사용하여 안전하게 파싱 (URI 변환 오류 방지)
      const decoded = jwtDecode<CustomJwtPayload>(token);
      
      // 백엔드 토큰 구조에 맞춰 fallback(sub, id 등)을 제거하고 정확한 클레임만 매핑
      extractedUserId = decoded.userId ?? null;
      extractedUserName = decoded.name ?? null;
      extractedRole = decoded.role ?? null;
    } catch (e) {
      console.error('Invalid token:', e);
    }
    
    set({ 
      accessToken: token, 
      isAuthenticated: true, 
      userId: extractedUserId, 
      userName: extractedUserName,
      role: extractedRole
    });
  },
  
  setUserId: (id: number | string | null) =>
      set({ userId: id }),

  clearAuth: () => 
    set({ accessToken: null, userId: null, userName: null, role: null, isAuthenticated: false }), // 로그아웃 함수

  setAuthChecking: (isChecking: boolean) =>
    set({ isAuthChecking: isChecking }),
}));