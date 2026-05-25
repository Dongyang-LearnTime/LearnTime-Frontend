import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import SendMessageModal from "../../pages/message/components/SendMessageModal";

interface UserPopoverProps {
  userId: number;
  userName: string;
  children: React.ReactNode;
  className?: string;
}

export default function UserPopover({ userId, userName, children, className = "inline-block" }: UserPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = useAuthStore((state) => state.userId);

  const isSelf = Number(currentUserId) === Number(userId);

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMessageClick = () => {
    if (!isAuthenticated) return;
    setIsOpen(false);
    setIsMessageModalOpen(true);
  };

  const handlePlaceholderClick = () => {
    alert("준비 중인 기능입니다.");
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className={`relative cursor-pointer ${className}`} 
        ref={popoverRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {children}

        {isOpen && (
          <div 
            className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#21262d] border border-gray-200 dark:border-[#30363d] rounded-md shadow-lg z-50 py-1 text-sm text-gray-800 dark:text-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Link 
              to={`/profile/${userId}`} 
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#30363d] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              프로필 가기
            </Link>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleMessageClick();
              }}
              disabled={!isAuthenticated || isSelf}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                (!isAuthenticated || isSelf)
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#30363d]"
              }`}
              title={!isAuthenticated ? "로그인이 필요합니다" : (isSelf ? "자신에게는 쪽지를 보낼 수 없습니다." : "")}
            >
              쪽지 보내기
            </button>

            <div className="border-t border-gray-100 dark:border-[#30363d] my-1"></div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePlaceholderClick();
              }}
              disabled={isSelf}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                isSelf
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-[#30363d] text-red-600 dark:text-red-400"
              }`}
              title={isSelf ? "자신을 차단할 수 없습니다." : ""}
            >
              차단하기
            </button>
          </div>
        )}
      </div>

      {isMessageModalOpen && (
        <SendMessageModal 
          receiverId={userId}
          receiverName={userName}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </>
  );
}
