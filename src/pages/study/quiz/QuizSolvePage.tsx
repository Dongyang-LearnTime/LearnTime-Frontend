import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Loader2, AlertCircle } from 'lucide-react';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { getQuizDetailApi, submitQuizApi } from '../api/StudyQuizApi'
import type { QuizType, ProgressStatus } from '../../../types/studyEnums';


export interface SubmittedAnswer {
  quizQuestionId: number;
  userAnswer: string;
}

export interface QuizQuestion {
  quizQuestionId: number;
  questionContent: string;
  quizType: QuizType;
}

export interface QuizDetail {
  quizTitle: string;
  quizStatus: ProgressStatus;
  questions: QuizQuestion[];
}

export default function QuizSolvePage() {
  const [ quizData, setQuizData ] = useState<QuizDetail | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ error, setError] = useState<string>('');
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  const [ answers, setAnswers ] = useState<Record<number, string>>({});   // 사용자의 답안을 저장하는 상태 (객체 형태: { 질문ID: 선택한답안 })
  const [ isDirty, setIsDirty ] = useState<boolean>(false); // 페이지 이탈 방지 상태

  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  usePageTitle("learn-time | 퀴즈 답안 작성");

  const fetchQuizDetail = async () => {
    if (!quizId) return;

    try {
      setIsLoading(true);
      const data = await getQuizDetailApi(quizId);
      setQuizData(data);
      setIsDirty(true); // 퀴즈 데이터 로딩 완료 시점부터 이탈 방지 활성화
    } catch (err) {
      setError('퀴즈 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async () => {
    if (!quizData || !quizId) return;

    // 미응답 문항 확인 로직
    const unansweredCount = quizData.questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      setError(`아직 풀지 않은 문제가 ${unansweredCount}개 있습니다.`);
      return;
    }

    // 전송 데이터 포맷팅: Record -> List 형태의 배열
    const submissionData: SubmittedAnswer[] = quizData.questions.map(q => ({
      quizQuestionId: q.quizQuestionId,
      userAnswer: answers[q.quizQuestionId] || "" // 미응답 시 빈 문자열 처리
    }));

    try {
      setError('');
      setIsSubmitting(true);
      setIsDirty(false); // 성공적인 제출 시도 중에는 이탈 방지 해제

      const quizHistoryId = await submitQuizApi(submissionData);
      alert("퀴즈 제출이 완료되었습니다!");
      navigate(`/study/quiz/history/${quizHistoryId}`); 
    } catch (err) {
      setError("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsDirty(true); // 에러 발생 시 다시 이탈 방지 활성화
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchQuizDetail();
  }, [quizId]);

  // 창 닫기, 새로고침 등 페이지 이탈 시도 시 브라우저 경고창 띄우기
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);


  // 답안 선택 핸들러
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    if (error) setError('');
  };

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
        <p className="text-slate-600 font-medium">퀴즈를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-slate-800 font-bold">퀴즈를 찾을 수 없습니다.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 헤더 영역 */}
        <header className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full tracking-wider">
                  {quizData.quizStatus}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {quizData.quizTitle}
                </h1>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                총 {quizData.questions.length}문항이 포함된 퀴즈입니다.
              </p>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`shrink-0 px-8 py-3.5 text-white font-semibold rounded-xl shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200/50 hover:shadow-lg'}
              `}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
              제출하기
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1 w-full">
              <AlertCircle size={15} className="shrink-0" />
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}
        </header>

        {/* 퀴즈 목록 영역 */}
        <div className="space-y-6">
          {quizData.questions.map((q, index) => {
            const isMultiple = q.quizType === 'MULTIPLE';
            const { mainQuestion, options } = isMultiple 
              ? parseMultipleChoice(q.questionContent) 
              : { mainQuestion: q.questionContent, options: [] };

            return (
              <div 
                key={q.quizQuestionId}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold rounded-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed mt-0.5 whitespace-pre-wrap">
                    {mainQuestion}
                  </h3>
                </div>

                <div className="ml-12">
                  {/* OX 퀴즈 UI */}
                  {q.quizType === 'OX' && (
                    <div className="flex gap-4">
                      {['O', 'X'].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(q.quizQuestionId, option)}
                          className={`flex-1 py-4 text-xl font-bold rounded-xl border-2 transition-all duration-200
                            ${answers[q.quizQuestionId] === option 
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                              : 'border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 4지선다(객관식) 퀴즈 UI */}
                  {q.quizType === 'MULTIPLE' && (
                    <div className="space-y-3">
                      {options.map((optionText, optIndex) => {
                        // "1. 내용" 형식일 경우를 대비해 원본 텍스트 그대로 사용
                        const optionNumber = (optIndex + 1).toString();
                        const isSelected = answers[q.quizQuestionId] === optionNumber;
                        
                        return (
                          <button
                            key={optIndex}
                            onClick={() => handleAnswerSelect(q.quizQuestionId, optionNumber)}
                            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200
                              ${isSelected 
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                              }`}
                          >
                            <span className="font-medium text-sm sm:text-base">{optionText}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
