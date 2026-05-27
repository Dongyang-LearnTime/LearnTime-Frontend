import { useState } from "react";
import { createPortal } from "react-dom";
import { sendMessage } from "../api/messageApi";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";

interface SendMessageModalProps {
  receiverId: number;
  receiverName: string;
  onClose: () => void;
}

export default function SendMessageModal({ receiverId, receiverName, onClose }: SendMessageModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await sendMessage({ receiverId, content });
      alert("쪽지가 성공적으로 발송되었습니다.");
      onClose();
    } catch (error) {
      alert(getApiErrorUtil(error, "쪽지 전송에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white dark:bg-[#161b22] rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-[#30363d]">
        <div className="p-4 border-b border-gray-200 dark:border-[#30363d] flex justify-between items-center bg-gray-50 dark:bg-[#21262d]">
          <h3 className="text-lg font-bold dark:text-white">쪽지 보내기</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">받는 사람</label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-[#0d1117] border border-gray-300 dark:border-[#30363d] rounded-md text-gray-700 dark:text-gray-300">
                {receiverName}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">내용</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="쪽지 내용을 입력하세요 (최대 1000자)"
                rows={5}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#0d1117] dark:text-white resize-none"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length} / 1000
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-[#30363d] flex justify-end gap-2 bg-gray-50 dark:bg-[#21262d]">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-[#30363d] text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#30363d] transition-colors"
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "전송 중..." : "보내기"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
