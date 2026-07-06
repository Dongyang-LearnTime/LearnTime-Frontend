import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Terms } from '../types/userEnums';

interface SignupState {
  email: string;
  userName: string;
  password: string;
  termsAgreements: Record<Terms, boolean>;
  emailVerificationToken?: string;
  
  // 상태 변경 함수
  setSignupData: (data: Partial<Omit<SignupState, 'setSignupData' | 'reset'>>) => void;
  // 초기화 함수
  reset: () => void;
}

const initialState = {
  email: '',
  userName: '',
  password: '',
  termsAgreements: {
    SERVICE_USE: false,
    PRIVACY_POLICY: false,
    BODY_DATA_COLLECT: false,
  },
};

export const useSignupStore = create<SignupState>()(
  persist(
    (set) => ({
      ...initialState,
      setSignupData: (data) => set((state) => ({ ...state, ...data })),
      reset: () => set(initialState),
    }),
    {
      name: 'signup-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
