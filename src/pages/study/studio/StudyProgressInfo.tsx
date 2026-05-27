import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getStudyPlanApi, startStudyDailyPlanApi, getStudyDailyPlansApi, deleteStudyApi, getStudyMemberListApi, updateStudyTitleApi, updateStudyBookTitleApi } from "../api/studyStudioApi";
import { getMyStudyProgresses } from "../api/studyApi";
import type { StudyPlanResponse, StudyDailyPlanResponse } from "../types/studyTypes";
import DailyProgress from "./components/DailyProgress";
import BaseModal from "../../../components/common/BaseModal";
import PlanCompletionForm from "./components/PlanCompletionForm";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";
import { Card, CardTitle } from "../../../components/common/Card";
import { BookIcon, TrashIcon, CalendarIcon } from "../../../components/ui/Icons";
import { useAuthStore } from "../../../store/useAuthStore";
import { useStudyStore } from "../../../store/useStudyStore";

interface StudyProgressInfoProps {
  studyId: string;
  refreshTrigger?: number;
  onRefreshToday?: () => void;
}

const dayMap: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 구하는 헬퍼 함수
const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function StudyProgressInfo({ studyId, refreshTrigger, onRefreshToday }: StudyProgressInfoProps) {
  // 쿼리 파라미터 연동
  const [searchParams, setSearchParams] = useSearchParams();
  const planDate = searchParams.get("date") || getTodayString();

  // 스터디 진도 목록 전역 갱신 훅
  const fetchProgresses = useStudyStore((state) => state.fetchProgresses);

  // 일일 진도 정보 상태 관리
  const [progressData, setProgressData] = useState<StudyPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 진도 재조정 모달 상태 관리
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [restDays, setRestDays] = useState<string[]>([]);
  const [restDates, setRestDates] = useState<string[]>([]);
  const [tempRestDate, setTempRestDate] = useState("");

  // 모든 진도 및 방장 여부 조회용 상태
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();
  const [allPlans, setAllPlans] = useState<StudyDailyPlanResponse[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [studyTitle, setStudyTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 재조정 모달 오픈 시 기존 설정 불러오기
  useEffect(() => {
    if (isRescheduleModalOpen && progressData) {
      setRestDays(progressData.restDays || []);
      setRestDates(progressData.restDates || []);
    }
  }, [isRescheduleModalOpen, progressData]);

  // (모달 제거됨 — 인라인 편집 방식으로 대체)

  // 모든 진도 목록 및 스터디 정보 조회
  useEffect(() => {
    Promise.all([
      getStudyDailyPlansApi(studyId),
      getStudyMemberListApi(studyId),
      getMyStudyProgresses()
    ]).then(([plansData, membersData, progressesData]) => {
      setAllPlans(plansData);
      const owner = membersData.some(m => Number(m.userId) === Number(userId) && m.studyMemberRole === "OWNER");
      setIsOwner(owner);
      const title = progressesData.find(p => Number(p.studyId) === Number(studyId))?.studyTitle || "스터디 제목";
      setStudyTitle(title);
    }).catch(err => console.error("Failed to fetch additional study info:", err));
  }, [studyId, userId]);

  // planDate 변경에 따른 API 호출
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getStudyPlanApi(studyId, planDate)
      .then((data) => {
        if (isMounted) {
          setProgressData(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load daily study plan:", err);
          setError("일일 공부 진도 정보를 불러오는 데 실패했습니다.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studyId, planDate, refreshTrigger]);

  // 날짜 하루씩 이동 핸들러
  const handleDateChange = (daysToAdd: number) => {
    const current = new Date(planDate);
    current.setDate(current.getDate() + daysToAdd);

    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    const newDateStr = `${yyyy}-${mm}-${dd}`;

    setSearchParams({ date: newDateStr });
  };

  const handleStartPlan = async () => {
    if (!progressData || !progressData.studyDailyPlanId) return;
    setIsStarting(true);
    try {
      await startStudyDailyPlanApi(progressData.studyDailyPlanId);
      setProgressData((prev) => prev ? { ...prev, progressStatus: "IN_PROGRESS" } : null);
      if (onRefreshToday) {
        onRefreshToday();
      }
    } catch (err) {
      alert(getApiErrorUtil(err) || "진도 시작에 실패했습니다.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteSuccess = () => {
    setProgressData((prev) => prev ? { ...prev, progressStatus: "COMPLETED" } : null);
    if (onRefreshToday) {
      onRefreshToday();
    }
  };

  const handleDeleteStudy = async () => {
    if (deleteConfirmText !== studyTitle) return;
    setIsDeleting(true);
    try {
      await deleteStudyApi(studyId);
      alert("스터디가 성공적으로 삭제되었습니다.");
      navigate("/main"); // 삭제 후 메인 화면으로 이동
    } catch (err) {
      alert(getApiErrorUtil(err) || "스터디 삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  };

  /**
   * 인라인 편집 완료 핸들러 (DailyProgress 컴포넌트에서 호출)
   * type: 수정 대상 ('title' | 'bookTitle'), newValue: 새로운 제목 문자열
   */
  const handleUpdateTitleDirect = async (type: "title" | "bookTitle", newValue: string) => {
    const request = {
      studyId: Number(studyId),
      title: newValue
    };

    if (type === "title") {
      await updateStudyTitleApi(request);
    } else {
      await updateStudyBookTitleApi(request);
    }

    // 로컬 상태 즉시 반영
    setProgressData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...(type === "title" ? { studyTitle: newValue } : { bookTitle: newValue })
      };
    });

    if (type === "title") {
      setStudyTitle(newValue);
      // 사이드바 진도 목록을 즉시 리플래시합니다.
      fetchProgresses();
    }
  };

  return (
    <Card className="flex flex-col h-full relative overflow-hidden group min-h-75 border-0 shadow-none bg-transparent">      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <CardTitle icon={<BookIcon size={18} />} className="mb-0">일일 진도 정보</CardTitle>

        {/* 모던 날짜 선택 내비게이션 (Pill 디자인) */}
        <div className="flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-full p-1 shadow-sm">
          <button 
            onClick={() => handleDateChange(-1)} 
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
            title="이전날"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="px-4 text-sm font-black tracking-tight text-gray-900 dark:text-white min-w-27.5 text-center">
            {planDate}
          </div>
          
          <button 
            onClick={() => handleDateChange(1)} 
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all mr-2"
            title="다음날"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          
          <button 
            onClick={() => setSearchParams({ date: getTodayString() })} 
            className="px-3 py-1.5 text-xs font-black bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            오늘
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {isLoading ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-[#1a1a1a] rounded-lg"></div>
            <div className="h-4 w-1/2 bg-gray-100 dark:bg-[#111] rounded-lg"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl mt-4"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-3xl">
            <p className="text-sm font-bold text-rose-500">{error}</p>
          </div>
        ) : progressData ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-3xl p-6 mb-6 shadow-sm">
              <DailyProgress
                data={progressData}
                isOwner={isOwner}
                onUpdateTitle={handleUpdateTitleDirect}
              />
            </div>
            
            {progressData.studyDailyPlanId && (
              <div className="flex justify-end mt-auto pt-4 border-t border-gray-100 dark:border-[#1a1a1a] gap-3">
                {isOwner && (
                  <button
                    onClick={() => setIsRescheduleModalOpen(true)}
                    className="px-6 py-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] text-gray-800 dark:text-gray-200 font-bold rounded-2xl flex items-center gap-2 hover:border-indigo-500 transition-all shadow-sm cursor-pointer"
                  >
                    <CalendarIcon size={16} />
                    진도 재조정
                  </button>
                )}
                {progressData.progressStatus === "NOT_STARTED" && (
                  <button
                    onClick={handleStartPlan}
                    disabled={isStarting}
                    className={`px-8 py-3 bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-black rounded-2xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 ${isStarting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5 active:scale-95"}`}
                  >
                    {isStarting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        시작 중...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        일일 진도 시작
                      </>
                    )}
                  </button>
                )}

                {progressData.progressStatus === "IN_PROGRESS" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-2xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    일일 진도 완료하기
                  </button>
                )}

                {progressData.progressStatus === "COMPLETED" && (
                  <div className="px-8 py-3 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] text-gray-400 font-black rounded-2xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    진도 완료됨
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1f1f1f] rounded-3xl shadow-sm">
            <p className="text-sm font-bold text-gray-400">해당 일자의 진도 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {progressData?.studyDailyPlanId && (
        <BaseModal 
          isOpen={isModalOpen}
          onClose={() => !isSubmitting && setIsModalOpen(false)}
          showCloseButton={!isSubmitting}
        >
          <PlanCompletionForm
            studyDailyPlanId={progressData.studyDailyPlanId}
            onClose={() => setIsModalOpen(false)}
            onCompleteSuccess={handleCompleteSuccess}
            onSubmittingChange={setIsSubmitting}
          />
        </BaseModal>
      )}

      {/* 모든 일일 공부 진도 목록 (14~90개) */}
      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <BookIcon size={16} />
            모든 진도 목록 ({allPlans.length}개)
          </h3>
          
          {/* 방장일 때만 스터디 삭제 버튼 표시 (하단으로 이동됨) */}
        </div>

        {allPlans.length > 0 ? (
          <div className="max-h-64 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 space-y-2">
            {allPlans.map((plan) => (
              <div 
                key={plan.studyDailyPlanId} 
                onClick={() => setSearchParams({ date: plan.planDate })}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  plan.planDate === planDate 
                    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800" 
                    : "bg-white border-gray-100 dark:bg-[#0a0a0a] dark:border-[#1f1f1f] hover:border-indigo-200 dark:hover:border-indigo-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                    plan.planDate === planDate ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-[#1a1a1a] dark:text-gray-400"
                  }`}>
                    {plan.dayNumber}일차
                  </div>
                  <span className={`text-sm font-bold truncate max-w-50 sm:max-w-md ${
                    plan.planDate === planDate ? "text-indigo-900 dark:text-indigo-200" : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {plan.planContent}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 shrink-0">
                  {plan.planDate}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl">
            <p className="text-sm font-bold text-gray-400">진도 목록이 없습니다.</p>
          </div>
        )}

        {/* 방장일 때만 스터디 삭제 버튼 표시 (하단 배치, 크기 증가) */}
        {isOwner && (
          <div className="flex justify-end mt-10">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-rose-500 hover:text-white bg-rose-50 hover:bg-rose-500 dark:bg-rose-950/30 dark:hover:bg-rose-600 rounded-xl transition-colors shadow-sm"
            >
              <TrashIcon size={16} /> 스터디 삭제
            </button>
          </div>
        )}
      </div>

      {/* 스터디 삭제 모달 (AWS EC2 방식) */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        showCloseButton={!isDeleting}
      >
        <div className="p-6">
          <h3 className="text-xl font-black text-rose-600 dark:text-rose-500 mb-2 flex items-center gap-2">
            <TrashIcon size={20} />
            스터디 영구 삭제
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
            삭제된 스터디는 복구할 수 없습니다. 정말 삭제하시려면 아래 입력창에 스터디 제목 <strong className="text-gray-900 dark:text-white px-1.5 py-0.5 bg-gray-100 dark:bg-[#222] rounded select-all">{studyTitle}</strong> 을 정확히 입력하세요.
          </p>

          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="스터디 제목을 입력하세요"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all dark:text-white mb-6"
            autoComplete="off"
          />

          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleDeleteStudy}
              disabled={deleteConfirmText !== studyTitle || isDeleting}
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-rose-500/20"
            >
              {isDeleting ? "삭제 중..." : "영구 삭제"}
            </button>
          </div>
        </div>
      </BaseModal>

      {/* 진도 재조정 모달 */}
      <BaseModal isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <CalendarIcon size={20} />
            공부 휴무 일정 재조정
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
            휴무 요일과 예외 날짜를 변경합니다. 기존 완료된 공부 내용은 유지한 채 오늘 이후의 일정 날짜들만 재배치됩니다.
          </p>

          <div className="space-y-6">
            {/* 정기 휴무일 (요일 선택) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">정기 휴무일 (반복되는 쉬는 요일)</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dayMap).map(([day, index]) => {
                  const isSelected = restDays.includes(day);
                  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setRestDays(prev =>
                          prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                        );
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-200 ${
                        isSelected
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 ring-2 ring-rose-500 shadow-sm"
                          : "bg-gray-100 text-gray-400 dark:bg-[#1a1a1a] dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
                      }`}
                    >
                      {dayNames[index]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 예외 휴무일 (특정 날짜 추가) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">예외 휴무일 (특정 날짜 지정)</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={tempRestDate}
                  min={getTodayString()}
                  onChange={(e) => setTempRestDate(e.target.value)}
                  className="flex-1 max-w-[200px] px-4 py-2.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tempRestDate && !restDates.includes(tempRestDate)) {
                      setRestDates(prev => [...prev, tempRestDate].sort());
                      setTempRestDate("");
                    }
                  }}
                  disabled={!tempRestDate || restDates.includes(tempRestDate)}
                  className="px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  날짜 추가
                </button>
              </div>

              {restDates.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-dashed border-gray-200 dark:border-[#222]">
                  {restDates.map(date => (
                    <div key={date} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-lg text-sm font-medium shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300">{date}</span>
                      <button
                        type="button"
                        onClick={() => setRestDates(prev => prev.filter(d => d !== date))}
                        className="text-gray-400 hover:text-rose-500 transition-colors focus:outline-none ml-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsRescheduleModalOpen(false)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => {
                alert("공부 일정 재조정이 완료되었습니다. (API 미연동)");
                setIsRescheduleModalOpen(false);
              }}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
            >
              재조정 적용
            </button>
          </div>
        </div>
      </BaseModal>

      {/* 제목 수정은 인라인 편집(DailyProgress 내부)으로 처리되어 모달 불필요 */}
    </Card>
  );
}
