import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,

  setAccessToken: (token: string) => 
    // 엑세스 토큰 업데이트
    set({ accessToken: token, isAuthenticated: true }),
    
    clearAuth: () => 
    // 로그아웃 함수 
    set({ accessToken: null, isAuthenticated: false }),
}));