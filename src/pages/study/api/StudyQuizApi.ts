import { axiosInstance } from "../../../app/apiClient";
import type { QuizDetail, SubmittedAnswer } from "../quiz/QuizSolvePage";
import type { StudyQuizResultResponse } from "../quiz/QuizResultPage";
import type { PageResponse } from "../../../types/PaginationType";
import type { QuizHistoryListItem, StudyQuizInfoResponse, QuizHistoryInfoResponse, UpdateQuizTitleRequest } from "../types/StudyQuizTypes"

export const updateStudyQuizTitleApi = async (request: UpdateQuizTitleRequest): Promise<void> => {
  await axiosInstance.patch(`/api/study/quiz/title`, request);
};

export const deleteStudyQuizApi = async (studyQuizId: number): Promise<void> => {
  await axiosInstance.delete(`/api/study/quiz/${studyQuizId}`);
};

export const deleteQuizHistoryApi = async (quizHistoryId: number): Promise<void> => {
  await axiosInstance.delete(`/api/study/quiz/history/${quizHistoryId}`);
};


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

export const getQuizHistoryListApi = async (studyId: string): Promise<QuizHistoryListItem[]> => {
  const response = await axiosInstance.get<QuizHistoryListItem[]>(
    `/api/study/quiz/history?studyId=${studyId}`
  );
  return response.data;
};


export const getStudyQuizList = async (studyId: number, page: number, size: number = 10): Promise<PageResponse<StudyQuizInfoResponse>> => {
  const response = await axiosInstance.get<PageResponse<StudyQuizInfoResponse>>(
    `/api/study/quiz/list/${studyId}`,
    {
      params: { page, size }
    }
  );
  return response.data;
};

export const getQuizHistoryList = async (studyQuizId: number, page: number, size: number = 10): Promise<PageResponse<QuizHistoryInfoResponse>> => {
  const response = await axiosInstance.get<PageResponse<QuizHistoryInfoResponse>>(
    `/api/study/quiz/${studyQuizId}/history/list`,
    {
      params: { page, size }
    }
  );
  return response.data;
};

