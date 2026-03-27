import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 배포 시 : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  withCredentials: true, // HttpOnly 쿠키(RefreshToken)를 요청에 포함시킴
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: 메모리의 Access Token을 Header에 주입
axiosInstance.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 직접 상태를 옴
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 에러 발생 시 토큰 재발급 로직
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // [추가된 로직] 로그인 API 요청 시 발생한 에러는 인터셉터를 거치지 않고 즉시 호출부(LoginPage)로 반환
    if (originalRequest.url?.includes('/api/auth/login')) {
      return Promise.reject(error);
    }

    // 401 Unauthorized이고, 재시도한 적이 없는 요청인 경우
    if (response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url?.includes('/api/auth/refresh')) {
         useAuthStore.getState().clearAuth(); 
         return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 백엔드의 재발급 엔드포인트 호출 (쿠키는 withCredentials로 자동 전송됨)
          const { data } = await axios.post(
            `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = data.accessToken;
          
          // 메모리에 새로운 Access Token 갱신
          useAuthStore.getState().setAccessToken(newAccessToken);
          
          isRefreshing = false;
          onRefreshed(newAccessToken);
          
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          // Refresh Token마저 만료된 경우 로그아웃 처리
          useAuthStore.getState().clearAuth();
          window.location.href = '/login'; 
          return Promise.reject(refreshError);
        }
      }

      // 갱신 중이라면, 갱신이 끝날 때까지 대기(Promise) 후 기존 요청 재시도
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);