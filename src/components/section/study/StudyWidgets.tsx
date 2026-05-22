// ============================================================
// components/section/study/StudyWidgets.tsx
// 학습 스튜디오 하위 위젯 컴포넌트 모음.
//
// 포함 컴포넌트:
//   QuizGeneratorBox - AI 기반 필기 내용 분석 및 퀴즈 생성
//   AiSuggestionBox - AI 기반 학습 기록 분석 및 전략 제안 (InfoCard 재사용)
//   DashboardBox    - 주간 몰입도 막대 차트 + 핵심 지표 진행 바 대시보드
//   GeminiBox       - Gemini 링크 카드 (외부 gemini.google.com 이동)
// ============================================================
import { useState } from 'react';
import { SparklesIcon, TrendIcon, AlertIcon, ExternalLinkIcon } from '../../ui/Icons';
import { Card, CardTitle } from '../../common/Card';
import { InfoCard } from '../../common/InfoCard';
import { BarChart } from '../../common/BarChart';
import { ProgressBar } from '../../common/ProgressBar';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const WEEKLY_DATA = [40, 70, 45, 90, 60, 85, 30];
const METRICS = [
  { name: '총 공부 시간', progress: 75 },
  { name: '진도 달성률', progress: 64 },
  { name: '문제 오답률', progress: 24 },
  { name: '집중 시간', progress: 82 },
];

