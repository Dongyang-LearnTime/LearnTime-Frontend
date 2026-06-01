import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { MainHeader } from './MainHeader';
import { PublicHeader } from './PublicHeader';

export function GlobalHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? (
    <MainHeader key={location.key} />
  ) : (
    <PublicHeader key={location.key} />
  );
}
