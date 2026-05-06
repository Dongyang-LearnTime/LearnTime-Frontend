import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { Loader2, AlertCircle, CheckCircle, XCircle, Award } from 'lucide-react';
import { usePageTitle } from '../../../hooks/usePageTitle';

import { getQuizResultApi } from '../api/StudyQuizApi';
import type { QuizType } from '../../../types/studyEnums';

export interface QuizDetailResponse {
  quizQuestionId: number;
  questionContent: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  quizType: QuizType;
}

export interface StudyQuizResultResponse {
  totalQuestionCount: number;
  correctQuestionCount: number;
  earnedPoints: number;
  quizResults: QuizDetailResponse[];
}

export default function QuizResultPage() {
  const [resultData, setResultData] = useState<StudyQuizResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { quizHistoryId } = useParams<{ quizHistoryId: string }>();
  const navigate = useNavigate();

  usePageTitle("learn-time | 퀴즈 상세 내역");

  const fetchQuizResult = async () => {
    if (!quizHistoryId) {
      setError('유효하지 않은 접근입니다. 퀴즈 ID가 필요합니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getQuizResultApi(quizHistoryId);
      setResultData(data);
    } catch (err) {
      setError('퀴즈 결과를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizResult();
  }, [quizHistoryId]);

  // 객관식 문항 텍스트 분리 유틸리티
  const parseMultipleChoice = (content: string) => {
    const lines = content.split('\n');
    const mainQuestion = lines[0];
    const options = lines.slice(1);
    return { mainQuestion, options };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-slate-600 font-medium">퀴즈 결과를 분석하고 있습니다...</p>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-slate-800 font-bold">{error || '결과를 찾을 수 없습니다.'}</p>
        <button 
          onClick={() => navigate('/')} // 메인 또는 이전 페이지로 이동
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
        >
          돌아가기
        </button>
      </div>
    );
  }

  // 점수 백분율 계산
  const scorePercentage = Math.round((resultData.correctQuestionCount / resultData.totalQuestionCount) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 헤더 영역 (결과 요약) */}
        <header className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden">
          {/* 장식용 배경 요소 */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                <Award className="text-indigo-600" size={28} />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  퀴즈 결과 리포트
                </h1>
              </div>
              <p className="text-slate-500 font-medium">
                총 {resultData.totalQuestionCount}문제 중 <span className="text-indigo-600 font-bold">{resultData.correctQuestionCount}문제</span>를 맞혔습니다.
              </p>
            </div>

            {/* 점수표 표시 */}
            <div className="flex items-center gap-6 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
              <div className="text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">정답률</p>
                <p className="text-2xl font-extrabold text-slate-800">{scorePercentage}%</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">획득 포인트</p>
                <p className="text-2xl font-extrabold text-indigo-600">+{resultData.earnedPoints}</p>
              </div>
            </div>
          </div>
        </header>

        {/* 퀴즈 상세 결과 목록 */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800 px-2">문항별 상세 분석</h2>
          
          {resultData.quizResults.map((q, index) => {
            const isMultiple = q.quizType === 'MULTIPLE';
            const { mainQuestion, options } = isMultiple 
              ? parseMultipleChoice(q.questionContent) 
              : { mainQuestion: q.questionContent, options: [] };

            return (
              <div 
                key={q.quizQuestionId}
                className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border transition-colors duration-300
                  ${q.isCorrect ? 'border-emerald-100 hover:border-emerald-300' : 'border-rose-100 hover:border-rose-300'}
                `}
              >
                {/* 문항 헤더 (정답 여부 표시) */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`shrink-0 w-8 h-8 flex items-center justify-center font-bold rounded-lg
                    ${q.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 mt-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      {q.isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                          <CheckCircle size={14} /> 정답
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                          <XCircle size={14} /> 오답
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {mainQuestion}
                    </h3>
                  </div>
                </div>

                <div className="ml-12">
                  {/* OX 퀴즈 결과 UI */}
                  {q.quizType === 'OX' && (
                    <div className="flex gap-4">
                      {['O', 'X'].map((option) => {
                        const isUserAnswer = q.userAnswer === option;
                        const isCorrectAnswer = q.correctAnswer === option;
                        
                        let optionStyle = 'border-slate-200 text-slate-400 bg-slate-50/50';
                        if (isCorrectAnswer) optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm';
                        else if (isUserAnswer && !q.isCorrect) optionStyle = 'border-rose-300 bg-rose-50 text-rose-700';

                        return (
                          <div key={option} className={`relative flex-1 py-4 text-center text-xl font-bold rounded-xl border-2 ${optionStyle}`}>
                            {option}
                            {isUserAnswer && (
                              <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs shadow-md">
                                나
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 4지선다(객관식) 결과 UI */}
                  {q.quizType === 'MULTIPLE' && (
                    <div className="space-y-3">
                      {options.map((optionText, optIndex) => {
                        const optionNumber = (optIndex + 1).toString();
                        const isUserAnswer = q.userAnswer === optionNumber;
                        const isCorrectAnswer = q.correctAnswer === optionNumber;

                        let optionStyle = 'border-slate-200 text-slate-500 bg-white';
                        if (isCorrectAnswer) optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-sm';
                        else if (isUserAnswer && !q.isCorrect) optionStyle = 'border-rose-300 bg-rose-50 text-rose-800 font-semibold';

                        return (
                          <div key={optIndex} className={`relative w-full text-left px-5 py-4 rounded-xl border-2 ${optionStyle}`}>
                            <span className="text-sm sm:text-base">{optionText}</span>
                            {isUserAnswer && (
                              <div className="absolute top-1/2 -translate-y-1/2 right-4 px-2.5 py-1 bg-slate-800 text-white rounded-md text-xs font-bold shadow-sm">
                                내 답변
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 미응답 안내 메시지 */}
                  {!q.userAnswer && (
                    <div className="mt-4 text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} /> 이 문항은 답을 선택하지 않았습니다.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 네비게이션 버튼 */}
        <div className="flex justify-center pt-8 pb-12">
          <button 
            onClick={() => navigate('/')} 
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-95"
          >
            학습 메인으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
}
