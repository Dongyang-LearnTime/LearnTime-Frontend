import { create } from 'zustand';
import type { Role } from '../types/UserEnums';

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

// JWT 토큰 디코딩 헬퍼 함수
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  userName: null,
  role: null,
  isAuthenticated: false,
  isAuthChecking: true,

  setAccessToken: (token: string) => {
    const decoded = decodeToken(token);
    // 토큰 페이로드에서 userId 또는 sub(Subject) 추출
    const extractedUserId = decoded ? (decoded.userId || decoded.sub || decoded.id) : null;
    // 백엔드 createToken에서 셋팅된 "name" 클레임 추출
    const extractedUserName = decoded ? decoded.name : null;
    // 백엔드에서 세팅된 "role" 클레임 추출
    const extractedRole = decoded ? decoded.role : null;
    
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