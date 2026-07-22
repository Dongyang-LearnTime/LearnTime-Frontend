import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SocialProvider } from '../api/socialAuthApi';

interface SocialSignupState {
  socialToken: string | null;
  provider: SocialProvider | null;
  setSocialAuthData: (token: string, provider: SocialProvider) => void;
  clearSocialAuthData: () => void;
}

export const useSocialSignupStore = create<SocialSignupState>()(
  persist(
    (set) => ({
      socialToken: null,
      provider: null,
      setSocialAuthData: (socialToken, provider) => set({ socialToken, provider }),
      clearSocialAuthData: () => set({ socialToken: null, provider: null }),
    }),
    {
      name: 'social-signup-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
