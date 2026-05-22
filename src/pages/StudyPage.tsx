/**
 * @file StudyPage.tsx
 * @description 학습 스튜디오 메인 페이지.
 * - useTodos 상태 연동
 * - 로딩/에러 분기 처리
 * - AI 진도 bulk 추가 연동
 */

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Todo } from '../types';
import { useTodos } from '../hooks/queries/useTodos';
import {
  SyllabusBox, ChecklistBox, QuizGeneratorBox, StopwatchBox,
  StudyRecordBox, LearningStrategyBox, DashboardBox, GeminiBox,
  StudyReportModal,
} from '../components/section/study';
import { PlusIcon, BookIcon, XIcon, TrendIcon, SparklesIcon } from '../components/ui/Icons';

export function StudyPage() {
  // 현재 선택된 과목 (Outlet공유)
  const { selectedSubject } = useOutletContext<{ selectedSubject: string }>() || { selectedSubject: 'all' };

  // useTodos 훅 연동
  const { todos, isLoading, isError, createTodosBulk } = useTodos();

  // 모달 및 폼 제어 로컬 상태
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isPeriodEditOpen, setIsPeriodEditOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excludeDates, setExcludeDates] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  /**
   * AI 기반 자동 진도 생성 핸들러
   */
  const handleGenerateSyllabus = async (newItems: Todo[], start?: string, end?: string, excludes?: string[]) => {
    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (excludes) setExcludeDates(excludes);

    // CreateTodoDto 맵핑 (임시 ID 제외)
    const dtos = newItems.map(item => ({
      text: item.text,
      completed: item.completed,
      isAi: item.isAi
    }));

    // Bulk 추가 API 호출
    await createTodosBulk(dtos);

    setIsSyllabusModalOpen(false);
  };

  /**
   * 오늘의 공부 기록 AI 분석 핸들러
   */
  const handleAnalyzeRecord = (keywords: string, time: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSuggestions([
          {
            title: '진도 달성 피드백',
            text: `'${keywords}' 키워드를 기반으로 핵심 개념의 70%를 잘 파악하셨습니다. (공부시간: ${time}분)`,
            icon: <TrendIcon size={20} />,
            color: 'text-indigo-500'
          },
          {
            title: 'AI 추천 학습법',
            text: `'${keywords}' 분야의 예제 분석 및 실전 오답 정리를 통해 개념 적용력을 높이세요.`,
            icon: <SparklesIcon size={20} />,
            color: 'text-amber-500'
          }
        ]);
        resolve();
      }, 1200);
    });
  };

  // 과목 코드 한글 맵핑
  const subjectNames: Record<string, string> = {
    all: '전체 과목',
    math: '수학',
    english: '영어',
    science: '과학',
    history: '역사'
  };

  // 로딩 상태 처리
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-bold text-indigo-500">데이터를 불러오는 중입니다...</div>;
  }

  // 에러 상태 처리
  if (isError) {
    return <div className="flex h-screen items-center justify-center font-bold text-rose-500">데이터를 불러오는데 실패했습니다. 서버를 확인해주세요.</div>;
  }

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* 헤더 영역 */}
      <header className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6">학습 스튜디오 <span className="text-xl text-indigo-500 ml-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-xl">{subjectNames[selectedSubject]}</span></h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium ml-2">AI와 함께하는 스마트한 학습 몰입 환경을 경험하세요.</p>
        </div>
        {todos && todos.length > 0 && (
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsPeriodEditOpen(true)}
              className="px-6 py-3 bg-white dark:bg-[#111] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl cursor-pointer hover:border-indigo-500 transition-all shadow-sm flex flex-col items-center"
            >
              <p className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest">학습 기간</p>
              <p className="text-sm font-black text-indigo-600">
                {startDate && endDate ? `${startDate} ~ ${endDate}` : '기간 설정 필요'}
                {excludeDates.length > 0 && ` (제외 ${excludeDates.length}일)`}
              </p>
            </div>
            <button
              onClick={() => setIsSyllabusModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl font-bold text-sm hover:border-indigo-500 transition-all shadow-sm cursor-pointer"
            >
              <PlusIcon size={16} /> 진도 추가
            </button>
          </div>
        )}
      </header>

      {/* Todo 데이터 없음 (빈 화면) */}
      {!todos || todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-dashed border-gray-200 dark:border-[#222] shadow-sm text-center px-4">
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 text-indigo-500">
            <BookIcon size={40} />
          </div>
          <h2 className="text-2xl font-black mb-3 text-gray-800 dark:text-gray-200">아직 등록된 진도가 없습니다.</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto font-medium">강의계획서나 목차 이미지를 업로드하면 AI가 자동으로 최적의 학습 진도를 생성해 드립니다.</p>
          <button
            onClick={() => setIsSyllabusModalOpen(true)}
            className="flex items-center gap-2 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20 cursor-pointer"
          >
            <PlusIcon size={20} /> AI 자동 진도 생성하기
          </button>
        </div>
      ) : (
        /* Bento Grid 메인 레이아웃 */
        <div className="bento-grid">
          {/* 대시보드 */}
          <div className="col-span-12 lg:col-span-8">
            <DashboardBox startDate={startDate} endDate={endDate} onViewReport={() => setIsReportModalOpen(true)} />
          </div>

          {/* 체크리스트 */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-3 h-full">
            <ChecklistBox />
          </div>

          {/* 타이머 */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <StopwatchBox />
          </div>

          {/* 오늘의 공부 기록 */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <StudyRecordBox onAnalyze={handleAnalyzeRecord} />
          </div>

          {/* 맞춤형 학습 전략 (항시 노출) */}
          <div className="col-span-12 lg:col-span-8">
            <LearningStrategyBox suggestions={suggestions} />
          </div>

          {/* 퀴즈 생성 */}
          <div className="col-span-12 lg:col-span-8">
            <QuizGeneratorBox />
          </div>

          {/* 제미나이 챗봇 */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <GeminiBox />
          </div>
        </div>
      )}
      </div>

      {/* 모달 영역 */}
      {/* AI 진도 모달 */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl animate-in zoom-in-95 duration-200">
            <SyllabusBox 
              onGenerate={handleGenerateSyllabus} 
              onClose={() => setIsSyllabusModalOpen(false)}
              initialStart={startDate} 
              initialEnd={endDate} 
            />
          </div>
        </div>
      )}

      {/* 기간 수정 모달 */}
      {isPeriodEditOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-sm rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsPeriodEditOpen(false)}
              className="absolute top-6 right-6 p-3 bg-gray-50 dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-2xl text-gray-400 transition-all z-10 cursor-pointer"
            >
              <XIcon size={20} />
            </button>
            <h3 className="text-xl font-black mb-6">학습 설정 수정</h3>
            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-1">
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-gray-400">시작일</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-50 dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a] rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-gray-200" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-gray-400">종료일</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-50 dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a] rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-gray-200" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-gray-400">제외 날짜</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50/50 dark:bg-[#18181b]/30 rounded-2xl border border-gray-100/50 dark:border-[#27272a]/50">
                  {excludeDates.length > 0 ? (
                    excludeDates.map(date => (
                      <span key={date} className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-full px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        {date}
                        <button type="button" onClick={() => setExcludeDates(excludeDates.filter(d => d !== date))} className="p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-full cursor-pointer">
                          <XIcon size={10} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium">제외된 날짜가 없습니다.</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsPeriodEditOpen(false)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              수정 완료
            </button>
          </div>
        </div>
      )}

      {/* 공부 리포트 모달 */}
      {isReportModalOpen && (
        <StudyReportModal onClose={() => setIsReportModalOpen(false)} />
      )}
    </>
  );
}


