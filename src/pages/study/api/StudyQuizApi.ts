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