import React from 'react';
import { Card } from '../../common/Card';
import { BadgeIcon, EditIcon, TrashIcon, ThumbsUpIcon, MessageSquareIcon } from '../../ui/Icons';
import type { Post } from './types';

// PostCard 컴포넌트의 Props 타입 정의
interface PostCardProps {
  post: Post;
  currentUserName: string;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

// 개별 게시글 피드를 카드 형태로 렌더링하는 컴포넌트
export function PostCard({
  post,
  currentUserName,
  onClick,
  onEdit,
  onDelete,
}: PostCardProps) {
  return (
    <Card onClick={onClick} className="p-8 group hover:border-indigo-200 transition-all cursor-pointer">
      {
        // 상단 작성자 프로필 및 제어 버튼
      }
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <BadgeIcon level={post.badge} size={64} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-[1rem]">{post.author}</span>
            </div>
            <span className="text-[0.65rem] font-bold text-gray-400 uppercase">{post.timestamp}</span>
          </div>
        </div>

        {
          // 본인 작성 글인 경우에만 편집/삭제 버튼 노출 (호버 시 선명해짐)
        }
        {post.author === currentUserName && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-2 text-gray-400 hover:text-indigo-600 transition-all">
              <EditIcon size={16} />
            </button>
            <button onClick={onDelete} className="p-2 text-gray-400 hover:text-rose-500 transition-all">
              <TrashIcon size={16} />
            </button>
          </div>
        )}
      </div>

      {
        // 게시글 본문 내용
      }
      <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed mb-8 pl-1">
        {post.content}
      </p>

      {
        // 하단 반응 버튼 영역 (좋아요, 댓글 수)
      }
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors font-black text-xs">
          <ThumbsUpIcon size={18} /> {post.likes}
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors font-black text-xs">
          <MessageSquareIcon size={18} /> {post.comments}
        </button>
      </div>
    </Card>
  );
}
