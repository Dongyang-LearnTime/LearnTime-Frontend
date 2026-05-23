import { axiosInstance } from "../../../app/apiClient";
import type { QuizDetail, SubmittedAnswer } from "../quiz/QuizSolvePage";
import type { StudyQuizResultResponse } from "../quiz/QuizResultPage";

export const getQuizDetailApi = async (quizId: string): Promise<QuizDetail> => {
  const response = await axiosInstance.get(`/api/study/quiz/${quizId}`);
  return response.data;
};

export const submitQuizApi = async (data: SubmittedAnswer[]) => {
  const response = await axiosInstance.post(`/api/study/quiz/solve`, data);
  return response.data;
};

export const getQuizResultApi = async (quizHistoryId: string): Promise<StudyQuizResultResponse> => {
  const response = await axiosInstance.get(`/api/study/quiz/history/${quizHistoryId}/result`);
  return response.data;
};

export const generateQuizApi = async (studyId: number, studyNotesId: number): Promise<number> => {
  const response = await axiosInstance.post(`/api/study/quiz/generate`, {
    studyId,
    studyNotesId
  });
  return response.data;
};

/** 특정 스터디의 퀴즈 기록 목록 조회 */
export interface QuizHistoryListItem {
  quizHistoryId: number;
  studyId: number;
  noteTitle: string;
  totalQuestions: number;
  correctCount: number;
  createdAt: string;
}

export const getQuizHistoryListApi = async (studyId: string): Promise<QuizHistoryListItem[]> => {
  const response = await axiosInstance.get<QuizHistoryListItem[]>(
    `/api/study/quiz/history?studyId=${studyId}`
  );
  return response.data;
};