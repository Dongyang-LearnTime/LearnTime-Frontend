import { create } from 'zustand';

interface StopwatchState {
  time: number;
  isRunning: boolean;
  studyDailyPlanId: number | null;
  progressStatus: string | null;
  startTime: number | null;
  accumulatedTime: number;
  setTime: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setStudyDailyPlanId: (id: number | null) => void;
  setProgressStatus: (status: string | null) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useStopwatchStore = create<StopwatchState>((set) => ({
  time: 0,
  isRunning: false,
  studyDailyPlanId: null,
  progressStatus: null,
  startTime: null,
  accumulatedTime: 0,
  setTime: (time) => set({ time }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setStudyDailyPlanId: (studyDailyPlanId) => set({ studyDailyPlanId }),
  setProgressStatus: (progressStatus) => set({ progressStatus }),
  start: () =>
    set((state) => {
      if (state.isRunning) return {};
      return {
        isRunning: true,
        startTime: Date.now(),
      };
    }),
  pause: () =>
    set((state) => {
      if (!state.isRunning || !state.startTime) return {};
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const nextAccumulated = state.accumulatedTime + elapsed;
      return {
        isRunning: false,
        startTime: null,
        accumulatedTime: nextAccumulated,
        time: nextAccumulated,
      };
    }),
  reset: () =>
    set({
      time: 0,
      isRunning: false,
      startTime: null,
      accumulatedTime: 0,
    }),
}));
