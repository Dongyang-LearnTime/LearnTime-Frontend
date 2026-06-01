import React from "react";

interface BaseModalProps {
  // 모달의 열림 상태 
  isOpen: boolean;
  // 모달 닫기 핸들러 
  onClose: () => void;
  //내부 렌더링될 React 노드
  children: React.ReactNode;
  // 닫기(X) 버튼 노출 여부 (기본값: true) 
  showCloseButton?: boolean;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
      id="base-modal-backdrop"
    >
      <div
        className="bg-white dark:bg-[#111] dark:border dark:border-[#222] rounded-xl shadow-xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
        id="base-modal-content"
      >
        {/* 닫기(X) 버튼 */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
            id="base-modal-close-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
