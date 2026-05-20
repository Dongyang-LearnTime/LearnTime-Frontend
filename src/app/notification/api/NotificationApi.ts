import { axiosInstance } from "../../apiClient";
import type { NotificationReferenceType, NotificationType } from "../../../types/NotificationEnums";
import type { CursorResponse } from "../../../types/PaginationType";

// NotificationResponse 스키마에 대응하는 프런트엔드 알림 인터페이스
export interface NotificationResponse {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: number | null;
  referenceType: NotificationReferenceType | null;
  isRead: boolean;
  createdAt: string;
}

// 읽지 않은 알림 개수 응답 인터페이스
export interface NotificationCountResponse {
  unreadCount: number;
}

export const NotificationApi = {
  /**
   * @description 사용자의 알림 목록을 커서 기반으로 조회합니다.
   */
  getNotifications: async (cursorId?: number | null): Promise<CursorResponse<NotificationResponse>> => {
    const params = cursorId ? { cursorId } : {};
    const response = await axiosInstance.get<CursorResponse<NotificationResponse>>("/api/notifications", { params });
    return response.data;
  },

  /**
   * @description 사용자의 읽지 않은 알림 개수를 조회합니다.
   */
  getUnreadCount: async (): Promise<NotificationCountResponse> => {
    const response = await axiosInstance.get<NotificationCountResponse>("/api/notifications/unread-count");
    return response.data;
  },

  /**
   * @description 사용자의 알림 하나를 읽음 처리합니다.
   */
  readNotification: async (notificationId: number): Promise<void> => {
    await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
  },

  /**
   * @description 사용자의 모든 알림을 읽음 처리합니다.
   */
  readAllNotifications: async (): Promise<void> => {
    await axiosInstance.patch("/api/notifications/read-all");
  },

  /**
   * @description 사용자의 알림 하나를 삭제 처리합니다.
   */
  deleteNotification: async (notificationId: number): Promise<void> => {
    await axiosInstance.delete(`/api/notifications/${notificationId}`);
  },

  /**
   * @description 사용자의 여러 알림을 한 번에 삭제 처리합니다. (벌크 연산)
   */
  deleteNotifications: async (notificationIds: number[]): Promise<void> => {
    await axiosInstance.delete("/api/notifications/bulk", {
      params: { notificationIds: notificationIds.join(",") },
    });
  },
};
