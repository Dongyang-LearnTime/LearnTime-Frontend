import { useAuthStore } from '../../store/useAuthStore';
import { MainHeader } from './MainHeader';
import { PublicHeader } from './PublicHeader';

export function GlobalHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <MainHeader /> : <PublicHeader />;
}
