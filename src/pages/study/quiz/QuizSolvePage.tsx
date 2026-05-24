import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Loader2, AlertCircle, Edit2, Trash2, History } from 'lucide-react';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { getQuizDetailApi, submitQuizApi, updateStudyQuizTitleApi, deleteStudyQuizApi } from '../api/StudyQuizApi'
import BaseModal from '../../../components/common/BaseModal';
import type { QuizType, ProgressStatus } from '../../../types/StudyEnums';


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

  const [ isEditModalOpen, setIsEditModalOpen ] = useState<boolean>(false);
  const [ editTitleValue, setEditTitleValue ] = useState<string>('');
  const [ isUpdatingTitle, setIsUpdatingTitle ] = useState<boolean>(false);
  const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

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


  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    if (error) setError('');
  };

  const handleUpdateTitle = async () => {
    if (!editTitleValue.trim() || !quizId) return;
    setIsUpdatingTitle(true);
    try {
      await updateStudyQuizTitleApi({
        studyQuizId: Number(quizId),
        quizTitle: editTitleValue.trim()
      });
      setQuizData(prev => prev ? { ...prev, quizTitle: editTitleValue.trim() } : prev);
      setIsEditModalOpen(false);
    } catch (err) {
      alert("제목 수정에 실패했습니다.");
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizId) return;
    if (!window.confirm("정말 이 퀴즈를 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다.")) return;
    
    setIsDeleting(true);
    try {
      await deleteStudyQuizApi(Number(quizId));
      alert("퀴즈가 삭제되었습니다.");
      setIsDirty(false);
      navigate(-1); // 이전 페이지(퀴즈 목록 등)로 이동
    } catch (err) {
      alert("퀴즈 삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  };

  // 객관식 문항 텍스트 분리 유틸리티
  const parseMultipleChoice = (content: string) => {
    // 실제 줄바꿈 문자('\n') 또는 이스케이프된 문자열('\\n') 모두 기준으로 분리 및 빈 문자열 제거
    const lines = content.split(/\\n|\n/).filter(line => line.trim() !== '');
    const mainQuestion = lines[0] || '';
    const options = lines.slice(1);
    return { mainQuestion, options };
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">퀴즈를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-slate-800 dark:text-slate-200 font-bold">퀴즈를 찾을 수 없습니다.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 font-sans">
      <div className="space-y-8">
        
        {/* 헤더 영역 */}
        <header className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-[#222] flex flex-col gap-6 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full tracking-wider">
                  {quizData.quizStatus}
                </span>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {quizData.quizTitle}
                  </h1>
                  <button 
                    onClick={() => { setEditTitleValue(quizData.quizTitle); setIsEditModalOpen(true); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                총 {quizData.questions.length}문항이 포함된 퀴즈입니다.
              </p>
            </div>
            
            <button
              onClick={() => navigate(`/study/quiz/history/list/${quizId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors"
            >
              <History size={16} />
              이전 풀이 이력 보기
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 w-full">
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
                className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#222] hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed mt-0.5 whitespace-pre-wrap">
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
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                              : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-[#1a1a1a]'
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
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-[#1a1a1a]'
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

        {/* 하단 네비게이션 및 제출 버튼 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 pb-12">
          <button 
            onClick={handleDeleteQuiz}
            disabled={isDeleting || isSubmitting}
            className="flex items-center gap-2 px-4 py-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-sm font-bold transition-colors"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            퀴즈 삭제
          </button>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || isDeleting}
            className={`px-8 py-3.5 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 bg-linear-to-r from-violet-500 to-indigo-500 flex items-center justify-center gap-2 w-full sm:w-auto min-w-60
              ${(isSubmitting || isDeleting) ? 'opacity-70 cursor-wait' : 'hover:from-violet-600 hover:to-indigo-600 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
            제출하기
          </button>
        </div>

      </div>

      {/* 퀴즈 제목 수정 모달 */}
      <BaseModal isOpen={isEditModalOpen} onClose={() => !isUpdatingTitle && setIsEditModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">퀴즈 제목 수정</h3>
          <p className="text-sm font-medium text-slate-500 mb-6">새로운 퀴즈 제목을 입력해주세요.</p>
          <input
            type="text"
            value={editTitleValue}
            onChange={(e) => setEditTitleValue(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all dark:text-white mb-6"
            autoComplete="off"
            maxLength={100}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdatingTitle}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleUpdateTitle}
              disabled={!editTitleValue.trim() || isUpdatingTitle}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isUpdatingTitle ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
