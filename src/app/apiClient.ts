import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const API_BASE_URL = import.meta.env.DEV 
  ? import.meta.env.VITE_LOCAL_API_URL 
  : import.meta.env.VITE_PRODUCTION_API_URL;

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // HttpOnly 쿠키(RefreshToken)를 요청에 포함시킴
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: 메모리의 Access Token을 Header에 주입
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Zustand 스토어에서 직접 상태를 옴
//     const token = useAuthStore.getState().accessToken;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    // ✅ Authorization 주입
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ multipart / json 분기 처리
    if (config.data instanceof FormData) {
      // multipart → Content-Type 제거 (axios가 자동 설정)
      delete config.headers["Content-Type"];
    } else {
      // 일반 요청 → JSON 유지
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 401 에러 발생 시 토큰 재발급 로직
let isRefreshing = false;
let refreshSubscribers: ((token: string | null, error?: any) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (error: any) => {
  refreshSubscribers.forEach((cb) => cb(null, error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string | null, error?: any) => void) => {
  refreshSubscribers.push(cb);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (originalRequest.url?.includes('/api/auth/login') || originalRequest.url?.includes('/api/auth/logout')) {
      return Promise.reject(error);
    }

    // 403 Forbidden 글로벌 처리
    if (response?.status === 403) {
      window.dispatchEvent(new CustomEvent('forbidden-error'));
      return Promise.reject(error);
    }

    // 401 Unauthorized이고, 재시도한 적이 없는 요청인 경우
    if (response?.status === 401 && !originalRequest._retry) {
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
          // 큐에 대기 중인 모든 요청 거절 처리 (메모리 누수 방지)
          onRefreshFailed(refreshError);
          // SPA 라우팅을 유지하기 위해 전역 이벤트를 발생시켜 App.tsx에서 navigate 처리
          window.dispatchEvent(new CustomEvent('auth-error'));
          return Promise.reject(refreshError);
        }
      }

      // 갱신 중이라면, 갱신이 끝날 때까지 대기(Promise) 후 기존 요청 재시도 혹은 거절
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token: string | null, error?: any) => {
          if (error) {
            reject(error);
          } else if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          }
        });
      });
    }
    return Promise.reject(error);
  }
);