/**
 * @file client.ts
 * @description Spring Boot 통신용 공통 Axios HTTP 클라이언트 설정.
 * - JWT 인증 토큰 주입 및 예외 처리
 * - 타임아웃 10초
 */

import axios from 'axios';

// API URL 동적 설정 (Vite 프록시 적용)
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 전역 Axios 인스턴스
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 타임아웃 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: JWT 토큰 주입
 */
apiClient.interceptors.request.use(
  (config) => {
    // 토큰 획득 및 헤더 주입
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: 예외 응답 및 토큰 만료 처리
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // 인증 실패 (토큰 만료/누락)
          console.error('인증 에러: 유효하지 않거나 만료된 JWT 토큰입니다. 재로그인이 필요합니다.');
          // TODO: 토큰 갱신 혹은 로그인 페이지 이동
          localStorage.removeItem('accessToken'); 
          break;
        case 403:
          // 권한 부족
          console.error('권한 에러: 해당 API에 접근할 수 있는 권한이 없습니다.');
          break;
        case 500:
          // 서버 내부 에러
          console.error('서버 에러: 시스템 내부 오류가 발생했습니다. DB 트랜잭션 롤백 처리됨.');
          break;
        default:
          console.error(`HTTP 에러 발생: 코드가 ${status} 입니다.`);
      }
    } else if (error.request) {
      // 서버 미응답 (네트워크 오류)
      console.error('네트워크 에러: Spring Boot 서버가 응답하지 않습니다.');
    }
    return Promise.reject(error);
  }
);



