export interface StudyFeedbackResponse {
  feedbackId: number;
  feedbackTitle: string;
  feedbackContent: string;
  createdAt: string;
}

export interface UpdateFeedbackTitleRequest {
  feedbackId: number;
  feedbackTitle: string;
}