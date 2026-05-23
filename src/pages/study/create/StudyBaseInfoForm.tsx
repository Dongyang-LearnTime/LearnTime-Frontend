import React from "react";
import { dayMap } from "./CreateStudyPage";
import type { StudyForm } from "./CreateStudyPage";

interface StudyBaseInfoFormProps {
    studyForm: StudyForm;
    setStudyForm: React.Dispatch<React.SetStateAction<StudyForm>>;

    tempRestDate: string;
    setTempRestDate: React.Dispatch<React.SetStateAction<string>>;

    studyDays: number;
}

export default function StudyBaseInfoForm({
    studyForm,
    setStudyForm,
    tempRestDate,
    setTempRestDate,
    studyDays
}: StudyBaseInfoFormProps) {

    // UTC 기준이 아닌 서울 시간(KST) 기준으로 오늘 날짜 계산 (UTC + 9시간)
    const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];

    // =========================
    // 입력 변경
    // =========================
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setStudyForm(prev => {
            const next = { ...prev, [name]: value };

            // 종료일 < 시작일 방지
            if (name === "endDate" && next.startDate && value < next.startDate) {
                alert("종료일은 시작일보다 이전일 수 없습니다.");
                return prev;
            }

            // 시작일 변경 시 종료일 자동 보정
            if (name === "startDate" && next.endDate && next.endDate < value) {
                next.endDate = value;
            }

            return next;
        });
    };

    // =========================
    // 쉬는 요일 토글
    // =========================
    const handleRestDayToggle = (day: string) => {
        setStudyForm(prev => ({
            ...prev,
            restDays: prev.restDays.includes(day)
                ? prev.restDays.filter(d => d !== day)
                : [...prev.restDays, day]
        }));
    };

    // =========================
    // 쉬는 날짜 추가
    // =========================
    const handleAddRestDate = () => {
        if (!tempRestDate || studyForm.restDates.includes(tempRestDate)) return;

        setStudyForm(prev => ({
            ...prev,
            restDates: [...prev.restDates, tempRestDate].sort()
        }));

        setTempRestDate('');
    };

    const isInvalidStudyDays = studyDays > 0 && (studyDays < 14 || studyDays > 90);

    return (
        <section className="bg-white dark:bg-[#050505] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm p-6 sm:p-8 mb-6 relative overflow-hidden">
            <div className="mb-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">1. 스터디 기본 정보</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">학습할 교재와 진행 일정을 설정합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 책 제목 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">책 제목</label>
                    <input
                        type="text"
                        name="bookTitle"
                        required
                        maxLength={150}
                        value={studyForm.bookTitle}
                        onChange={handleFormChange}
                        placeholder="예: 리액트 마스터하기"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                    />
                </div>

                {/* 진도 제목 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">스터디 이름</label>
                    <input
                        type="text"
                        name="studyTitle"
                        required
                        maxLength={100}
                        value={studyForm.studyTitle}
                        onChange={handleFormChange}
                        placeholder="예: 2주 완성 리액트 기초"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                    />
                </div>

                {/* 시작 날짜 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">시작 날짜</label>
                    <input
                        type="date"
                        name="startDate"
                        required
                        min={today}
                        value={studyForm.startDate}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                    />
                </div>

                {/* 종료 날짜 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">종료 날짜</label>
                    <input
                        type="date"
                        name="endDate"
                        required
                        min={studyForm.startDate || today}
                        value={studyForm.endDate}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                    />
                </div>

                {/* 쉬는 요일 */}
                <div className="flex flex-col gap-2 md:col-span-2 mt-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">정기 휴무일 (반복되는 쉬는 요일)</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(dayMap).map(([day, index]) => {
                            const isSelected = studyForm.restDays.includes(day);
                            const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleRestDayToggle(day)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-200 ${
                                        isSelected 
                                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 ring-2 ring-rose-500 shadow-sm' 
                                            : 'bg-gray-100 text-gray-400 dark:bg-[#1a1a1a] dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]'
                                    }`}
                                >
                                    {dayNames[index]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 개별 쉬는 날짜 */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">예외 휴무일 (특정 날짜 지정)</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={tempRestDate}
                            min={studyForm.startDate || today}
                            max={studyForm.endDate}
                            onChange={(e) => setTempRestDate(e.target.value)}
                            className="flex-1 max-w-[200px] px-4 py-2.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={handleAddRestDate}
                            disabled={!tempRestDate || studyForm.restDates.includes(tempRestDate)}
                            className="px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            날짜 추가
                        </button>
                    </div>

                    {studyForm.restDates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-dashed border-gray-200 dark:border-[#222]">
                            {studyForm.restDates.map(date => (
                                <div key={date} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-lg text-sm font-medium shadow-sm">
                                    <span className="text-gray-700 dark:text-gray-300">{date}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStudyForm(prev => ({
                                                ...prev,
                                                restDates: prev.restDates.filter(d => d !== date)
                                            }))
                                        }
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

            {/* 실제 진행일 */}
            <div className={`mt-8 p-4 rounded-xl flex items-center justify-between border ${
                isInvalidStudyDays 
                    ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400' 
                    : studyDays > 0 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400'
                        : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-[#111] dark:border-[#222] dark:text-gray-400'
            }`}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span className="font-bold">최종 산출된 실제 진행일</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-black">{studyDays}일</span>
                    {isInvalidStudyDays && (
                        <span className="text-xs font-bold bg-rose-100 dark:bg-rose-900 px-2 py-1 rounded-md">
                            (14~90일 범위여야 합니다)
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}