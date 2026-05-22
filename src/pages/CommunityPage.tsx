// 커뮤니티 광장 메인 페이지 (게시판 CRUD 및 보상 관리)
import React, { useState, useMemo } from 'react';
import {
  PlusIcon, SearchIcon, SparklesIcon, ThumbsUpIcon, BadgeIcon
} from '../components/ui/Icons';
import {
  CommunityHeader, GlobalRankingBox, RewardMilestoneBox, BadgeCollectionBox,
  PostCard, PostDetailModal, PostWriteModal, REWARDS
} from '../components/section/community';
import type { Post, Comment, User } from '../components/section/community';

export function CommunityPage() {
  // 게시물 목록
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: '열공러77',
      content: '오늘 5시간 몰입 성공! 미적분 드디어 이해되네요.',
      likes: 24,
      comments: 2,
      timestamp: '10분 전',
      badge: 'diamond',
      commentsList: [
        { id: 'c1', author: '수학귀신', content: '축하드려요! 저도 얼른 이해하고 싶네요 ㅎㅎ', timestamp: '5분 전' },
        { id: 'c2', author: '근성장마스터', content: '공부 근성 대단하십니다!', timestamp: '2분 전' }
      ]
    },
    { id: '2', author: '근성장마스터', content: '하체 데이 끝... 내일 걸을 수 있을지 모르겠네요.', likes: 42, comments: 0, timestamp: '30분 전', badge: 'obsidian', commentsList: [] },
    { id: '3', author: '습관요정', content: '30일 루틴 달성 보상으로 오토바이 배지 땄습니다!', likes: 15, comments: 0, timestamp: '1시간 전', badge: 'silver', commentsList: [] },
  ]);

  // 글로벌 랭킹 데이터
  const [ranking] = useState<User[]>([
    { id: '1', name: '근성장마스터', points: 2450, rank: 1 },
    { id: '2', name: '열공러77', points: 1820, rank: 2 },
    { id: '3', name: '습관요정', points: 450, rank: 3 },
    { id: '4', name: '루틴왕', points: 320, rank: 4 },
  ]);

  // 현재 접속 유저 정보
  const [currentUser] = useState({
    name: '나의 계정',
    points: 1250,
  });

  // 상태 관리: 글쓰기 모달, 수정 상태 및 포스트 상세 보기
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // 유저 모빌리티 등급 계산
  const currentLevelIdx = useMemo(() => {
    const idx = [...REWARDS].reverse().findIndex(r => currentUser.points >= r.threshold);
    return idx === -1 ? 0 : REWARDS.length - 1 - idx;
  }, [currentUser.points]);

  const currentLevel = REWARDS[currentLevelIdx];

  // 새 글 업로드 및 기존 글 수정 핸들러
  const handleSavePost = () => {
    if (!newPostContent.trim()) return;
    if (editingPostId) {
      setPosts(posts.map(p => p.id === editingPostId ? { ...p, content: newPostContent } : p));
    } else {
      const newPost: Post = {
        id: Date.now().toString(),
        author: currentUser.name,
        content: newPostContent,
        likes: 0,
        comments: 0,
        timestamp: '방금 전',
        badge: currentLevel.level.toLowerCase(),
        commentsList: []
      };
      setPosts([newPost, ...posts]);
    }
    setNewPostContent('');
    setEditingPostId(null);
    setIsPostModalOpen(false);
  };

  // 상세 모달에서 댓글 등록 핸들러
  const handleAddComment = () => {
    if (!commentInput.trim() || !selectedPost) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser.name,
      content: commentInput,
      timestamp: '방금 전'
    };

    const updatedPost = {
      ...selectedPost,
      comments: (selectedPost.comments || 0) + 1,
      commentsList: [...(selectedPost.commentsList || []), newComment]
    };

    setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
    setSelectedPost(updatedPost);
    setCommentInput('');
  };

  // 피드 게시글 삭제
  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  // 편집 모달 활성화
  const openEditModal = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPostId(post.id);
    setNewPostContent(post.content);
    setIsPostModalOpen(true);
  };

  // 주간 인기글 계산
  const topPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 2);
  }, [posts]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-10">
      {
        // 상단 타이틀 및 모빌리티 레벨 카드 헤더
      }
      <CommunityHeader
        currentLevelIdx={currentLevelIdx}
        currentLevelName={currentLevel.name}
        userPoints={currentUser.points}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {
          // 좌측 피드 및 포스트 작성 영역
        }
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-grow max-w-md">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] pl-14 pr-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => { setEditingPostId(null); setNewPostContent(''); setIsPostModalOpen(true); }}
              className="ml-4 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2"
            >
              <PlusIcon size={18} /> 포스팅
            </button>
          </div>

          {
            // 주간 인기글
          }
          <div className="mb-10">
            <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
              <span className="text-rose-500"><SparklesIcon size={20} /></span> 주간 인기글 랭킹
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPosts.map((post, idx) => (
                <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-gradient-to-br from-indigo-50 to-rose-50 dark:from-[#111] dark:to-[#1a1a1a] p-5 rounded-[2rem] border border-indigo-100 dark:border-[#222] hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl font-black text-indigo-200 dark:text-indigo-900 italic">0{idx + 1}</span>
                    <BadgeIcon level={post.badge} size={52} />
                  </div>
                  <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-500">{post.author}</span>
                    <span className="flex items-center gap-1 text-rose-500 font-black text-xs"><ThumbsUpIcon size={14} /> {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {
            // 최신 피드 리스트
          }
          <div className="space-y-6">
            <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2 text-gray-500">최신 피드</h3>
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserName={currentUser.name}
                onClick={() => setSelectedPost(post)}
                onEdit={(e) => openEditModal(post, e)}
                onDelete={(e) => { e.stopPropagation(); deletePost(post.id); }}
              />
            ))}
          </div>
        </div>

        {
          // 우측 사이드바: 랭킹 및 마일스톤 리워드 정보
        }
        <div className="xl:col-span-4 space-y-8">
          <GlobalRankingBox ranking={ranking} />
          <RewardMilestoneBox userPoints={currentUser.points} />
          <BadgeCollectionBox />
        </div>
      </div>

      {
        // 모달: 게시글 상세 보기 모달
      }
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          commentInput={commentInput}
          onCommentInputChange={setCommentInput}
          onAddComment={handleAddComment}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {
        // 모달: 글쓰기 및 편집 모달
      }
      {isPostModalOpen && (
        <PostWriteModal
          editingPostId={editingPostId}
          content={newPostContent}
          onContentChange={setNewPostContent}
          onSave={handleSavePost}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
    </div>
  );
}

