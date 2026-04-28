import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setAuthChecking: (isChecking: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isAuthChecking: true,

  setAccessToken: (token: string) => 
      set({ accessToken: token, isAuthenticated: true }), // 엑세스 토큰 업데이트
    
  clearAuth: () => 
    set({ accessToken: null, isAuthenticated: false }), // 로그아웃 함수

  setAuthChecking: (isChecking: boolean) =>
    set({ isAuthChecking: isChecking }),
}));