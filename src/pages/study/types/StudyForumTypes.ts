export interface StudyForumMessage {
  messageId: number;
  authorStudyMemberId: number | null;
  authorUserId: number | null;
  authorName: string;
  content: string;
  createdAt: string;
}
