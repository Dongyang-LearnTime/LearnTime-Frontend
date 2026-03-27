import axios, { AxiosError } from 'axios';

export interface ApiErrorResponse {
  detail: string;
  errorCode: string;
  message: string;
  timestamp: string;
}

// 백엔드의 커스텀 에러 메시지 파싱
export const getApiErrorUtil = (
    error: unknown,
    fallbackMessage = '서버와 통신 중 문제가 발생했습니다.'
): string => {

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }
  
  // Axios 통신 에러가 아니거나(예: 문법 에러), 네트워크 단절 등으로 response가 없는 경우
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};