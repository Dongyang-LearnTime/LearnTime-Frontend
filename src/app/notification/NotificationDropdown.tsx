import React, { useEffect, useState, useRef } from "react";
import { useNotificationStore } from "../../store/useNotificationStore";
import { NotificationApi } from "./api/NotificationApi";

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Zustand 스토어 상태 및 액션 추출 (Selector 패턴 적용)
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const markAsReadLocal = useNotificationStore((state) => state.markAsReadLocal);
  const markAllAsReadLocal = useNotificationStore((state) => state.markAllAsReadLocal);
  const deleteNotificationLocal = useNotificationStore((state) => state.deleteNotificationLocal);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 최초 1회 읽지 않은 알림 수 및 알림 목록 로딩
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const countRes = await NotificationApi.getUnreadCount();
        setUnreadCount(Number(countRes.unreadCount));

        const listRes = await NotificationApi.getNotifications();
        setNotifications(listRes.content, listRes.hasNext, listRes.nextCursor);
      } catch (error) {
        console.error("Failed to load initial notification count/list:", error);
      }
    };
    fetchInitialData();
  }, [setNotifications, setUnreadCount]);

  // 드롭다운 외부 클릭 시 자동으로 닫히도록 윈도우 마우스 이벤트 바인딩
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // 특정 알림 클릭 시 읽음 처리 API 호출 후 로컬 상태 동기화
  const handleReadNotification = async (notificationId: number) => {
    if (notificationId < 0) {
      markAsReadLocal(notificationId);
      return;
    }
    try {
      await NotificationApi.readNotification(notificationId);
      markAsReadLocal(notificationId);
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
    }
  };

  // 전체 알림 읽음 처리 API 호출 후 로컬 상태 동기화
  const handleReadAllNotifications = async () => {
    try {
      await NotificationApi.readAllNotifications();
      markAllAsReadLocal();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // 특정 알림 삭제 API 호출 후 로컬 상태에서 제거
  const handleDeleteNotification = async (event: React.MouseEvent, notificationId: number) => {
    event.stopPropagation(); // 드롭다운 내부 클릭에 의한 토글링 전파(닫힘) 방지
    if (notificationId < 0) {
      deleteNotificationLocal(notificationId);
      return;
    }
    try {
      await NotificationApi.deleteNotification(notificationId);
      deleteNotificationLocal(notificationId);
    } catch (error) {
      console.error(`Failed to delete notification ${notificationId}:`, error);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 알림 트리거 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2.5 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="알림 열기"
      >
        <span className="sr-only">알림 보기</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {/* 읽지 않은 알림 개수 뱃지 */}
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 z-10 inline-flex items-center justify-center px-1 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-md ring-2 ring-white"
            style={{ minWidth: "18px", height: "18px" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 내용 드롭다운 리스트 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2.5 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-label="알림 메뉴"
        >
          {/* 헤더 섹션 */}
          <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/60">
            <span className="font-semibold text-gray-800 text-sm">알림</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleReadAllNotifications}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
              >
                모두 읽음
              </button>
            )}
          </div>

          {/* 목록 섹션 */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">새로운 알림이 없습니다.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.notificationId}
                  onClick={() => !item.isRead && handleReadNotification(item.notificationId)}
                  className={`px-4 py-3.5 flex items-start gap-2.5 cursor-pointer transition-colors duration-150 relative ${
                    item.isRead ? "bg-white hover:bg-gray-50/50" : "bg-blue-50/20 hover:bg-blue-50/40"
                  }`}
                  role="menuitem"
                >
                  {/* 미읽음 알림용 인디케이터 점 */}
                  {!item.isRead && (
                    <span className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0 pl-1">
                    <p className={`text-xs ${item.isRead ? "text-gray-500" : "font-semibold text-gray-900"}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 leading-normal wrap-break-word">{item.message}</p>
                    <span className="text-[10px] text-gray-400 mt-1.5 block">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {/* 단일 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteNotification(e, item.notificationId)}
                    className="text-gray-300 hover:text-rose-500 focus:outline-none p-1 rounded-md transition-colors"
                    aria-label="알림 삭제"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
