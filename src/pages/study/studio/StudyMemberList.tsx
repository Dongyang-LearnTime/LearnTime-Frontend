import { useEffect, useState } from "react";
import { getStudyMemberListApi, getStudyOwnerFriendListApi, inviteStudyMemberApi, changeStudyOwnerApi, leaveStudyApi, kickStudyMemberApi } from "../api/studyStudioApi";
import type { StudyMemberResponse, StudyMemberFriendResponse } from "../types/StudyTypes";
import { Card, CardTitle } from "../../../components/common/Card";
import { UsersIcon, PlusIcon, XIcon } from "../../../components/ui/Icons";
import { useAuthStore } from "../../../store/useAuthStore";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";
import UserPopover from "../../../components/common/UserPopover";
import Avatar from "../../../components/common/Avatar";
import { toast } from '../../../utils/toast';

interface StudyMemberListProps {
  studyId: string;
}

export default function StudyMemberList({ studyId }: StudyMemberListProps) {
  const userId = useAuthStore((state) => state.userId);
  const [members, setMembers] = useState<StudyMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [friends, setFriends] = useState<StudyMemberFriendResponse[]>([]);
  const [isFriendsLoading, setIsFriendsLoading] = useState(false);
  const [friendSearchTerm, setFriendSearchTerm] = useState("");

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveInput, setLeaveInput] = useState("");
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStudyMemberListApi(studyId);
        setMembers(data);
      } catch (err: any) {
        console.error("Failed to fetch study members:", err);
        setError("스터디 멤버 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [studyId]);

  const handleChangeOwner = async (newOwnerMemberId: number, newOwnerName: string) => {
    if (!window.confirm(`${newOwnerName} 님에게 방장 권한을 위임하시겠습니까?`)) {
      return;
    }
    
    try {
      await changeStudyOwnerApi(Number(studyId), newOwnerMemberId);
      toast.success("방장 권한이 성공적으로 위임되었습니다.");
      window.location.reload(); // 권한 재적용을 위해 새로고침
    } catch (err) {
      const errorMsg = getApiErrorUtil(err) || "방장 권한 위임 중 오류가 발생했습니다.";
      toast.info(errorMsg);
    }
  };

  const handleOpenInviteModal = async () => {
    setIsInviteModalOpen(true);
    setIsFriendsLoading(true);
    try {
      const data = await getStudyOwnerFriendListApi(studyId);
      setFriends(data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    } finally {
      setIsFriendsLoading(false);
    }
  };

  const handleInvite = async (friendUserId: number) => {
    try {
      await inviteStudyMemberApi(
          Number(studyId),
          friendUserId
      );
      toast.info("초대 요청을 보냈습니다.");
      setIsInviteModalOpen(false);
    } catch (err) {
      const errorMsg = getApiErrorUtil(err) || "초대에 실패했습니다.";
      toast.info(errorMsg);
    }
  };

  const handleLeaveStudy = async () => {
    if (leaveInput !== "스터디 탈퇴") return;
    setIsLeaving(true);
    setLeaveError(null);
    try {
      await leaveStudyApi(Number(studyId));
      toast.info("스터디에서 탈퇴했습니다.");
      window.location.href = "/"; // 메인화면으로 이동
    } catch (err) {
      const errorMsg = getApiErrorUtil(err) || "탈퇴 처리 중 오류가 발생했습니다.";
      setLeaveError(errorMsg);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleKickMember = async (memberIdToKick: number, memberName: string) => {
    if (!window.confirm(`${memberName} 님을 스터디에서 강퇴하시겠습니까?`)) return;
    try {
      await kickStudyMemberApi(Number(studyId), memberIdToKick);
      toast.info(`${memberName} 님이 강퇴되었습니다.`);
      setMembers(members.map(m => m.userId === memberIdToKick ? { ...m, status: "WITHDRAWN" } : m));
    } catch (err) {
      const errorMsg = getApiErrorUtil(err) || "강퇴 처리 중 오류가 발생했습니다.";
      toast.info(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <Card className="min-h-50 overflow-hidden group">
        <CardTitle icon={<UsersIcon size={18} />} className="mb-6">스터디 멤버 목록</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-28 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl"></div>
          <div className="h-28 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl"></div>
          <div className="h-28 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="min-h-50 flex items-center justify-center bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40">
        <span className="text-sm font-bold text-rose-500">{error}</span>
      </Card>
    );
  }

  // userId 타입 차이 방지를 위해 Number()로 명시적 변환 후 비교
  const isOwner = members.some((m) => Number(m.userId) === Number(userId) && m.studyMemberRole === "OWNER");
  const activeCount = members.filter((m) => m.status === "ACTIVE").length;
  const canInvite = activeCount < 4;

  return (
    <>
      <Card className="relative group border-0 shadow-none bg-transparent">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <CardTitle icon={<UsersIcon size={18} />} className="mb-0">스터디 멤버</CardTitle>
          <div className="flex items-center gap-2">
            {!isOwner && (
              <button
                onClick={() => {
                  setLeaveInput("");
                  setLeaveError(null);
                  setIsLeaveModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-sm font-black transition-all bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40 cursor-pointer"
              >
                스터디 탈퇴
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleOpenInviteModal}
                disabled={!canInvite}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all shadow-sm ${
                  canInvite 
                    ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400 hover:-translate-y-0.5 hover:shadow-indigo-500/30 cursor-pointer" 
                    : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
                }`}
                title={!canInvite ? "최대 활성화 멤버 4명을 초과할 수 없습니다." : "친구 초대"}
              >
                <PlusIcon size={16} /> 새로운 멤버 초대
              </button>
            )}
          </div>
        </div>
        
        {members.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-3xl">
            <p className="text-sm font-bold text-gray-400">스터디 멤버가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {members.map((member) => (
              <div 
                key={member.studyMemberId} 
                className="flex items-center gap-4 p-5 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-2xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group/card"
              >
                {/* 프로필 이미지 (Avatar 컴포넌트로 대체) */}
                <Avatar 
                  src={member.profileImageUrl}
                  alt={member.userName}
                  className="w-12 h-12"
                  fallbackSizeClass="text-lg"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <UserPopover userId={member.userId} userName={member.userName} hasBlocked={member.hasBlocked}>
                      <h4 className="text-sm font-black text-gray-900 dark:text-white truncate cursor-pointer hover:underline">{member.userName}</h4>
                    </UserPopover>
                    {member.studyMemberRole === "OWNER" && (
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                        방장
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 ${
                        member.status === "ACTIVE" ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {member.status === "ACTIVE" ? "활동 중" : "탈퇴"}
                      </span>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <span>{new Date(member.joinedAt).toLocaleDateString()} 가입</span>
                    </div>
                    {/* 방장일 때만 다른 사용자에게 방장 위임 버튼 및 강퇴 버튼 표시 */}
                    {isOwner && Number(member.userId) !== Number(userId) && member.status === "ACTIVE" && (
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100 transition-all">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangeOwner(member.userId, member.userName);
                          }}
                          className="px-2 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md hover:bg-indigo-100 transition-all cursor-pointer shrink-0"
                        >
                          방장 위임
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleKickMember(member.userId, member.userName);
                          }}
                          className="px-2 py-1 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 rounded-md hover:bg-rose-100 transition-all cursor-pointer shrink-0"
                        >
                          강퇴
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 초대 모달 */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">친구 초대</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            {/* 친구 이름 검색창 */}
            <div className="mb-4 relative">
              <input 
                type="text" 
                value={friendSearchTerm}
                onChange={(e) => setFriendSearchTerm(e.target.value)}
                placeholder="친구 이름 검색..."
                className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#111] transition-all dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>

            {isFriendsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 dark:border-indigo-900 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-400">친구 목록을 불러오는 중...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                  <UsersIcon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">초대할 친구가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {friends
                  .filter((friend) => friend.name.toLowerCase().includes(friendSearchTerm.toLowerCase()))
                  .map(friend => {
                  const isAlreadyMember = members.some(m => m.userId === friend.userId && m.status === "ACTIVE");
                  const isInvited = friend.isInvited;
                  const disableInvite = isAlreadyMember || isInvited;

                  let buttonText = "초대하기";
                  if (isAlreadyMember) buttonText = "참여 중";
                  else if (isInvited) buttonText = "초대 완료";

                  return (
                    <div key={friend.friendId} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#1a1a1a] hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={friend.profileImageUrl}
                          alt={friend.name}
                          className="w-10 h-10"
                          fallbackSizeClass="text-sm"
                        />
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-0.5">{friend.name}</p>
                          <p className="text-[10px] font-bold text-gray-400">{friend.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(friend.userId)}
                        disabled={disableInvite}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          disableInvite
                            ? "bg-gray-200 dark:bg-[#222] text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-indigo-500/20 hover:-translate-y-0.5"
                        }`}
                      >
                        {buttonText}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 스터디 탈퇴 모달 */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] rounded-4xl border border-gray-100 dark:border-[#1a1a1a] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                스터디 탈퇴
              </h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors cursor-pointer">
                <XIcon size={18} />
              </button>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 mb-4">
              <p className="font-bold text-rose-600 dark:text-rose-400 mb-1">정말로 스터디를 탈퇴하시겠습니까?</p>
              <p className="text-xs">탈퇴 시 본 스터디의 학습 기록, 필기 목록, 퀴즈 기록 등 모든 데이터에 더 이상 접근할 수 없습니다.</p>
            </div>

            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              탈퇴를 확인하려면 아래에 <span className="text-rose-500 font-black">스터디 탈퇴</span>라고 정확히 입력하세요.
            </p>

            <input
              type="text"
              value={leaveInput}
              onChange={(e) => setLeaveInput(e.target.value)}
              placeholder="스터디 탈퇴"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 mb-3 transition-all"
            />

            {leaveError && <p className="text-xs text-red-500 font-bold mb-3">{leaveError}</p>}

            <div className="flex gap-2">
              <button onClick={() => setIsLeaveModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                취소
              </button>
              <button
                onClick={handleLeaveStudy}
                disabled={leaveInput !== "스터디 탈퇴" || isLeaving}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLeaving ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
