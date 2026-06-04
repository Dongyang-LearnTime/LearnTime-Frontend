import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile, updateProfile } from "./api/profileApi";
import { useAuthStore } from "../../store/useAuthStore";
import { usePageTitle } from "../../hooks/usePageTitle";
import Avatar from "../../components/common/Avatar";
import { sendFriendRequestApi, deleteFriendApi, acceptFriendRequestApi, rejectFriendRequestApi, cancelFriendRequestApi } from "../community/api/friendRequestApi";

import type { ProfileResponse, ProfileVisibility } from "./types/ProfileTypes";
import type { PostListResponse } from "../community/types/PostTypes";
import { getBadgeImage, getTierImage } from "../../utils/gamificationAssets";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const currentUserId = useAuthStore((state) => state.userId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState<ProfileVisibility>("PUBLIC");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  usePageTitle(profile ? `${profile.name}님의 프로필` : "프로필");

  const fetchProfileData = () => {
    if (!userId) return;
    setIsLoading(true);
    setErrorStatus(null);
    getProfile(userId)
      .then((data) => {
        if (!isMountedRef.current) return;
        setProfile(data);
        setEditDescription(data.description || "");
        setEditVisibility(data.profileVisibility);
        setEditImagePreview(data.profileImageUrl || null);
        setEditImageFile(null);
        setIsImageDeleted(false);
      })
      .catch((err) => {
        if (!isMountedRef.current) return;
        setErrorStatus(err.response?.status || 500);
      })
      .finally(() => {
        if (!isMountedRef.current) return;
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({
        description: editDescription,
        profileVisibility: editVisibility,
        isImageDeleted: isImageDeleted,
      }, editImageFile);
      setIsEditModalOpen(false);
      fetchProfileData(); // 수정 후 데이터 리로드
    } catch (error) {
      alert("프로필 수정에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInviteFriend = async () => {
    if (!profile) return;
    try {
      await sendFriendRequestApi(profile.userId);
      alert("친구 초대를 보냈습니다.");
      fetchProfileData();
    } catch (error) {
      alert("친구 초대에 실패했습니다.");
    }
  };

  const handleDeleteFriend = async () => {
    if (!profile) return;
    if (!window.confirm("정말 친구를 삭제하시겠습니까?")) return;
    try {
      await deleteFriendApi(profile.userId);
      alert("친구 삭제가 완료되었습니다.");
      fetchProfileData();
    } catch (error) {
      alert("친구 삭제에 실패했습니다.");
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!profile || profile.pendingFriendRequestId === null) return;
    try {
      await acceptFriendRequestApi(profile.pendingFriendRequestId);
      alert("친구 요청을 수락했습니다.");
      fetchProfileData();
    } catch (error) {
      alert("친구 요청 수락에 실패했습니다.");
    }
  };

  const handleRejectFriendRequest = async () => {
    if (!profile || profile.pendingFriendRequestId === null) return;
    if (!window.confirm("친구 요청을 거절하시겠습니까?")) return;
    try {
      await rejectFriendRequestApi(profile.pendingFriendRequestId);
      alert("친구 요청을 거절했습니다.");
      fetchProfileData();
    } catch (error) {
      alert("친구 요청 거절에 실패했습니다.");
    }
  };

  const handleCancelFriendRequest = async () => {
    if (!profile || profile.pendingFriendRequestId === null) return;
    if (!window.confirm("보낸 친구 요청을 취소하시겠습니까?")) return;
    try {
      await cancelFriendRequestApi(profile.pendingFriendRequestId);
      alert("친구 요청을 취소했습니다.");
      fetchProfileData();
    } catch (error) {
      alert("친구 요청 취소에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorStatus === 403) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-[50vh]">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-bold mb-3 dark:text-white">비공개 프로필입니다</h2>
        <p className="text-gray-500 dark:text-gray-400">이 사용자의 프로필은 비공개로 설정되어 있습니다.</p>
      </div>
    );
  }

  if (!profile || errorStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-[50vh]">
        <h2 className="text-xl font-bold mb-3 dark:text-white">프로필을 찾을 수 없습니다</h2>
        <p className="text-gray-500 dark:text-gray-400">존재하지 않거나 삭제된 사용자입니다.</p>
      </div>
    );
  }

  const isOwner = String(currentUserId) === String(userId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 좌측 사이드바: 아바타 및 유저 정보 */}
        <div className="md:w-1/4 flex flex-col items-center md:items-start">
          <Avatar 
            src={profile.profileImageUrl}
            alt={profile.name}
            className="w-64 h-64 md:w-full md:h-auto md:aspect-square mb-6"
            fallbackSizeClass="text-6xl"
          />
          
          <div className="w-full text-center md:text-left mb-6">
            <h1 className="text-2xl font-bold dark:text-white">{profile.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                {profile.friendCount} 친구
              </span>
              <span>•</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{profile.point} P</span>
            </div>
          </div>
          
          <div className="w-full mb-6 flex flex-col gap-3">
            {isOwner && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#21262d] dark:hover:bg-[#30363d] dark:text-[#c9d1d9] border border-gray-300 dark:border-[rgba(240,246,252,0.1)] rounded-md text-sm font-semibold transition-colors duration-200"
              >
                프로필 수정
              </button>
            )}
            {isAuthenticated && !isOwner && (
              profile.isFriend ? (
                // 1. 이미 친구인 경우 (친구 삭제 노출)
                <button 
                  onClick={handleDeleteFriend}
                  className="w-full py-1.5 px-3 bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-300 dark:border-rose-900/40 dark:hover:bg-rose-950/20 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  친구 삭제
                </button>
              ) : profile.hasPendingReceivedRequest ? (
                // 2. 나한테 대기 중인 친구 요청이 온 경우 (수락/거절 노출)
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={handleAcceptFriendRequest}
                    className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer text-center"
                  >
                    수락
                  </button>
                  <button 
                    onClick={handleRejectFriendRequest}
                    className="flex-1 py-1.5 px-3 bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer text-center"
                  >
                    거절
                  </button>
                </div>
              ) : profile.hasPendingSentRequest ? (
                // 3. 내가 친구 초대를 보내고 상대 수락 대기 중인 경우 (요청 취소 노출)
                <button 
                  onClick={handleCancelFriendRequest}
                  className="w-full py-1.5 px-3 bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  요청 취소
                </button>
              ) : (
                // 4. 아무런 관계가 없는 경우 (친구 초대 노출)
                <button 
                  onClick={handleInviteFriend}
                  className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer"
                >
                  친구 초대
                </button>
              )
            )}
          </div>
          
          {profile.description && (
            <div className="mb-6 w-full text-center md:text-left">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{profile.description}</p>
            </div>
          )}

          <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-800">
            {profile.tierName && (
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Tier</span>
                <div className="flex items-center">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-[rgba(99,102,241,0.1)] border border-indigo-200 dark:border-[rgba(99,102,241,0.2)] rounded-md text-xs font-bold text-indigo-700 dark:text-indigo-300 w-fit">
                    <img src={getTierImage(profile.tierName)} alt={profile.tierName} className="w-6 h-6" />
                    <span>{profile.tierName}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Badges</span>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {profile.badges && profile.badges.length > 0 ? (
                  profile.badges.map((badge, idx) => (
                    <div key={idx} className="relative group cursor-help">
                      <img 
                        src={getBadgeImage(badge.badgeType)} 
                        alt={badge.displayName} 
                        className="w-16 h-16 hover:scale-110 transition-transform duration-150" 
                      />
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md">
                        {badge.displayName}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">보유한 뱃지가 없습니다.</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 우측 메인 영역 */}
        <div className="md:w-3/4 mt-8 md:mt-0">
          <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button className="border-indigo-500 text-gray-900 dark:text-white whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2">
                최근 작성한 게시글
              </button>
            </nav>
          </div>
          
          <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-lg shadow-sm overflow-hidden">
            {profile.recentPosts && profile.recentPosts.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {profile.recentPosts.map((post: PostListResponse) => (
                  <li key={post.postId} className="p-4 hover:bg-gray-50 dark:hover:bg-[#21262d] transition-colors">
                    <Link to={`/community/post/${post.postId}`} className="block">
                      <div className="flex items-center gap-2 mb-1">
                        {post.isNotice && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded">공지</span>
                        )}
                        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">{post.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>조회 {post.viewCount}</span>
                        <span>좋아요 {post.likeCount}</span>
                        <span>댓글 {post.commentCount}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center py-16 text-sm">
                <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p>최근 작성한 게시글이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161b22] rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-[#30363d]">
            <div className="p-4 border-b border-gray-200 dark:border-[#30363d] flex justify-between items-center bg-gray-50 dark:bg-[#21262d]">
              <h3 className="text-lg font-bold dark:text-white">프로필 수정</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">프로필 이미지</label>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={!isImageDeleted ? editImagePreview : null}
                    alt={profile?.name || ''}
                    className="w-16 h-16"
                    fallbackSizeClass="text-xl"
                  />
                  <div className="flex flex-col gap-2 flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditImageFile(file);
                          setEditImagePreview(URL.createObjectURL(file));
                          setIsImageDeleted(false);
                        }
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 cursor-pointer"
                    />
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditImageFile(null);
                          setEditImagePreview(null);
                          setIsImageDeleted(true);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded font-medium transition-colors"
                      >
                        이미지 삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">한 줄 소개</label>
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="자기소개를 입력해주세요."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#0d1117] dark:text-white resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">공개 여부</label>
                <select 
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value as ProfileVisibility)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#0d1117] dark:text-white"
                >
                  <option value="PUBLIC">전체 공개</option>
                  <option value="PRIVATE">비공개</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-[#30363d] flex justify-end gap-2 bg-gray-50 dark:bg-[#21262d]">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-[#30363d] text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#30363d] transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
