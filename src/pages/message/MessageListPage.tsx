import { useEffect, useState } from "react";
import { getReceivedMessages, getSentMessages, readMessages, deleteMessage } from "./api/messageApi";
import type { MessageResponse, PageResponse } from "./types/MessageTypes";
import { usePageTitle } from "../../hooks/usePageTitle";
import { getApiErrorUtil } from "../../utils/getApiErrorUtil";
import { toast } from '../../utils/toast';

type TabType = "RECEIVED" | "SENT";

export default function MessageListPage() {
  const [activeTab, setActiveTab] = useState<TabType>("RECEIVED");
  const [pageData, setPageData] = useState<PageResponse<MessageResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageResponse | null>(null);

  usePageTitle("쪽지함");

  const fetchMessages = async (page: number) => {
    setIsLoading(true);
    try {
      if (activeTab === "RECEIVED") {
        const data = await getReceivedMessages(page, 10);
        setPageData(data);
      } else {
        const data = await getSentMessages(page, 10);
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(currentPage);
    setSelectedMessage(null);
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleMessageClick = async (message: MessageResponse) => {
    setSelectedMessage(message);
    
    // 받은 쪽지이면서 아직 안 읽은 경우 읽음 처리
    if (activeTab === "RECEIVED" && !message.readAt) {
      try {
        await readMessages({ messageIds: [message.messageId] });
        // 데이터 갱신
        fetchMessages(currentPage);
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm("정말 이 쪽지를 삭제하시겠습니까?")) return;
    
    try {
      await deleteMessage(messageId);
      toast.info("쪽지가 삭제되었습니다.");
      if (selectedMessage?.messageId === messageId) {
        setSelectedMessage(null);
      }
      fetchMessages(currentPage);
    } catch (error) {
      toast.error(getApiErrorUtil(error, "쪽지 삭제에 실패했습니다."));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[80vh] flex flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">쪽지함</h1>

      {/* 탭 네비게이션 - 친구 알림/공부 초대 스타일과 동일화 */}
      <div className="flex border-b border-gray-100 dark:border-[#1a1a1a] mb-6 gap-4">
        <button
          onClick={() => handleTabChange("RECEIVED")}
          className={`py-3 px-4 text-base font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "RECEIVED"
              ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-gray-800"
          }`}
        >
          받은 쪽지함
        </button>
        <button
          onClick={() => handleTabChange("SENT")}
          className={`py-3 px-4 text-base font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "SENT"
              ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-gray-800"
          }`}
        >
          보낸 쪽지함
        </button>
      </div>

      {selectedMessage ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-[#050505] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-[#333] transition-all gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-2">
              {activeTab === "RECEIVED"
                ? `보낸 사람: ${selectedMessage.senderName}`
                : `받는 사람: ${selectedMessage.receiverName}`}
            </h3>

            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 flex gap-4 mt-1">
              <span>
                보낸 시간: {new Date(selectedMessage.sentAt).toLocaleString()}
              </span>

              {activeTab === "SENT" && (
                <span>
                  읽은 시간:{" "}
                  {selectedMessage.readAt
                    ? new Date(selectedMessage.readAt).toLocaleString()
                    : "읽지 않음"}
                </span>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0d1117] rounded-2xl border border-gray-100 dark:border-[#1a1a1a] min-h-50 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {selectedMessage.content}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => handleDeleteMessage(selectedMessage.messageId)}
              className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
            >
              삭제
            </button>

            <button
              onClick={() => setSelectedMessage(null)}
              className="px-5 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-[#222] transition-colors cursor-pointer"
            >
              목록으로
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="text-center py-20 text-gray-400 font-bold text-sm">
                로딩 중...
              </div>
            ) : pageData?.content && pageData.content.length > 0 ? (
              pageData.content.map((msg) => (
                <div
                  key={msg.messageId}
                  onClick={() => handleMessageClick(msg)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer group gap-4 ${
                    activeTab === "RECEIVED" && !msg.readAt
                      ? "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700/50 shadow-sm hover:shadow-md"
                      : "bg-white dark:bg-[#050505] border-gray-100 dark:border-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#333] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* 아바타 (첫 글자) - 친구/공부 초대와 완전 매칭 */}
                    <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-sm font-black text-gray-600 dark:text-gray-300 shadow-sm shrink-0">
                      {(activeTab === "RECEIVED" ? msg.senderName : msg.receiverName).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-lg font-black tracking-tight truncate ${
                          activeTab === "RECEIVED" && !msg.readAt
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {activeTab === "RECEIVED" && !msg.readAt && (
                          <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2 mb-0.5" />
                        )}
                        {activeTab === "RECEIVED" ? msg.senderName : msg.receiverName}
                      </h3>
                      {/* 쪽지 내용 요약 */}
                      <p className={`text-sm leading-relaxed truncate mt-1 ${
                        activeTab === "RECEIVED" && !msg.readAt
                          ? "text-gray-700 dark:text-gray-400 font-semibold"
                          : "text-gray-500 dark:text-gray-500"
                      }`}>
                        {msg.content}
                      </p>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
                        전송일시: {new Date(msg.sentAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(msg.messageId);
                      }}
                      className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                      aria-label="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] text-gray-400 font-bold">
                {activeTab === "RECEIVED"
                  ? "받은 쪽지가 없습니다."
                  : "보낸 쪽지가 없습니다."}
              </div>
            )}
          </div>

          {pageData && pageData.totalPages > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-[#1a1a1a] flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded border border-gray-300 dark:border-[#30363d] disabled:opacity-50 dark:text-gray-300 cursor-pointer text-sm font-bold"
              >
                이전
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                {currentPage + 1} / {pageData.totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pageData.totalPages - 1, p + 1)
                  )
                }
                disabled={pageData.last}
                className="px-3 py-1 rounded border border-gray-300 dark:border-[#30363d] disabled:opacity-50 dark:text-gray-300 cursor-pointer text-sm font-bold"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
