import { axiosInstance } from '../../../app/apiClient';

export type SocialProvider = 'GOOGLE' | 'KAKAO';

export interface SocialLoginRequest {
  provider: SocialProvider;
  token: string;
}

export interface SocialLoginResponse {
  isRegistered: boolean;
  accessToken: string | null;
  tokenType: string | null;
}

export interface SocialSignUpRequest {
  provider: SocialProvider;
  token: string;
  userName: string;
  termsAgreements: Record<string, boolean>;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
}

// 소셜 로그인 API
export const socialLoginApi = async (data: SocialLoginRequest): Promise<SocialLoginResponse> => {
  const response = await axiosInstance.post<SocialLoginResponse>('/api/auth/social/login', data);
  return response.data;
};

// 소셜 회원가입 API
export const socialSignUpApi = async (data: SocialSignUpRequest): Promise<TokenResponse> => {
  const response = await axiosInstance.post<TokenResponse>('/api/auth/social/signup', data);
  return response.data;
};

// 닉네임 중복 체크 API (Auth API)
export const checkNameApi = async (name: string): Promise<boolean> => {
  const response = await axiosInstance.get<boolean>(`/api/auth/name/${encodeURIComponent(name)}`);
  return response.data; // true: 사용 가능, false: 이미 사용 중
};
