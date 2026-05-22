import { useEffect } from 'react';
import { useStudyReport } from '../../../hooks/queries/useStudyReport';
import { XIcon, SparklesIcon, BookIcon, TrendIcon } from '../../ui/Icons';
import { CardTitle } from '../../common/Card';

interface StudyReportModalProps {
  onClose: () => void;
}

export function StudyReportModal({ onClose }: StudyReportModalProps) {
  // 모달이 열리면 리포트 데이터를 백엔드(또는 Mock API)에서 가져옴
  const { report, isLoading, isError, fetchReport } = useStudyReport(true);

  // 로딩 상태 및 리프레시 대응
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-gray-50 dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-2xl text-gray-400 transition-all z-10 cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        <CardTitle icon={<SparklesIcon size={18} className="text-indigo-500 animate-pulse" />}>
          공부 기록 종합 리포트
        </CardTitle>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400">AI가 공부 기록을 정밀히 요약 및 분석 중입니다...</p>
          </div>
        ) : isError || !report ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-rose-500">
              <XIcon size={30} />
            </div>
            <h3 className="text-lg font-black text-rose-500">리포트를 불러오는 도중 에러가 발생했습니다.</h3>
            <p className="text-xs text-gray-400">서버의 백엔드 API(/api/study/report) 연결 상태를 확인해주세요.</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-500">
            {/* 리포트 정보 및 날짜 */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-[#111] rounded-2xl px-6 py-4 border border-gray-100/50 dark:border-[#1a1a1a]">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">발행 일자</span>
              <span className="text-sm font-black text-indigo-500">{report.reportDate}</span>
            </div>

            {/* 주요 통계 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 총 공부시간 */}
              <div className="p-6 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <TrendIcon size={20} />
                </div>
                <div>
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">총 몰입 시간</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {report.totalStudyTime} <span className="text-xs font-bold">분</span>
                  </p>
                </div>
              </div>

              {/* 완료한 진도 수 */}
              <div className="p-6 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <BookIcon size={20} />
                </div>
                <div>
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">학습 진도율</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {report.completedTodosCount} / {report.totalTodosCount} <span className="text-xs font-bold">목표</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 공부한 키워드 칩 리스트 */}
            <div>
              <label className="block text-[0.65rem] font-black text-gray-400 mb-3 uppercase tracking-widest">공부한 핵심 키워드</label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 dark:bg-[#18181b]/30 rounded-2xl border border-gray-100/50 dark:border-[#27272a]/50">
                {report.studiedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* AI 피드백 총평 */}
            <div className="p-6 bg-gray-50 dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon size={16} className="text-indigo-500" />
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">AI 심층 학습 분석 피드백</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line italic">
                "{report.aiFeedbackSummary}"
              </p>
            </div>

            {/* 푸터 문구 */}
            <p className="text-[10px] text-center text-gray-400 font-medium">
              * 이 리포트는 현시점까지 누적된 공부 기록과 완료된 체크리스트를 기반으로 작성되었습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
