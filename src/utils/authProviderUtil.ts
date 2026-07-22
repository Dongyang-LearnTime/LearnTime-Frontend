/**
 * AuthProvider Enum 문자열을 사용자 친화적 한국어 명칭으로 변환합니다.
 */
export function getAuthProviderLabel(provider?: string | null): string {
  if (!provider) return '미설정';

  const normalized = provider.toUpperCase();

  switch (normalized) {
    case 'LOCAL':
      return '일반 이메일 가입';
    case 'GOOGLE':
      return 'Google 소셜 연동';
    case 'NAVER':
      return 'Naver 소셜 연동';
    default:
      return provider;
  }
}
