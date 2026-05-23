import { create } from 'zustand';
import { getMyStudyProgresses , type StudyProgressIndicatorResponse } from '../pages/study/api/StudyApi';

interface StudyStoreState {
    progresses: StudyProgressIndicatorResponse[];
    isLoading: boolean;
    error: string | null;
    fetchProgresses: () => Promise<void>;
}

export const useStudyStore = create<StudyStoreState>((set) => ({
    progresses: [],
    isLoading: true, // 초기 렌더링 시 Redirector가 비어있다고 판단하여 /empty로 가는 현상 방지
    error: null,
    fetchProgresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getMyStudyProgresses();
            set({ progresses: data, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || '공부 진도 목록을 불러오는 중 오류가 발생했습니다.', 
                isLoading: false 
            });
        }
    }
}));
