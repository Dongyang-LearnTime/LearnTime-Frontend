import { useState, useRef, useEffect } from "react";
import type { StudyPlanResponse } from "../../types/StudyTypes";
import { EditIcon, CheckIcon, XIcon } from "lucide-react";
import FormattedPlanContent from "./FormattedPlanContent";

interface DailyProgressProps {
  data: StudyPlanResponse;
  isOwner?: boolean;
  /** 인라인 편집 완료 시 호출되는 비동기 핸들러. type: 수정 대상, newValue: 새 제목 */
  onUpdateTitle?: (type: "title" | "bookTitle", newValue: string) => Promise<void>;
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

/** 인라인 편집 가능한 제목 셀 컴포넌트 */
interface InlineTitleCellProps {
  value: string;
  isOwner: boolean;
  isUpdating: boolean;
  onConfirm: (newValue: string) => Promise<void>;
  placeholder: string;
}

function InlineTitleCell({ value, isOwner, isUpdating, onConfirm, placeholder }: InlineTitleCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부에서 value가 변경될 경우(저장 성공 후 상위에서 상태 갱신) draft 동기화
  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [value, isEditing]);

  // 편집 모드 진입 시 인풋에 자동 포커스
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEnterEditMode = () => {
    if (!isOwner || isUpdating) return;
    setDraft(value);
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === value) {
      // 변경 없거나 빈 값이면 취소 처리
      setDraft(value);
      setIsEditing(false);
      return;
    }
    await onConfirm(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // onBlur: 확인 버튼 클릭과 충돌하지 않도록 setTimeout으로 처리
  const handleBlur = () => {
    setTimeout(() => {
      if (isEditing) handleConfirm();
    }, 150);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={100}
          disabled={isUpdating}
          className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-[#111] border border-indigo-300 dark:border-indigo-600 rounded-lg text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
        />
        {/* 확인 버튼 */}
        <button
          onMouseDown={(e) => e.preventDefault()} // blur가 먼저 실행되는 것을 방지
          onClick={handleConfirm}
          disabled={isUpdating}
          className="p-1.5 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors"
          title="저장"
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-600 rounded-full animate-spin" />
          ) : (
            <CheckIcon size={14} />
          )}
        </button>
        {/* 취소 버튼 */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleCancel}
          disabled={isUpdating}
          className="p-1.5 text-gray-400 hover:text-rose-500 disabled:opacity-50 transition-colors"
          title="취소 (ESC)"
        >
          <XIcon size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group/title">
      <span
        className={isOwner ? "cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" : ""}
        onClick={handleEnterEditMode}
        title={isOwner ? "클릭하여 수정" : undefined}
      >
        {value || "정보 없음"}
      </span>
      {isOwner && (
        <button
          onClick={handleEnterEditMode}
          className="p-1 text-gray-300 group-hover/title:text-indigo-500 hover:text-indigo-600 opacity-0 group-hover/title:opacity-100 transition-all"
          title="제목 수정"
        >
          <EditIcon size={14} />
        </button>
      )}
    </div>
  );
}

export default function DailyProgress({ data, isOwner, onUpdateTitle }: DailyProgressProps) {
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

  // 인라인 편집 중 로딩 상태 (두 필드 각각 관리)
  const [isTitleUpdating, setIsTitleUpdating] = useState(false);
  const [isBookTitleUpdating, setIsBookTitleUpdating] = useState(false);

  const handleConfirmTitle = async (newValue: string) => {
    if (!onUpdateTitle) return;
    setIsTitleUpdating(true);
    try {
      await onUpdateTitle("title", newValue);
    } finally {
      setIsTitleUpdating(false);
    }
  };

  const handleConfirmBookTitle = async (newValue: string) => {
    if (!onUpdateTitle) return;
    setIsBookTitleUpdating(true);
    try {
      await onUpdateTitle("bookTitle", newValue);
    } finally {
      setIsBookTitleUpdating(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <InfoRow label="진도 제목">
          <InlineTitleCell
            value={studyTitle || ""}
            isOwner={!!isOwner && !!onUpdateTitle}
            isUpdating={isTitleUpdating}
            onConfirm={handleConfirmTitle}
            placeholder="스터디 진도 제목 입력"
          />
        </InfoRow>

        <InfoRow label="책 제목">
          <InlineTitleCell
            value={bookTitle || ""}
            isOwner={!!isOwner && !!onUpdateTitle}
            isUpdating={isBookTitleUpdating}
            onConfirm={handleConfirmBookTitle}
            placeholder="책 제목 입력"
          />
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
            <FormattedPlanContent planContent={planContent} />
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