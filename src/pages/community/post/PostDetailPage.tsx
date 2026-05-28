import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquareIcon, TrashIcon, EditIcon } from '../../../components/ui/Icons';
import { getPostApi, deletePostApi, togglePostLikeApi } from '../api/postApi';
import { createCommentApi, deleteCommentApi, updateCommentApi } from '../api/commentApi';
import type { PostResponse } from '../types/postTypes';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePageTitle } from '../../../hooks/usePageTitle';
import UserPopover from '../../../components/common/UserPopover';
import Avatar from '../../../components/common/Avatar';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { userId: currentUserId, role, isAuthenticated } = useAuthStore();
  const isAdmin = role === 'ROLE_ADMIN';

  const [post, setPost] = useState<PostResponse | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentInput, setEditCommentInput] = useState('');

  usePageTitle(post ? `게시글 - ${post.title}` : '게시글 상세 정보');

  const fetchPost = async (showSpinner = true) => {
    if (!postId) return;
    if (showSpinner) setIsLoading(true);
    try {
      const data = await getPostApi(Number(postId));
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post details:', error);
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost(true);
  }, [postId]);

  const handleAddComment = async () => {
    if (!commentInput.trim() || !currentUserId || !postId) return;
    try {
      await createCommentApi({ postId: Number(postId), content: commentInput });
      setCommentInput('');
      fetchPost(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteCommentApi(commentId);
      fetchPost(false);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentInput.trim()) return;
    try {
      await updateCommentApi(commentId, { content: editCommentInput });
      setEditingCommentId(null);
      setEditCommentInput('');
      fetchPost(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    if (!post) return;
    try {
      await togglePostLikeApi(post.postId);
      fetchPost(false);
    } catch (error) {
      console.error('Failed to toggle post like:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await deletePostApi(post.postId);
      alert('게시글이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (isLoading || !post) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="text-gray-500 font-bold animate-pulse">로딩 중...</div>
      </div>
    );
  }


  
  const isPostAuthor = post.userId !== null && Number(post.userId) === Number(currentUserId);
  const canControlPost = isPostAuthor || isAdmin;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button 
        onClick={() => navigate('/community')}
        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 inline-block"
      >
        &larr; 커뮤니티 목록으로 돌아가기
      </button>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-xl overflow-hidden flex flex-col">
        <header className="p-8 sm:p-10 border-b border-gray-100 dark:border-[#1a1a1a] flex justify-between items-center bg-gray-50/50 dark:bg-[#050505]/50">
          <div className="flex items-center gap-4">
            <Avatar 
              src={post.userProfileImageUrl}
              alt={post.userName}
              className="w-14 h-14"
              fallbackSizeClass="text-xl"
            />
            <div>
              {post.userId ? (
                <UserPopover userId={post.userId} userName={post.userName}>
                  <p className="font-black text-lg text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{post.userName}</p>
                </UserPopover>
              ) : (
                <p className="font-black text-lg text-gray-900 dark:text-gray-100">{post.userName}</p>
              )}
              <p className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-2">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span>조회수 {post.viewCount}</span>
              </p>
            </div>
          </div>
          
          {canControlPost && (
            <div className="flex items-center gap-3">
              {isPostAuthor && (
                <button 
                  onClick={() => navigate(`/community/post/edit/${post.postId}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <EditIcon size={12} /> 수정
                </button>
              )}
              <button 
                onClick={handleDeletePost}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <TrashIcon size={12} /> 삭제
              </button>
            </div>
          )}
        </header>
        
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg font-medium leading-loose text-gray-800 dark:text-gray-200 mb-10 whitespace-pre-wrap">
            {post.content}
          </p>

          {post.images && post.images.length > 0 && (
            <div className="mb-12 flex flex-col items-center gap-6">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt="Attached" className="max-w-full max-h-125 rounded-2xl border border-gray-100 dark:border-[#1a1a1a] object-contain shadow-md" />
              ))}
            </div>
          )}

          {/* 공부 지표 스냅샷 카드 */}
          {post.studyTotalIndicator && (
            <div className="mb-12 p-6 sm:p-8 bg-linear-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 border border-indigo-100/80 dark:border-indigo-900/30 rounded-3xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/5 backdrop-blur-xs">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">학습 공부 인증</h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">게시글 작성 시점의 스터디 핵심 지표 스냅샷입니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* 총 집중 시간 */}
                <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>총 학습 집중 시간
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      {Math.floor(post.studyTotalIndicator.totalFocusedTime / 3600)}
                    </span>
                    <span className="text-xs font-black text-gray-500">시간</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white ml-1">
                      {Math.floor((post.studyTotalIndicator.totalFocusedTime % 3600) / 60)}
                    </span>
                    <span className="text-xs font-black text-gray-500">분</span>
                  </div>
                </div>

                {/* 진도 완료율 */}
                <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>진도 완료율
                  </span>
                  <div className="mt-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {post.studyTotalIndicator.studyCompletionRate}
                      </span>
                      <span className="text-xs font-black text-gray-500">%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${post.studyTotalIndicator.studyCompletionRate}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* 진도 성공률 */}
                <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>진도 성공률
                  </span>
                  <div className="mt-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {post.studyTotalIndicator.studySuccessRate}
                      </span>
                      <span className="text-xs font-black text-gray-500">%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${post.studyTotalIndicator.studySuccessRate}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* 퀴즈 정답률 */}
                <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>퀴즈 정답률
                  </span>
                  <div className="mt-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {post.studyTotalIndicator.quizCorrectRate}
                      </span>
                      <span className="text-xs font-black text-gray-500">%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${post.studyTotalIndicator.quizCorrectRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 본문과 댓글 영역 사이: 추천 토글 버튼 */}
          <div className="flex justify-center border-b border-gray-100 dark:border-[#1a1a1a] pb-10 mb-10">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-black text-sm transition-all duration-300 shadow-md active:scale-95 hover:scale-[1.02] cursor-pointer ${
                post.isLiked 
                  ? 'bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/20 hover:from-rose-600 hover:to-pink-600'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <svg 
                className={`w-5 h-5 transition-transform ${post.isLiked ? 'scale-110 fill-current text-white' : 'text-gray-400 dark:text-gray-500'}`} 
                fill={post.isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>추천 {post.likeCount}</span>
            </button>
          </div>
          
          <div className="pt-2">
            <h4 className="font-black text-sm uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <MessageSquareIcon size={16} /> Comments ({post.comments?.length || 0})
            </h4>

            {/* 댓글 입력 칸을 댓글 목록 위로 이동 */}
            <div className="mb-8">
              {isAuthenticated ? (
                <div className="p-6 bg-gray-50/80 dark:bg-[#050505] rounded-4xl border border-gray-100 dark:border-[#1a1a1a]">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="따뜻한 댓글을 남겨주세요..."
                      className="grow bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    />
                    <button 
                      onClick={handleAddComment}
                      className="px-10 py-4 sm:py-0 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-sm rounded-2xl active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/20 whitespace-nowrap cursor-pointer"
                    >
                      게시
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-gray-50/80 dark:bg-[#050505] rounded-4xl border border-dashed border-gray-200 dark:border-[#222] text-center">
                  <p className="text-sm font-bold text-gray-500">댓글을 작성하려면 로그인이 필요합니다.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {post.comments?.map(comment => {
                const isCommentAuthor = comment.authorId !== null && Number(comment.authorId) === Number(currentUserId);
                const canControlComment = isCommentAuthor || isAdmin;

                return (
                  <div key={comment.commentId} className="bg-gray-50/80 dark:bg-[#050505] p-6 sm:p-8 rounded-4xl border border-gray-100 dark:border-[#1a1a1a] relative group">
                    <div className="flex justify-between items-center mb-4">
                      {comment.authorId ? (
                        <UserPopover userId={comment.authorId} userName={comment.authorName}>
                          <span className="font-black text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">{comment.authorName}</span>
                        </UserPopover>
                      ) : (
                        <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">{comment.authorName}</span>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {canControlComment && (
                          <div className="flex items-center gap-3">
                            {isCommentAuthor && (
                              <button onClick={() => { setEditingCommentId(comment.commentId); setEditCommentInput(comment.content); }} className="text-gray-400 hover:text-indigo-500 transition-colors">
                                <EditIcon size={14} />
                              </button>
                            )}
                            <button onClick={() => handleDeleteComment(comment.commentId)} className="text-gray-400 hover:text-rose-500 transition-colors">
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {editingCommentId === comment.commentId ? (
                      <div className="flex gap-3 mt-4">
                        <input 
                          type="text" 
                          value={editCommentInput}
                          onChange={(e) => setEditCommentInput(e.target.value)}
                          className="grow bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={() => handleUpdateComment(comment.commentId)} className="px-6 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors">저장</button>
                        <button onClick={() => setEditingCommentId(null)} className="px-6 bg-gray-200 dark:bg-[#222] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-300 dark:hover:bg-[#333] transition-colors">취소</button>
                      </div>
                    ) : (
                      <p className="text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                    )}
                  </div>
                );
              })}
              
              {(!post.comments || post.comments.length === 0) && (
                <div className="text-center py-12 bg-gray-50/50 dark:bg-[#050505]/50 rounded-4xl border border-dashed border-gray-200 dark:border-[#222]">
                  <p className="text-sm font-bold text-gray-400">첫 댓글을 남겨보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
