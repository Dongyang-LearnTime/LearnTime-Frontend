import { useState, useEffect, type ChangeEvent } from 'react';
import { SparklesIcon, DumbbellIcon, TargetIcon, TrendIcon, PlayCircleIcon } from '../../../components/ui/Icons';
import { Card, CardTitle } from '../../../components/common/Card';
import { InfoCard } from '../../../components/common/InfoCard';
import { FieldInput } from '../../../components/common/FieldInput';
import { BarChart } from '../../../components/common/BarChart';
import { getWeeklyAnalysis, getRecommendedVideos, saveExercise, saveWeight } from '../api/exerciseApi';
import type { AnalysisItem, YoutubeVideoResponse } from '../types/exerciseApi';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const WEEKLY_DATA = [50, 60, 55, 80, 70, 95, 60];
const BODY_PARTS = ['가슴', '등', '어깨', '이두', '삼두', '하체'];

interface YoutubeVideoCardProps {
  video: YoutubeVideoResponse;
}

function YoutubeVideoCard({ video }: YoutubeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // 썸네일 주소가 비어있을 경우 고화질 기본 썸네일을 Fallback으로 적용합니다.
  const thumbnailUrl = video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="flex flex-col gap-3 group animate-in fade-in duration-300">
        <div className="bg-black rounded-3xl overflow-hidden relative aspect-video shadow-xl flex items-center justify-center border border-gray-100 dark:border-[#1a1a1a]">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-none"
          ></iframe>
        </div>
        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 px-1 hover:text-rose-500 transition-colors">
          {video.title}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 group animate-in fade-in duration-300">
      <div 
        onClick={() => setIsPlaying(true)}
        className="bg-black rounded-3xl overflow-hidden relative aspect-video shadow-xl flex items-center justify-center border border-gray-100 dark:border-[#1a1a1a] cursor-pointer group/thumb"
      >
        <img 
          src={thumbnailUrl} 
          alt={video.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
          onError={(e) => {
            // maxresdefault가 없는 경우를 위한 Fallback 처리
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
          }}
        />
        {/* 재생 아이콘 및 그라데이션 레이어 */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-85 group-hover/thumb:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <p 
        onClick={() => setIsPlaying(true)}
        className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 px-1 group-hover:text-rose-500 transition-colors cursor-pointer"
      >
        {video.title}
      </p>
    </div>
  );
}

export function ExerciseGuideBox() {
  const [active, setActive] = useState('가슴');
  const [videos, setVideos] = useState<YoutubeVideoResponse[]>([]);

  useEffect(() => {
    getRecommendedVideos([active])
      .then(res => {
        if (res && res.length > 0) {
          // 한 부위당 영상 최대 3개 매핑 적용
          setVideos(res.slice(0, 3));
        } else {
          setVideos([]);
        }
      })
      .catch(err => console.error('Failed to fetch videos', err));
  }, [active]);

  return (
    <Card className="flex flex-col h-full min-h-125">
      <CardTitle icon={<PlayCircleIcon size={18} />}>오늘의 운동부위 영상</CardTitle>
      <div className="flex flex-wrap gap-2 mb-8">
        {BODY_PARTS.map(p => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all ${active === p ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-[#111] text-gray-400 hover:text-rose-600 border border-gray-100 dark:border-[#1a1a1a]'}`}
          >
            {p}
          </button>
        ))}
      </div>
      
      {/* 3열 가로 그리드 배치 적용하여 3개 영상 모두 노출 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grow">
        {videos.length > 0 ? (
          videos.map((video) => (
            <YoutubeVideoCard key={video.videoId} video={video} />
          ))
        ) : (
          <div className="col-span-3 flex items-center justify-center py-20 text-gray-500 text-sm font-bold">
            영상을 불러오는 중이거나 찾을 수 없습니다.
          </div>
        )}
      </div>

      {/* 유튜브 검색 결과 이동 앵커 추가 */}
      <div className="mt-8 flex justify-center">
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(active + ' 운동')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-[#222] hover:border-rose-500 dark:hover:border-rose-500 bg-gray-50/50 dark:bg-[#080808]/50 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 rounded-2xl text-[0.7rem] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-rose-600 dark:hover:text-rose-500 transition-all duration-300 shadow-sm active:scale-98"
        >
          <span>더 많은 {active} 유튜브 영상 보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
      <p className="text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 mt-6">{active} 테크닉 마스터 클래스</p>
    </Card>
  );
}

export function AiExerciseGuideBox() {
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchAnalysis = async () => {
    setIsRequested(true);
    setIsLoading(true);
    try {
      const res = await getWeeklyAnalysis();
      setAnalysis(res.analysis || []);
    } catch (err) {
      console.error('Failed to fetch analysis', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full min-h-100">
      <CardTitle icon={<SparklesIcon size={18} />}>AI 운동 제안</CardTitle>
      <p className="text-[0.65rem] font-medium text-gray-400 mb-6 px-1 leading-relaxed">
        * 최근 7일간의 건강 데이터를 분석하여 운동 및 식단 솔루션을 제안합니다.
      </p>
      <div className="space-y-6 grow flex flex-col justify-center items-center">
        {!isRequested ? (
          <div className="text-center py-10 px-4 flex flex-col items-center gap-6 animate-in fade-in duration-300 w-full">
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-60">
              최근 7일 동안 기록된 운동과 신체 데이터를 정밀 분석하여 맞춤 솔루션을 도출합니다.
            </p>
            <button
              onClick={handleFetchAnalysis}
              className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white hover:text-white transition-all active:scale-95 shadow-xl shadow-rose-500/5 cursor-pointer flex items-center justify-center gap-2"
            >
              <SparklesIcon size={14} />
              <span>AI 분석 제안 생성</span>
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12 flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <span className="w-6 h-6 border-2 border-rose-500/20 border-t-rose-600 rounded-full animate-spin"></span>
            <p className="text-gray-400 text-xs font-bold">AI 정밀 솔루션 추출 중...</p>
          </div>
        ) : analysis.length === 0 ? (
          <div className="text-center py-12 px-4 flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <p className="text-gray-400 text-xs font-bold">분석에 필요한 7일간의 운동/신체 데이터가 부족합니다.</p>
            <button
              onClick={handleFetchAnalysis}
              className="text-[0.6rem] font-black text-rose-500 uppercase tracking-widest hover:underline cursor-pointer"
            >
              다시 시도하기
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6 animate-in fade-in duration-500">
            {analysis.map((item, idx) => (
              <InfoCard 
                key={idx} 
                icon={<TargetIcon size={20} />} 
                title={item.title} 
                text={item.content} 
                iconColor="text-rose-500" 
                hoverBg="hover:bg-rose-50 dark:hover:bg-rose-950/20" 
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export function TrainingSessionBox() {
  const [duration, setDuration] = useState('');
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePart = (part: string) => {
    setBodyParts(prev => prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]);
  };

  const handleSave = async () => {
    if (!duration || bodyParts.length === 0 || isLoading) return;
    setIsLoading(true);
    try {
      await saveExercise({
        duration: parseInt(duration, 10),
        bodyParts,
        content
      });
      setDuration('');
      setBodyParts([]);
      setContent('');
      alert('운동 기록이 저장되었습니다.');
    } catch(err) {
      console.error('Failed to save exercise', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDuration('');
    setBodyParts([]);
    setContent('');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardTitle icon={<DumbbellIcon size={18} />}>오늘의 운동 기록</CardTitle>

      <div className="space-y-6 grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">운동 시간</label>
            <div className="relative">
              <input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0" 
                className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 text-lg font-black outline-none focus:ring-2 focus:ring-rose-500 transition-all pr-12" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-gray-400 uppercase">분</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">운동 부위</label>
            <div className="grid grid-cols-3 gap-2">
              {BODY_PARTS.map(part => (
                <button 
                  key={part} 
                  onClick={() => togglePart(part)}
                  className={`py-3 border border-gray-100 dark:border-[#1a1a1a] rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${bodyParts.includes(part) ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-gray-50 dark:bg-[#111] text-gray-400 hover:text-rose-600'}`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">트레이닝 노트</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 집중도, 세트 구성, 신체 반응을 기록하세요..."
            className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-4xl p-6 text-sm text-gray-800 dark:text-gray-200 min-h-30 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium leading-relaxed resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button 
          onClick={handleSave}
          disabled={isLoading || !duration || bodyParts.length === 0}
          className="py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl shadow-rose-500/10 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? '저장 중...' : '세션 완료 및 저장'}
        </button>
        <button 
          onClick={handleReset}
          className="py-4 border border-gray-100 dark:border-[#1a1a1a] text-gray-500 rounded-2xl text-sm font-black active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-[#0a0a0a] cursor-pointer"
        >
          초기화
        </button>
      </div>
    </Card>
  );
}

export function BodyCompositionBox() {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!weight || !bodyFat || isLoading) return;
    setIsLoading(true);
    try {
      await saveWeight({
        weight: parseFloat(weight),
        bodyFat: parseFloat(bodyFat)
      });
      setWeight('');
      setBodyFat('');
      alert('신체 데이터가 업데이트되었습니다.');
    } catch(err) {
      console.error('Failed to save weight', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardTitle icon={<TrendIcon size={18} />}>My Body</CardTitle>
      <div className="space-y-6 mb-10">
        <FieldInput 
          label="체중 (kg)" 
          value={weight}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
          type="number" 
          placeholder="0.0" 
          step="0.1" 
          focusColor="focus:ring-rose-500" 
        />
        <FieldInput 
          label="체지방률 (%)" 
          value={bodyFat}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setBodyFat(e.target.value)}
          type="number" 
          placeholder="0.0" 
          step="0.1" 
          focusColor="focus:ring-rose-500" 
        />
      </div>
      <button 
        onClick={handleSave}
        disabled={isLoading || !weight || !bodyFat}
        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl shadow-rose-500/10 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? '저장 중...' : '데이터 업데이트'}
      </button>
    </Card>
  );
}

export function ExerciseDashboardBox({ onViewReport }: { onViewReport?: () => void }) {
  return (
    <Card className="p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tightest uppercase">트레이닝 인텔리전스</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">고정밀 신체 데이터 추적 및 분석 시스템.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onViewReport}
            className="flex-1 md:flex-none text-[0.6rem] font-black uppercase tracking-[0.2em] px-8 py-4 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:bg-rose-50 dark:hover:bg-[#1a1a1a] transition-all cursor-pointer"
          >
            운동 리포트
          </button>
          <button className="flex-1 md:flex-none text-[0.6rem] font-black uppercase tracking-[0.2em] px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-rose-500/10">최적화 시작</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">근성장 속도</h3>
          <BarChart data={WEEKLY_DATA} labels={DAYS} activeColor="group-hover:bg-rose-600" labelActiveColor="group-hover:text-rose-600" height="h-[280px]" />
        </div>
        <div className="space-y-10">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">퍼포먼스 인덱스</h3>
          <div className="grid grid-cols-1 gap-8">
            {[
              { label: '지속성 스코어', value: '85', unit: '%', badge: '+5.2% 상승' },
              { label: '누적 운동 볼륨', value: '12.4', unit: 'TON', badge: '주간 합계' },
            ].map(({ label, value, unit, badge }) => (
              <div key={label} className="p-8 rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a] bg-gray-50/50 dark:bg-[#050505]/50 hover:border-rose-300 transition-all">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black tracking-tightest">{value}<span className="text-xl ml-1 text-rose-500 font-black">{unit}</span></span>
                  <span className="text-xs text-emerald-500 font-black mb-1.5 uppercase tracking-wider">{badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
