import { create } from 'zustand';
import type { NotificationReferenceType, NotificationType } from '../types/NotificationEnums';


export interface NotificationResponse {
  notificationId: number;                  // 알림 식별자 (Primary Key)
  type: NotificationType;                  // 알림 타입 (친구 요청 수신/수락, 스터디 초대 수신/수락 등)
  title: string;                           // 알림 제목
  message: string;                         // 알림 상세 메시지 내용
  referenceId: number | null;              // 연관 도메인 식별자 (요청 ID, 스터디 ID 등, Nullable)
  referenceType: NotificationReferenceType | null; // 연관 도메인 타입 (Nullabler)
  isRead: boolean;                         // 읽음 처리 여부
  createdAt: string;                       // 알림 생성 일시 (ISO String)
}

interface NotificationState {
  // --- 상태 (State) ---
  notifications: NotificationResponse[]; // 전체 수신된 알림 목록 리스트
  unreadCount: number;                      // 읽지 않은 알림의 누적 개수
  hasNext: boolean;                         // 다음 페이지(커서 기반 페이징) 존재 여부
  nextCursor: number | null;                // 다음 조회를 위한 기준 커서 식별자

  // --- 액션 (Actions) ---
  setNotifications: (
    notifications: NotificationResponse[],
    hasNext: boolean,
    nextCursor: number | null
  ) => void;

  /**
   * 커서 기반 페이징으로 추가 조회된 알림 목록을 기존 목록에 병합합니다.
   */
  appendNotifications: (
    newNotifications: NotificationResponse[],
    hasNext: boolean,
    nextCursor: number | null
  ) => void;

  // 실시간 SSE 스트림을 통해 새 알림 수신 시, 알림 목록의 최상단(Index 0)에 알림을 추가하고 읽지 않은 알림 카운트를 증가시킵니다.
  addNotificationToTop: (notification: NotificationResponse) => void;

  // 읽지 않은 알림 카운트를 1 증가시킵니다.
  incrementUnreadCount: () => void;

  //  읽지 않은 알림 카운트를 1 감소시킵니다. (최솟값 0 보장)
  decrementUnreadCount: () => void;

  // 서버로부터 받은 읽지 않은 알림 총 개수를 스토어 상태에 동기화합니다.
  setUnreadCount: (count: number) => void;

  // 특정 알림을 로컬 상에서 '읽음' 처리로 상태 업데이트하고, 읽지 않은 카운트를 차감합니다.
  markAsReadLocal: (notificationId: number) => void;

  // 로컬에 보관 중인 모든 알림 목록을 '읽음' 처리로 업데이트하고, 읽지 않은 카운트를 0으로 초기화합니다.
  markAllAsReadLocal: () => void;

  // 특정 알림을 로컬 리스트에서 제거하며, 만약 읽지 않은 상태의 알림이었다면 카운트를 차감합니다.
  deleteNotificationLocal: (notificationId: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  // --- 초기 상태 정의 ---
  notifications: [],
  unreadCount: 0,
  hasNext: false,
  nextCursor: null,

  // --- 액션 구현부 ---
  setNotifications: (notifications, hasNext, nextCursor) =>
    set({
      notifications,
      hasNext,
      nextCursor,
    }),

  appendNotifications: (newNotifications, hasNext, nextCursor) =>
    set((state) => {
      // 중복 알림 방지를 위해 기존 ID 목록과 비교 (옵션)
      const existingIds = new Set(state.notifications.map((n) => n.notificationId));
      const filtered = newNotifications.filter((n) => !existingIds.has(n.notificationId));
      return {
        notifications: [...state.notifications, ...filtered],
        hasNext,
        nextCursor,
      };
    }),

  addNotificationToTop: (notification) =>
    set((state) => ({
      // 불변성을 지키기 위해 새로운 배열 생성 후 맨 앞에 결합 (React 19 최적화)
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  incrementUnreadCount: () =>
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    })),

  decrementUnreadCount: () =>
    set((state) => ({
      // 음수 카운트가 발생하는 방어 코드 설계 (JavaScript Math API 활용)
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  setUnreadCount: (count) =>
    set({
      unreadCount: count,
    }),

  markAsReadLocal: (notificationId) =>
    set((state) => {
      // 1단계: 타겟 알림 조회
      const targetNotification = state.notifications.find(
        (n) => n.notificationId === notificationId
      );
      
      // 이미 읽었거나 알림이 존재하지 않는 경우 카운트 변경 생략
      if (!targetNotification || targetNotification.isRead) {
        return {};
      }

      return {
        // 객체 참조 불변성을 지키면서 특정 원소만 얕은 복사로 업데이트
        notifications: state.notifications.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),

  markAllAsReadLocal: () =>
    set((state) => ({
      // 전체 배열 맵을 순회하며 일괄로 isRead 값을 참(true)으로 할당
      notifications: state.notifications.map((n) =>
        n.isRead ? n : { ...n, isRead: true }
      ),
      unreadCount: 0,
    })),

  deleteNotificationLocal: (notificationId) =>
    set((state) => {
      const target = state.notifications.find((n) => n.notificationId === notificationId);
      const wasUnread = target ? !target.isRead : false;

      return {
        // 지정된 식별자를 제외한 신규 배열로 필터링 (불변성 보장)
        notifications: state.notifications.filter(
          (n) => n.notificationId !== notificationId
        ),
        // 읽지 않은 상태의 알림을 지우는 경우에만 카운트를 동적으로 차감
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),
}));
