import { Card } from '../../../components/common/Card';
import { ThumbsUpIcon, MessageSquareIcon, RocketIcon } from '../../../components/ui/Icons';
import type { PostListResponse } from '../types/PostTypes';

import UserPopover from '../../../components/common/UserPopover';
import Avatar from '../../../components/common/Avatar';

interface PostCardProps {
  post: PostListResponse;
  onClick: () => void;
}

export function PostCard({
  post,
  onClick,
}: PostCardProps) {


  return (
    <Card onClick={onClick} className="py-5 px-8 group hover:border-indigo-200 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar 
            src={post.userProfileImageUrl}
            alt={post.userName}
            className="w-12 h-12"
            fallbackSizeClass="text-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              {post.userId ? (
                <UserPopover userId={post.userId} userName={post.userName}>
                  <span className="font-black text-[1rem] hover:underline cursor-pointer">{post.userName}</span>
                </UserPopover>
              ) : (
                <span className="font-black text-[1rem]">{post.userName}</span>
              )}
              {post.isNotice && (
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-full text-[0.65rem] font-black uppercase tracking-wider flex items-center gap-1">
                  <RocketIcon size={10} /> Notice
                </span>
              )}
            </div>
            <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest block mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-gray-900 dark:text-white text-xl font-bold leading-relaxed mb-2 pl-1 line-clamp-2">
        {post.title}
      </h3>

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2 text-gray-400 font-black text-xs">
          <ThumbsUpIcon size={18} /> {post.likeCount}
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-black text-xs">
          <MessageSquareIcon size={18} /> {post.commentCount}
        </div>
      </div>
    </Card>
  );
}

