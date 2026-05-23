import { useEffect, useState } from "react";
import { getStudyMemberListApi } from "../api/StudyStudioApi";
import type { StudyMemberResponse } from "../types/StudyTypes";
import { Card, CardTitle } from "../../../components/common/Card";
import { UsersIcon } from "../../../components/ui/Icons";

interface StudyMemberListProps {
  studyId: string;
}

export default function StudyMemberList({ studyId }: StudyMemberListProps) {
  const [members, setMembers] = useState<StudyMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <Card className="min-h-[200px] overflow-hidden group">
        <CardTitle icon={<UsersIcon size={18} />} className="mb-6">스터디 멤버 목록</CardTitle>
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="h-10 w-full bg-gray-100 dark:bg-[#111] rounded-xl"></div>
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-xl"></div>
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-xl"></div>
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-xl"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40">
        <span className="text-sm font-bold text-rose-500">{error}</span>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <CardTitle icon={<UsersIcon size={18} />} className="mb-6">스터디 멤버 목록</CardTitle>
      
      {members.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-3xl">
          <p className="text-sm font-bold text-gray-400">스터디 멤버가 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1a1a1a]">
                <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">이름</th>
                <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">역할</th>
                <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">상태</th>
                <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#151515]">
              {members.map((member) => (
                <tr key={member.studyMemberId} className="group/row hover:bg-gray-50/50 dark:hover:bg-[#080808] transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{member.userName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      member.studyMemberRole === "OWNER" 
                        ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400" 
                        : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400"
                    }`}>
                      {member.studyMemberRole === "OWNER" ? "방장" : "멤버"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      member.status === "ACTIVE"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {member.status === "ACTIVE" ? "활동 중" : "탈퇴"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
