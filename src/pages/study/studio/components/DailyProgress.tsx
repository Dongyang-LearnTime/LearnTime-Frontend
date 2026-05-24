import type { StudyPlanResponse } from "../../types/StudyTypes";

import { EditIcon } from "lucide-react";

interface DailyProgressProps {
  data: StudyPlanResponse;
  isOwner?: boolean;
  onEditTitle?: (type: "title" | "bookTitle", currentValue: string) => void;
}

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
}

// 렌더링마다 객체가 재생성되지 않도록 컴포넌트 외부 상수로 분리
const PROGRESS_STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "시작 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const COMPLETION_STATUS_LABEL: Record<string, string> = {
  SUCCESS: "성공",
  FAILURE: "실패",
};

const DAY_MAP: Record<string, string> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일"
};

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-4 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0 gap-2 sm:gap-6">
      <div className="sm:w-36 shrink-0 font-black text-xs text-gray-400 uppercase tracking-widest pt-1">
        {label}
      </div>
      <div className="flex-1 text-sm font-bold text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function DailyProgress({ data, isOwner, onEditTitle }: DailyProgressProps) {
  const {
    startDate,
    endDate,
    restDays,
    restDates,
    dayNumber,
    planContent,
    focusTime,
    progressStatus,
    completionStatus,
    understandingScore,
    studyTitle,
    bookTitle,
  } = data;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <InfoRow label="진도 제목">
          <div className="flex items-center gap-2">
            <span>{studyTitle || "정보 없음"}</span>
            {isOwner && onEditTitle && (
              <button onClick={() => onEditTitle("title", studyTitle || "")} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="제목 수정">
                <EditIcon size={14} />
              </button>
            )}
          </div>
        </InfoRow>

        <InfoRow label="책 제목">
          <div className="flex items-center gap-2">
            <span>{bookTitle || "정보 없음"}</span>
            {isOwner && onEditTitle && (
              <button onClick={() => onEditTitle("bookTitle", bookTitle || "")} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="책 제목 수정">
                <EditIcon size={14} />
              </button>
            )}
          </div>
        </InfoRow>

        <InfoRow label="스터디 기간">
          <span className="inline-flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400">{startDate}</span>
            <span className="text-gray-400">~</span>
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400">{endDate}</span>
          </span>
        </InfoRow>

        {(restDays.length > 0 || restDates.length > 0) && (
          <InfoRow label="휴무 정보">
            {restDays.length > 0 && <div className="mb-1">휴무 요일: <span className="text-indigo-500">{restDays.map(d => DAY_MAP[d] || d).join(", ")}</span></div>}
            {restDates.length > 0 && <div>휴무 날짜: <span className="text-rose-500">{restDates.join(", ")}</span></div>}
          </InfoRow>
        )}

        <InfoRow label="학습 일차">
          {dayNumber !== null ? (
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-black">{dayNumber}일차</span>
          ) : "정보 없음"}
        </InfoRow>

        <InfoRow label="학습 계획 내용">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 shadow-sm text-sm">
            {planContent || "등록된 학습 계획이 없습니다."}
          </div>
        </InfoRow>

        <InfoRow label="집중 시간">
          <span className="font-mono text-base font-black tracking-tight">{focusTime || "00:00:00"}</span>
        </InfoRow>

        <InfoRow label="진행 상태">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
            progressStatus === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" :
            progressStatus === "IN_PROGRESS" ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400" :
            "bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400"
          }`}>
            {progressStatus ? PROGRESS_STATUS_LABEL[progressStatus] || progressStatus : "정보 없음"}
          </span>
        </InfoRow>

        <InfoRow label="완료 상태">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
            completionStatus === "SUCCESS" ? "text-emerald-500" :
            completionStatus === "FAILURE" ? "text-rose-500" :
            "text-gray-500"
          }`}>
            {completionStatus && <span className={`w-1.5 h-1.5 rounded-full ${completionStatus === "SUCCESS" ? "bg-emerald-500" : "bg-rose-500"}`} />}
            {completionStatus ? COMPLETION_STATUS_LABEL[completionStatus] || completionStatus : "정보 없음"}
          </span>
        </InfoRow>

        <InfoRow label="이해도 점수">
          {understandingScore !== null ? (
            <span className="text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400">{understandingScore}점</span>
          ) : "평가 안 됨"}
        </InfoRow>
      </div>
    </div>
  );
}