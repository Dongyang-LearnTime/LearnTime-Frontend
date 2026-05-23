import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizHistoryListApi, type QuizHistoryListItem } from '../api/StudyQuizApi';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { formatDateUtil } from '../../../utils/formatDateUtil';
import { BrainIcon, TrophyIcon } from '../../../components/ui/Icons';

export default function QuizHistoryListPage() {
  usePageTitle('learn-time | 퀴즈 기록');
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const [histories, setHistories] = useState<QuizHistoryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studyId) return;
    setIsLoading(true);
    getQuizHistoryListApi(studyId)
      .then(setHistories)
      .catch(() => setError('퀴즈 기록을 불러오는 데 실패했습니다.'))
      .finally(() => setIsLoading(false));
  }, [studyId]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-2 border-l-8 border-indigo-600 pl-6 text-gray-900 dark:text-white">
          퀴즈 기록
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium ml-2">
          필기를 기반으로 생성된 퀴즈 풀이 이력을 확인하세요.
        </p>
      </header>

      {/* 본문 */}
      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-[#1a1a1a]" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-500 font-bold text-sm">{error}</div>
      ) : histories.length === 0 ? (
        /* 빈 화면 */
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-dashed border-gray-200 dark:border-[#222] text-center px-4">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-5 text-indigo-400">
            <BrainIcon size={36} />
          </div>
          <h2 className="text-xl font-black mb-2 text-gray-800 dark:text-gray-200">아직 풀이한 퀴즈가 없습니다.</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">필기를 작성하고 퀴즈를 생성해 보세요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {histories.map((history) => {
            const accuracy = history.totalQuestions > 0
              ? Math.round((history.correctCount / history.totalQuestions) * 100)
              : 0;
            const accuracyColor =
              accuracy >= 80 ? 'text-emerald-500' :
              accuracy >= 50 ? 'text-amber-500' : 'text-rose-500';
            const accuracyBg =
              accuracy >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/30' :
              accuracy >= 50 ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-rose-50 dark:bg-rose-950/30';

            return (
              <button
                key={history.quizHistoryId}
                onClick={() => navigate(`/study/quiz/history/${history.quizHistoryId}`)}
                className="w-full flex items-center justify-between p-5 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-[#1a1a1a] hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                    <BrainIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{history.noteTitle}</p>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">풀이일: {formatDateUtil(history.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black ${accuracyBg} ${accuracyColor}`}>
                    <TrophyIcon size={12} />
                    {accuracy}%
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    {history.correctCount}/{history.totalQuestions}
                  </span>
                  <span className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">결과 보기 →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
