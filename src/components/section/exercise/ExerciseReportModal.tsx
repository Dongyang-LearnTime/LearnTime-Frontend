import { useEffect } from 'react';
import { useExerciseReport } from '../../../hooks/queries/useExerciseReport';
import { XIcon, SparklesIcon, DumbbellIcon, CalendarIcon, ClockIcon, TrendIcon } from '../../ui/Icons';
import { CardTitle } from '../../common/Card';

interface ExerciseReportModalProps {
  onClose: () => void;
}

export function ExerciseReportModal({ onClose }: ExerciseReportModalProps) {
  // 모달이 열리면 리포트 데이터를 백엔드(또는 Mock API)에서 가져옴
  const { report, isLoading, isError, fetchReport } = useExerciseReport(true);

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

        <CardTitle icon={<SparklesIcon size={18} className="text-rose-500 animate-pulse" />}>
          운동 기록 종합 리포트
        </CardTitle>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400">AI가 운동 기록 및 볼륨 데이터를 분석 중입니다...</p>
          </div>
        ) : isError || !report ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-rose-500">
              <XIcon size={30} />
            </div>
            <h3 className="text-lg font-black text-rose-500">리포트를 불러오는 도중 에러가 발생했습니다.</h3>
            <p className="text-xs text-gray-400">서버의 백엔드 API(/api/exercise/report) 연결 상태를 확인해주세요.</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-500">
            {/* 리포트 정보 및 날짜 */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-[#111] rounded-2xl px-6 py-4 border border-gray-100/50 dark:border-[#1a1a1a]">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">발행 일자</span>
              <span className="text-sm font-black text-rose-500">{report.reportDate}</span>
            </div>

            {/* 주요 통계 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 총 운동 시간 */}
              <div className="p-5 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <ClockIcon size={20} />
                </div>
                <div>
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">총 운동 시간</p>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    {report.totalWorkoutTime} <span className="text-xs font-bold">분</span>
                  </p>
                </div>
              </div>

              {/* 주간 운동 일수 */}
              <div className="p-5 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">주간 운동 일수</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {report.totalActiveDays} <span className="text-xs font-bold">일</span>
                  </p>
                </div>
              </div>

              {/* 누적 볼륨 */}
              <div className="p-5 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/30 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <DumbbellIcon size={20} />
                </div>
                <div>
                  <p className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">주간 누적 볼륨</p>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                    {report.totalVolume} <span className="text-xs font-bold">TON</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 요일별 누적 볼륨 바 차트 */}
            <div className="p-6 bg-gray-50/50 dark:bg-[#18181b]/30 rounded-[2rem] border border-gray-100/50 dark:border-[#27272a]/50">
              <div className="flex items-center gap-2 mb-4">
                <TrendIcon size={16} className="text-rose-500" />
                <label className="block text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">요일별 누적 볼륨 (TON)</label>
              </div>
              <div className="flex justify-between items-end h-28 px-2 pt-4">
                {report.weeklyVolumes.map((vol, i) => {
                  const maxVol = Math.max(...report.weeklyVolumes, 1);
                  const percent = (vol / maxVol) * 100;
                  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
                  return (
                    <div key={i} className="flex flex-col items-center flex-grow group">
                      <span className="text-[10px] font-black text-rose-500 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{vol}T</span>
                      <div className="w-6 bg-rose-500/10 dark:bg-rose-950/20 rounded-t-lg h-20 relative overflow-hidden flex items-end">
                        <div
                          className="w-full bg-rose-500 dark:bg-rose-600 rounded-t-lg transition-all duration-500"
                          style={{ height: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-gray-500 mt-2">{DAYS[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 주로 단련한 부위 */}
            <div>
              <label className="block text-[0.65rem] font-black text-gray-400 mb-3 uppercase tracking-widest">주요 단련 부위</label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 dark:bg-[#18181b]/30 rounded-2xl border border-gray-100/50 dark:border-[#27272a]/50">
                {report.targetMuscles.map((muscle, i) => (
                  <span
                    key={i}
                    className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/40 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm"
                  >
                    #{muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* AI 피드백 총평 */}
            <div className="p-6 bg-gray-50 dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon size={16} className="text-rose-500" />
                <span className="text-xs font-black text-rose-500 uppercase tracking-widest">AI 심층 운동 분석 피드백</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line italic">
                "{report.aiFeedbackSummary}"
              </p>
            </div>

            {/* 푸터 문구 */}
            <p className="text-[10px] text-center text-gray-400 font-medium">
              * 이 리포트는 현시점까지 누적된 운동 기록과 세트별 중량 볼륨을 기반으로 작성되었습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
