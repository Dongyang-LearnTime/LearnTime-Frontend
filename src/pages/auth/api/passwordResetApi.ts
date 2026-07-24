import { axiosInstance } from '../../../app/apiClient';

export interface PasswordResetSendRequest {
  email: string;
}

export interface PasswordResetVerifyRequest {
  email: string;
  code: string;
}

export interface PasswordResetVerifyResponse {
  resetToken: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

/**
 * 1. 비밀번호 재설정 이메일 인증 코드 발송 요청
 */
export const sendPasswordResetCode = async (email: string): Promise<void> => {
  await axiosInstance.post('/api/auth/password-reset/request', { email });
};

/**
 * 2. 6자리 인증 코드 확인 및 일회성 비밀번호 재설정 토큰(resetToken) 발급
 */
export const verifyPasswordResetCode = async (
  email: string,
  code: string
): Promise<PasswordResetVerifyResponse> => {
  const response = await axiosInstance.post<PasswordResetVerifyResponse>(
    '/api/auth/password-reset/verify',
    { email, code }
  );
  return response.data;
};

/**
 * 3. 일회성 resetToken과 새 비밀번호를 제출하여 최종 비밀번호 재설정
 */
export const confirmPasswordReset = async (
  data: PasswordResetConfirmRequest
): Promise<void> => {
  await axiosInstance.post('/api/auth/password-reset/confirm', data);
};
