import { axiosInstance } from "../../../app/apiClient";
import type { PageResponse } from "../../../types/paginationType";
import type { StudyFeedbackResponse, UpdateFeedbackTitleRequest } from "../types/studyFeedBackTypes";

// 특정 스터디의 피드백 기록을 조회함.
export const getStudyFeedbackList = async (studyId: number, page: number, size: number = 10): Promise<PageResponse<StudyFeedbackResponse>> => {
  const response = await axiosInstance.get<PageResponse<StudyFeedbackResponse>>(
    `/api/study/feedback/list/${studyId}`,
    {
      params: { page, size }
    }
  );
  return response.data;
};

// AI 학습 피드백을 생성하고 저장함.
export const generateStudyFeedback = async (studyId: number): Promise<StudyFeedbackResponse> => {
  const response = await axiosInstance.post<StudyFeedbackResponse>(`/api/study/feedback/${studyId}`);
  return response.data;
};

// 생성된 피드백의 제목을 수정함.
export const updateFeedbackTitle = async (request: UpdateFeedbackTitleRequest): Promise<void> => {
  await axiosInstance.patch('/api/study/feedback/title', request);
};

// 특정 피드백 기록을 삭제함.
export const deleteFeedback = async (feedbackId: number): Promise<void> => {
  await axiosInstance.delete(`/api/study/feedback/${feedbackId}`);
};

