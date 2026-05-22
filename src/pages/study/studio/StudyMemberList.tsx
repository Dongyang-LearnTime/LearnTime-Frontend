import { useEffect, useState } from "react";
import { getStudyMemberListApi } from "../api/StudyStudioApi";
import type { StudyMemberResponse } from "../types/StudyTypes";

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
    return <div className="p-4 text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="p-4 text-gray-500">스터디 멤버가 없습니다.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">스터디 멤버 목록</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">이름</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">역할</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">상태</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">가입일</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.studyMemberId} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-sm text-gray-800">{member.userName}</td>
                <td className="py-2 px-4 text-sm text-gray-800">
                  {member.studyMemberRole === "OWNER" ? "방장" : "멤버"}
                </td>
                <td className="py-2 px-4 text-sm text-gray-800">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      member.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.status === "ACTIVE" ? "활동 중" : "탈퇴"}
                  </span>
                </td>
                <td className="py-2 px-4 text-sm text-gray-800">
                  {new Date(member.joinedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
