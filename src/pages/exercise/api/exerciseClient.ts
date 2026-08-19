import axios from 'axios';
import { API_BASE_URL } from '../../../app/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';

// 운동 도메인 전용 Axios 인스턴스
export const exerciseClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Access Token 주입
exerciseClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 동시 다발 API 호출 시 중복 안내 및 리다이렉트 방지 플래그
let isHandlingTermsError = false;

// Response Interceptor: 운동 약관 미동의(EX-008) 전담 처리
exerciseClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const errorCode = response?.data?.errorCode;
    const errorMessage = response?.data?.message;

    // ✅ 신체 데이터 수집 약관 미동의(EX-008) 에러 발생 시
    if (response?.status === 403 && errorCode === 'EX-008') {
      if (!isHandlingTermsError) {
        isHandlingTermsError = true;

        // 1. alert 알림창 안내 및 즉시 마이페이지(내 정보 탭)로 이동
        alert(
          errorMessage || '신체 데이터 수집 및 이용 약관(선택)에 동의해야 이용할 수 있습니다.'
        );
        window.location.replace('/mypage?tab=info');

        setTimeout(() => {
          isHandlingTermsError = false;
        }, 3000);
      }

      // 위젯들의 추가 에러 처리 및 콘솔 에러 폭풍 방지를 위해 대기 Promise 반환
      return new Promise(() => {});
    }

    // 401 Unauthorized 에러 시 전역 auth-error 이벤트 발생
    if (response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth-error'));
    }

    return Promise.reject(error);
  }
);
