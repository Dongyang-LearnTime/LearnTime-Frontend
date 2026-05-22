import { XIcon, BadgeIcon, MessageSquareIcon } from '../../ui/Icons';
import type { Post } from './types';

// PostDetailModal 컴포넌트의 Props 타입 정의
interface PostDetailModalProps {
  post: Post;
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  onAddComment: () => void;
  onClose: () => void;
}

// 특정 게시글의 상세 내용과 댓글 리스트를 보여주고, 댓글 작성을 가능하게 하는 모달 컴포넌트
export function PostDetailModal({
  post,
  commentInput,
  onCommentInputChange,
  onAddComment,
  onClose,
}: PostDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl max-h-[90vh] rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {
          // 모달 상단 헤더: 작성자 배지, 이름, 업로드 시간 및 닫기 버튼
        }
        <header className="p-8 border-b border-gray-100 dark:border-[#1a1a1a] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <BadgeIcon level={post.badge} size={56} />
            <div>
              <p className="font-black text-sm">{post.author}</p>
              <p className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest">{post.timestamp}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-gray-50 dark:bg-[#111] hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
          >
            <XIcon size={20} />
          </button>
        </header>
        
        {
          // 모달 바디: 게시글 상세 텍스트 및 댓글 리스트
        }
        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
          {
            // 상세 본문 내용
          }
          <p className="text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200 mb-10 whitespace-pre-wrap">
            {post.content}
          </p>
          
          {
            // 댓글 영역 분할선 및 댓글 헤더
          }
          <div className="border-t border-gray-100 dark:border-[#1a1a1a] pt-10">
            <h4 className="font-black text-[0.65rem] uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <MessageSquareIcon size={14} /> Comments ({post.commentsList?.length || 0})
            </h4>
            
            {
              // 댓글 리스트
            }
            <div className="space-y-6">
              {post.commentsList?.map(comment => (
                <div key={comment.id} className="bg-gray-50/50 dark:bg-[#050505]/50 p-6 rounded-3xl border border-gray-50 dark:border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-xs text-indigo-600">{comment.author}</span>
                    <span className="text-[0.6rem] font-bold text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              ))}
              
              {
                // 댓글이 없을 때 렌더링될 빈 화면 메시지
              }
              {(!post.commentsList || post.commentsList.length === 0) && (
                <p className="text-center py-10 text-xs font-bold text-gray-400 italic">첫 댓글을 남겨보세요!</p>
              )}
            </div>
          </div>
        </div>
        
        {
          // 모달 하단 푸터: 댓글 작성 인풋 및 게시 버튼
        }
        <div className="p-8 border-t border-gray-100 dark:border-[#1a1a1a] bg-gray-50/30 dark:bg-[#050505]/30 shrink-0">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
              placeholder="따뜻한 댓글을 남겨주세요..."
              className="flex-grow bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            />
            <button 
              onClick={onAddComment}
              className="px-8 bg-black dark:bg-white text-white dark:text-black font-black text-sm rounded-2xl active:scale-95 transition-all shadow-xl shadow-indigo-500/10"
            >
              게시
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
