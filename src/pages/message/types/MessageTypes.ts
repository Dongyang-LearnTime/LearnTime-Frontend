export interface MessageReadRequest {
  messageIds: number[];
}

export interface MessageRequest {
  receiverId: number;
  content: string;
}

export interface MessageResponse {
  messageId: number;
  content: string;
  sentAt: string;
  readAt: string | null;
  senderId: number;
  senderName: string;
  senderRole: string;
  receiverId: number;
  receiverName: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
