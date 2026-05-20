import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import type { Event as PolyfillEvent, MessageEvent as PolyfillMessageEvent } from "event-source-polyfill";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import type { NotificationResponse } from "../app/notification/api/NotificationApi";

import { API_BASE_URL } from "../app/apiClient";

/**
 * 백엔드 SSE Emitter와 연결하여 실시간 알림 이벤트를 수신하는 커스텀 훅
 */
export const useNotificationSSE = (): void => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const addNotificationToTop = useNotificationStore((state) => state.addNotificationToTop);
  
  // SSE 연결 인스턴스를 유지하기 위한 Ref 객체 (재렌더링 시 커넥션 유실 및 다중 연결 방지)
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    // 미인증 상태 또는 토큰 부재 시 SSE 구독을 시도하지 않음
    if (!isAuthenticated || !accessToken) {
      return;
    }

    // event-source-polyfill을 인스턴스화하여 JWT 인증 정보 주입
    const eventSource = new EventSourcePolyfill(`${API_BASE_URL}/api/notifications/subscribe`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      heartbeatTimeout: 60 * 1000 * 60, // 백엔드 DEFAULT_TIMEOUT인 1시간 설정
    });

    eventSourceRef.current = eventSource;

    // 최초 연결 시 백엔드가 발송하는 더미 이벤트 리스너
    eventSource.addEventListener("connect", (event : any) => {
      const messageEvent = event as MessageEvent;
      console.log("SSE Connection Success:", messageEvent.data);
    });

    // 백엔드의 NotificationType.getEventName()과 대응하는 리스너 등록
    // 이벤트 수신 시 Zustand 스토어 최상단에 추가하는 공통 핸들러
    const handleNotificationEvent = (event: PolyfillEvent) => {
      const messageEvent = event as PolyfillMessageEvent;
      try {
        const data: NotificationResponse = JSON.parse(messageEvent.data);
        addNotificationToTop(data);
      } catch (error) {
        console.error("Failed to parse live notification event data:", error);
      }
    };

    // 백엔드에서 테스트용으로 발송하는 단순 문자열 데이터 수신 핸들러
    const handleTestEvent = (event: PolyfillEvent) => {
      const messageEvent = event as PolyfillMessageEvent;
      try {
        // 백엔드에서 DB 저장을 건너뛰고 단순 String으로 쐈으므로 JSON.parse 없이 문자열 그대로 가공
        const messageText = String(messageEvent.data);
        
        // UI 컴포넌트(알림 목록)에서 호환 가능하도록 NotificationResponse 규격으로 가상 변환
        const mockNotification: NotificationResponse = {
          notificationId: -Date.now(),        // 중복되지 않는 임시 식별용 음수 PK
          type: "CALENDAR_REMINDER",          // 임의의 기본 타입 할당
          title: "시스템 테스트 알림",
          message: messageText,
          referenceId: null,
          referenceType: null,
          isRead: false,                      // 기본 미읽음 처리
          createdAt: new Date().toISOString() // 현재 발생 시간
        };

        addNotificationToTop(mockNotification);
      } catch (error) {
        console.error("Failed to process test-event payload:", error);
      }
    };

    // 백엔드 알림 종류에 따른 이벤트 리스너들
    eventSource.addEventListener("FRIEND_REQUEST_RECEIVED", handleNotificationEvent);
    eventSource.addEventListener("FRIEND_REQUEST_ACCEPTED", handleNotificationEvent);
    eventSource.addEventListener("FRIEND_REQUEST_REJECTED", handleNotificationEvent);
    eventSource.addEventListener("CALENDAR_REMINDER", handleNotificationEvent);
    eventSource.addEventListener("STUDY_INVITATION_RECEIVED", handleNotificationEvent);
    eventSource.addEventListener("STUDY_INVITATION_ACCEPTED", handleNotificationEvent);
    eventSource.addEventListener("STUDY_INVITATION_REJECTED", handleNotificationEvent);
    
    // 테스트 발송 엔드포인트 전용 이벤트 등록
    eventSource.addEventListener("test-event", handleTestEvent);

    // 에러 발생 및 타임아웃 대응
    eventSource.onerror = (error : any) => {
      console.error("SSE connection error. Reconnecting is handled by polyfill.", error);
    };

    // Clean-up: 훅이 재평가되거나 언마운트될 때 반드시 리소스를 닫아 서버 풀 한도 초과 예방
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        console.log("SSE Connection clean-up executed.");
      }
    };
  }, [accessToken, isAuthenticated, addNotificationToTop]);
};