export function QuizGeneratorBox() {
  const [note, setNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});

  const handleGenerate = () => {
    if (!note) return;
    setIsGenerating(true);
    setSelectedAnswers({});

    // 시뮬레이션: 객관식 2개 + OX 2개 고정 생성
    setTimeout(() => {
      setIsGenerating(false);
      setQuizzes([
        {
          question: '미적분의 기본 정리(Fundamental Theorem of Calculus)에 대한 설명으로 옳은 것은?',
          options: ['미분과 적분은 서로 역관계에 있음을 나타낸다.', '함수의 극값을 찾는 유일한 방법이다.', '도형의 넓이를 구하는 공식일 뿐이다.', '연속함수에서는 정의되지 않는다.'],
          answer: 0,
          explanation: '미적분의 기본 정리는 미분과 적분이 서로 역작용 관계임을 수학적으로 증명한 핵심 정리입니다.'
        },
        {
          question: '라이프니츠의 미분법 표기법 중 올바른 것은?',
          options: ["f'(x)", 'dy/dx', 'Df(x)', 'ẏ'],
          answer: 1,
          explanation: 'dy/dx는 라이프니츠가 제안한 표기법으로, 미분을 분수 형태로 표현하여 연쇄 법칙 등을 이해하기 쉽게 돕습니다.'
        },
        {
          question: '모든 연속함수는 미분 가능하다. (O/X)',
          isOx: true,
          answer: false,
          explanation: '연속함수이더라도 꺾인 점(첨점)이 있는 경우 그 지점에서는 미분이 불가능합니다. (예: 절댓값 함수 y=|x|)'
        },
        {
          question: '적분은 곡선 아래의 면적을 구하는 과정이다. (O/X)',
          isOx: true,
          answer: true,
          explanation: '정적분의 정의에 따라 특정 구간에서 함수의 그래프와 x축 사이의 유계된 면적을 계산할 수 있습니다.'
        }
      ]);
    }, 1500);
  };

  const handleSelectAnswer = (qIdx: number, val: any) => {
    if (selectedAnswers[qIdx] !== undefined) return; // 이미 선택한 경우 무시
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: val });
  };

  return (
    <Card className="glow-indigo border-t-4 border-indigo-500 flex flex-col h-full min-h-[500px]">
      <CardTitle icon={<SparklesIcon size={18} />}>AI 퀴즈 & 해설</CardTitle>

      {!quizzes.length ? (
        <>
          <p className="text-xs font-bold text-gray-400 mb-6 px-1">AI가 필기 내용을 분석하여 객관식과 OX 퀴즈를 동시에 생성합니다.</p>
          <textarea
            placeholder="학습한 핵심 내용을 붙여넣어 나만의 시험지를 만드세요..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] p-8 text-sm text-gray-800 dark:text-gray-200 flex-grow min-h-[250px] mb-6 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium leading-relaxed resize-none"
          />

          <button
            onClick={handleGenerate}
            disabled={!note || isGenerating}
            className={`w-full py-5 rounded-[2rem] text-sm font-black transition-all shadow-xl
              ${!note || isGenerating ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 shadow-indigo-500/10'}
            `}
          >
            {isGenerating ? 'AI가 정밀 분석 중...' : '맞춤 퀴즈 생성하기'}
          </button>
        </>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8">
          <div className="space-y-8">
            {quizzes.map((q, i) => {
              const selected = selectedAnswers[i];
              const isCorrect = selected === q.answer;
              const hasAnswered = selected !== undefined;

              return (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-4">
                  <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${hasAnswered ? (isCorrect ? 'bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-800/30' : 'bg-rose-50/30 border-rose-200 dark:bg-rose-950/10 dark:border-rose-800/30') : 'bg-gray-50 dark:bg-[#050505] border-gray-100 dark:border-[#1a1a1a]'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[0.6rem] font-black text-indigo-500 uppercase tracking-widest">Question 0{i + 1}</span>
                      {hasAnswered && (
                        <span className={`text-[0.6rem] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>

                    <p className="font-bold text-[0.95rem] leading-relaxed mb-6">{q.question}</p>

                    {q.isOx ? (
                      <div className="flex gap-4">
                        {[true, false].map((val) => (
                          <button
                            key={val.toString()}
                            onClick={() => handleSelectAnswer(i, val)}
                            disabled={hasAnswered}
                            className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all
                              ${hasAnswered
                                ? (val === q.answer ? 'bg-emerald-500 text-white' : (val === selected ? 'bg-rose-500 text-white opacity-50' : 'bg-gray-100 dark:bg-[#111] text-gray-400'))
                                : 'bg-white dark:bg-[#111] border border-gray-100 dark:border-[#1a1a1a] hover:border-indigo-500'}
                            `}
                          >
                            {val ? 'O' : 'X'}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(i, idx)}
                            disabled={hasAnswered}
                            className={`w-full text-left p-5 rounded-2xl text-[0.85rem] font-bold transition-all border
                              ${hasAnswered
                                ? (idx === q.answer ? 'bg-emerald-500 border-emerald-500 text-white' : (idx === selected ? 'bg-rose-500 border-rose-500 text-white opacity-50' : 'bg-gray-100 dark:bg-[#111] border-transparent text-gray-400'))
                                : 'bg-white dark:bg-[#111] border-gray-100 dark:border-[#1a1a1a] hover:border-indigo-500'}
                            `}
                          >
                            <span className="inline-block w-6 text-indigo-400 font-black">{idx + 1}.</span> {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {hasAnswered && (
                      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 animate-in fade-in duration-700">
                        <p className="text-[0.65rem] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <SparklesIcon size={12} /> Solution Commentary
                        </p>
                        <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300 italic">
                          "{q.explanation}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => { setQuizzes([]); setSelectedAnswers({}); }}
            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/10"
          >
            새로운 문제 생성하기
          </button>
        </div>
      )}
    </Card>
  );
}

export function StudyRecordBox({ onAnalyze }: { onAnalyze: (keywords: string, time: string) => Promise<void> | void }) {
  const [keywords, setKeywords] = useState('');
  const [time, setTime] = useState('60');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!keywords) return;
    setIsAnalyzing(true);
    await onAnalyze(keywords, time);
    setIsAnalyzing(false);
  };

  return (
    <Card className="h-full border-t-4 border-indigo-500 flex flex-col min-h-[300px]">
      <CardTitle icon={<SparklesIcon size={18} />}>오늘의 공부 기록</CardTitle>
      <p className="text-[0.65rem] font-medium text-gray-400 mb-6 px-1 leading-relaxed">
        오늘 집중하여 공부한 주제와 시간을 기록해 주세요. AI가 분석하여 맞춤 전략을 도출합니다.
      </p>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-[0.6rem] font-black text-gray-400 mb-2 uppercase tracking-widest">오늘 공부한 키워드</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="예: 미적분 기본정리, 치환적분"
            className="w-full bg-gray-50 dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-grow">
            <label className="block text-[0.6rem] font-black text-gray-400 mb-2 uppercase tracking-widest">공부 시간</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all text-gray-800 dark:text-gray-200"
            />
          </div>
          <span className="text-xs font-black text-gray-400 mb-3">MIN</span>
          <button
            onClick={handleAnalyze}
            disabled={!keywords || isAnalyzing}
            className={`px-6 py-3 rounded-xl text-xs font-black transition-all shadow-lg cursor-pointer
              ${!keywords || isAnalyzing ? 'bg-gray-100 dark:bg-[#27272a] text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-500/20'}
            `}
          >
            {isAnalyzing ? '분석 중' : '기록 분석'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export function LearningStrategyBox({ suggestions }: { suggestions: any[] }) {
  const defaultStrategies = [
    {
      title: '능동적 회상 (Active Recall)',
      text: '노트를 덮고 오늘 배운 핵심 공식을 백지에 스스로 적어보며 기억을 인출하세요.',
      icon: <SparklesIcon size={20} />,
      color: 'text-indigo-500'
    },
    {
      title: '뽀모도로 몰입 루틴',
      text: '25분 몰입 학습 후 5분 완전 휴식 루틴을 적용하여 두뇌 피로도를 조절하세요.',
      icon: <TrendIcon size={20} />,
      color: 'text-rose-500'
    },
    {
      title: '주기적 누적 복습',
      text: '학습 후 24시간 이내 1차 복습, 1주일 후 2차 누적 복습을 통해 망각을 차단하세요.',
      icon: <AlertIcon size={20} />,
      color: 'text-emerald-500'
    }
  ];

  const hasSuggestions = suggestions && suggestions.length > 0;

  return (
    <Card className="h-full border-t-4 border-indigo-500 flex flex-col min-h-[400px]">
      <CardTitle icon={<TrendIcon size={18} />}>맞춤형 학습 전략</CardTitle>
      
      <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {hasSuggestions ? (
          <>
            <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 ml-1 mb-2">AI 분석 맞춤 피드백</h3>
            <div className="space-y-4 mb-6">
              {suggestions.map((s, i) => (
                <div key={i} className="animate-in fade-in duration-500">
                  <InfoCard
                    icon={s.icon}
                    title={s.title}
                    text={s.text}
                    iconColor={s.color}
                    hoverBg="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10"
                  />
                </div>
              ))}
            </div>
            
            <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mt-6 mb-2">기본 학습 가이드</h3>
          </>
        ) : (
          <p className="text-[0.65rem] font-medium text-gray-400 mb-4 px-1 leading-relaxed">
            * 항상 제공되는 핵심 학습 가이드입니다. 왼쪽에서 학습 주제를 분석하면 맞춤형 AI 전략이 추가됩니다.
          </p>
        )}

        <div className="space-y-4">
          {defaultStrategies.map((s, i) => (
            <InfoCard
              key={i}
              icon={s.icon}
              title={s.title}
              text={s.text}
              iconColor={s.color}
              hoverBg="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

export function DashboardBox({ startDate, endDate, onViewReport }: { startDate?: string, endDate?: string, onViewReport?: () => void }) {
  return (
    <Card className="p-10 border-t-4 border-indigo-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tightest">활동 스튜디오</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {startDate && endDate ? `${startDate} ~ ${endDate}` : '실시간 성과 지표와 인사이트를 확인하세요.'}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={onViewReport} className="flex-1 md:flex-none text-xs font-black uppercase tracking-widest px-6 py-4 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all cursor-pointer">리포트</button>
          <button className="flex-1 md:flex-none text-xs font-black uppercase tracking-widest px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-indigo-500/10">작업 시작</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">주간 몰입도</h3>
          <BarChart data={WEEKLY_DATA} labels={DAYS} activeColor="group-hover:bg-indigo-600" labelActiveColor="group-hover:text-indigo-600" />
        </div>
        <div className="space-y-8">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">핵심 지표</h3>
          <div className="grid grid-cols-1 gap-6">
            {METRICS.map((m, i) => (
              <ProgressBar key={i} name={m.name} progress={m.progress} accentColor="bg-indigo-600" textColor="text-indigo-500" borderHover="hover:border-indigo-300" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function GeminiBox() {
  return (
    <Card className="border-t-4 border-indigo-500 shadow-2xl shadow-indigo-500/5">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl"><SparklesIcon size={28} /></div>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight flex items-center gap-2 tracking-tightest">
            Gemini <span className="text-[0.6rem] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-black tracking-widest border border-indigo-100">ULTRA</span>
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">인공지능 엔진</p>
        </div>
      </div>
      <button
        onClick={() => window.open('https://gemini.google.com', '_blank')}
        className="w-full py-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] hover:bg-indigo-600 hover:text-white rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
      >
        제미나이로 이동 <ExternalLinkIcon size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </button>
    </Card>
  );
}
