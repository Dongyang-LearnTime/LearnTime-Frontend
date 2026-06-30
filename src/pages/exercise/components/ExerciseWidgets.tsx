import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SparklesIcon, DumbbellIcon, TargetIcon, TrendIcon, PlayCircleIcon, TrashIcon } from '../../../components/ui/Icons';
import { Card, CardTitle } from '../../../components/common/Card';
import { InfoCard } from '../../../components/common/InfoCard';
import { FieldInput } from '../../../components/common/FieldInput';
import { getWeeklyAnalysis, getRecommendedVideos, saveExercise, saveWeight, getExercises, deleteExercise, getRecentWeights, deleteWeight, getWeeklyWeightMetrics } from '../api/exerciseApi';
import type { AnalysisItem, YoutubeVideoResponse, ExerciseResponse, WeightResponse, WeeklyWeightStatsResponse } from '../types/exerciseTypes';
import { toast } from '../../../utils/toast';

const BODY_PARTS = ['가슴', '등', '어깨', '이두', '삼두', '하체'];

interface YoutubeVideoCardProps {
  video: YoutubeVideoResponse;
}

function YoutubeVideoCard({ video }: YoutubeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // 썸네일 주소가 비어있을 경우 고화질 기본 썸네일을 Fallback으로 적용합니다.
  const thumbnailUrl = video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <>
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

      {/* 모달 렌더링 영역 (React Portal을 사용해 document.body로 마운트하여 부모의 쌓임 맥락을 우회하고 MainHeader 위로 렌더링되도록 처리) */}
      {isPlaying && createPortal(
        <div 
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setIsPlaying(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button 
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
              aria-label="닫기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
        </div>,
        document.body
      )}
    </>
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
            className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all ${active === p ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-[#202026] text-gray-400 hover:text-rose-600 border border-gray-100 dark:border-[#1a1a1a]'}`}
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
          className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-[#222] hover:border-rose-500 dark:hover:border-rose-500 bg-gray-50/50 dark:bg-[#18181f]/50 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 rounded-2xl text-[0.7rem] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-rose-600 dark:hover:text-rose-500 transition-all duration-300 shadow-sm active:scale-98"
        >
          <span>더 많은 {active} 운동 영상 보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </Card>
  );
}


interface ExerciseSaveModalProps {
  onClose: () => void;
  onSaveSuccess: () => void;
  isFirstExerciseToday: boolean;
}

function ExerciseSaveModal({ onClose, onSaveSuccess, isFirstExerciseToday }: ExerciseSaveModalProps) {
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const togglePart = (part: string) => {
    setBodyParts(prev => prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]);
  };

  const handleSave = async () => {
    if (!duration || bodyParts.length === 0 || isLoading) return;
    setIsLoading(true);
    try {
      await saveExercise({
        duration: parseInt(duration, 10),
        weight: weight ? parseFloat(weight) : null,
        bodyParts,
        content
      });
      
      const resultMsg = isFirstExerciseToday ? "포인트 10지급 완료!" : "기록이 완료되었습니다!";
      setSuccessMessage(resultMsg);
      
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to save exercise', err);
      toast.error('운동 기록 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDuration('');
    setWeight('');
    setBodyParts([]);
    setContent('');
  };

  if (successMessage) {
    return createPortal(
      <div 
        className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      >
        <div 
          className="bg-white dark:bg-[#1a1a1f] w-full max-w-lg rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col items-center justify-center py-12 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 animate-bounce">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2" id="completion-success-title">완료되었습니다!</h3>
          <p className="text-base font-bold text-gray-600 dark:text-gray-400" id="completion-success-message">{successMessage}</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div 
        className="bg-white dark:bg-[#1a1a1f] w-full max-w-lg rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-gray-50 dark:bg-[#202026] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-2xl text-gray-400 transition-all z-10 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <CardTitle icon={<DumbbellIcon size={18} />}>오늘의 운동 기록 추가</CardTitle>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">운동 시간</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="0" 
                  className="w-full bg-gray-50 dark:bg-[#15151a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 text-base font-black outline-none focus:ring-2 focus:ring-rose-500 transition-all pr-12 text-gray-800 dark:text-gray-200" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-gray-400 uppercase">분</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">운동 중량</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0" 
                  step="0.1"
                  className="w-full bg-gray-50 dark:bg-[#15151a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl p-4 text-base font-black outline-none focus:ring-2 focus:ring-rose-500 transition-all pr-12 text-gray-800 dark:text-gray-200" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-gray-400 uppercase">kg</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">운동 부위</label>
            <div className="grid grid-cols-3 gap-2">
              {BODY_PARTS.map(part => (
                <button 
                  key={part} 
                  onClick={() => togglePart(part)}
                  className={`py-2 border border-gray-100 dark:border-[#1a1a1a] rounded-xl text-xs font-black uppercase tracking-tighter transition-all flex items-center justify-center cursor-pointer ${bodyParts.includes(part) ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-gray-50 dark:bg-[#202026] text-gray-400 hover:text-rose-600'}`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 ml-1 block">트레이닝 노트</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘의 집중도, 세트 구성, 신체 반응을 기록하세요..."
              className="w-full bg-gray-50 dark:bg-[#15151a] border border-gray-100 dark:border-[#1a1a1a] rounded-3xl p-5 text-sm text-gray-800 dark:text-gray-200 min-h-24 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={handleSave}
              disabled={isLoading || !duration || bodyParts.length === 0}
              className="py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? '저장 중...' : '저장 완료'}
            </button>
            <button 
              onClick={handleReset}
              className="py-3.5 border border-gray-100 dark:border-[#1a1a1a] text-gray-500 rounded-2xl text-sm font-black active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-[#0a0a0a] cursor-pointer"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface TrainingSessionBoxProps {
  /** 운동 기록이 추가되거나 삭제되었을 때 부모 컴포넌트에 이를 알리는 콜백 함수 */
  onExerciseChange: () => void;
}

export function TrainingSessionBox({ onExerciseChange }: TrainingSessionBoxProps) {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExercises = async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (error) {
      console.error('Failed to fetch exercises', error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const isFirstExerciseToday = useMemo(() => {
    const todayStr = new Date().toDateString();
    return !exercises.some(ex => new Date(ex.createdAt).toDateString() === todayStr);
  }, [exercises]);

  const handleDelete = async (id: number) => {
    if (window.confirm("이 운동 기록을 삭제하시겠습니까?")) {
      try {
        await deleteExercise(id);
        setExercises(prev => prev.filter(e => e.id !== id));
        // 삭제 성공 시 부모 컴포넌트에 변경 사항을 알립니다.
        onExerciseChange();
      } catch (err) {
        console.error('Failed to delete exercise', err);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col min-h-125">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <CardTitle icon={<DumbbellIcon size={18} />}>오늘의 운동 기록</CardTitle>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-rose-500/10 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>기록 추가</span>
        </button>
      </div>

      {/* 과거 기록 리스트 (스크롤 영역) */}
      <div className="grow overflow-y-auto max-h-[300px] pr-2 custom-scrollbar border-t border-gray-100 dark:border-[#1a1a1a] pt-6 space-y-3">
        <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-2 px-1">기록 히스토리</h4>
        {exercises.length === 0 && <p className="text-xs text-gray-400 font-medium italic text-center mt-6">최근 운동 기록이 없습니다.</p>}
        {exercises.map((ex) => (
          <div key={ex.id} className="flex justify-between items-center bg-gray-50/50 dark:bg-[#15151a]/50 border border-gray-100 dark:border-[#1a1a1a] p-4 rounded-2xl hover:border-rose-200 transition-all group">
            <div className="min-w-0 grow mr-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 line-clamp-1">{ex.bodyParts.join(', ')} 운동</span>
                <span className="text-[0.6rem] font-bold text-gray-400">
                  {new Date(ex.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[0.65rem] font-black text-rose-500/80 uppercase">시간 {ex.duration}분</span>
                {ex.weight != null && (
                  <span className="text-[0.65rem] font-black text-emerald-500/80 uppercase">중량 {ex.weight}kg</span>
                )}
                <span className="text-[0.65rem] font-black text-amber-500/80 uppercase">
                  {ex.calories !== null ? `소모 ${ex.calories}Kcal` : '소모 ⏳ 계산 중'}
                </span>
              </div>
              {ex.content && (
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1.5 break-all">
                  {ex.content}
                </p>
              )}
            </div>
            <button 
              onClick={() => handleDelete(ex.id)} 
              className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
              title="삭제"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ExerciseSaveModal 
          onClose={() => setIsModalOpen(false)} 
          onSaveSuccess={async () => {
            await fetchExercises();
            // 기록 등록 성공 시 부모 컴포넌트에 변경 사항을 알립니다.
            onExerciseChange();
          }} 
          isFirstExerciseToday={isFirstExerciseToday}
        />
      )}
    </Card>
  );
}

export function BodyCompositionBox() {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentWeights, setRecentWeights] = useState<WeightResponse[]>([]);

  const fetchRecentWeights = async () => {
    try {
      const data = await getRecentWeights();
      setRecentWeights(data);
      if (data.length > 0 && !weight && !bodyFat) {
        setWeight(data[0].weight.toString());
        setBodyFat(data[0].bodyFat.toString());
      }
    } catch (error) {
      console.error('Failed to fetch recent weights', error);
    }
  };

  useEffect(() => {
    fetchRecentWeights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!weight || !bodyFat || isLoading) return;
    setIsLoading(true);
    try {
      await saveWeight({
        weight: parseFloat(weight),
        bodyFat: parseFloat(bodyFat)
      });
      fetchRecentWeights(); // 저장 직후 목록 갱신 및 입력창 유지
    } catch(err) {
      console.error('Failed to save weight', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("이 신체 기록을 삭제하시겠습니까?")) {
      try {
        await deleteWeight(id);
        setRecentWeights(prev => prev.filter(w => w.id !== id));
      } catch (err) {
        console.error('Failed to delete weight', err);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col min-h-162.5">
      <CardTitle icon={<TrendIcon size={18} />}>My Body</CardTitle>
      
      <div className="space-y-6 mb-8 shrink-0">
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
        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black active:scale-95 transition-all shadow-xl shadow-rose-500/10 disabled:opacity-50 cursor-pointer shrink-0 mb-8"
      >
        {isLoading ? '저장 중...' : '데이터 업데이트'}
      </button>

      {/* 과거 신체 데이터 리스트 (스크롤 영역) */}
      <div className="grow overflow-y-auto pr-2 custom-scrollbar border-t border-gray-100 dark:border-[#1a1a1a] pt-6 space-y-3">
        <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-2 px-1">최근 측정 히스토리</h4>
        {recentWeights.length === 0 && <p className="text-xs text-gray-400 font-medium italic text-center mt-6">기록된 신체 데이터가 없습니다.</p>}
        {recentWeights.map((w) => (
          <div key={w.id} className="flex justify-between items-center bg-gray-50/50 dark:bg-[#15151a]/50 border border-gray-100 dark:border-[#1a1a1a] p-4 rounded-2xl hover:border-rose-200 transition-all group">
            <div className="min-w-0 grow mr-4 flex flex-col gap-1">
              <span className="text-[0.65rem] font-bold text-gray-400">
                {new Date(w.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-3">
                <span className="text-sm font-black text-gray-800 dark:text-gray-200">
                  {w.weight} <span className="text-[0.6rem] text-gray-400 font-bold uppercase">kg</span>
                </span>
                <span className="text-sm font-black text-rose-500">
                  {w.bodyFat} <span className="text-[0.6rem] text-gray-400 font-bold uppercase">%</span>
                </span>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(w.id)} 
              className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
              title="삭제"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface ExerciseDashboardBoxProps {
  /** 그래프 데이터를 새로 불러오기 위한 트리거 키 */
  refreshKey: number;
}

export function ExerciseDashboardBox({ refreshKey }: ExerciseDashboardBoxProps) {
  // 주간 무게 통계 상태
  const [weeklyStats, setWeeklyStats] = useState<WeeklyWeightStatsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // AI 분석 상태 (기존 AiExerciseGuideBox에서 이전)
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getWeeklyWeightMetrics()
      .then(data => {
        if (isMounted) {
          setWeeklyStats(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Failed to fetch weekly weight metrics", err);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // AI 분석 버튼 핸들러 (기존 AiExerciseGuideBox의 handleFetchAnalysis)
  const handleFetchAnalysis = async () => {
    setIsAnalysisRequested(true);
    setIsAnalysisLoading(true);
    try {
      const res = await getWeeklyAnalysis();
      setAnalysis(res.analysis || []);
    } catch (err) {
      console.error('Failed to fetch analysis', err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const chartData = useMemo(() => {
    // 최근 7일간의 로컬 날짜(YYYY-MM-DD) 배열을 기본 그리드로 생성합니다.
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    // 백엔드 통계 데이터 목록을 Date 문자열 키 기준의 맵으로 매핑합니다.
    const statsMap = new Map<string, number>();
    weeklyStats.forEach(stat => {
      if (stat.date) {
        const d = new Date(stat.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        statsMap.set(key, stat.dailyTotalWeight);
      }
    });

    // 7일간의 타임라인을 채워서 기록이 없는 날도 X축에 표시되도록 보장합니다.
    return dates.map(date => {
      const weight = statsMap.get(date);
      return {
        date,
        weight: weight !== undefined ? weight : 0,
      };
    });
  }, [weeklyStats]);

  return (
    <Card className="p-10">
      {/* 헤더 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tightest uppercase">일주일 간 운동 통계</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">최근 7일간의 운동 무게 통계와 AI 맞춤 분석을 제공합니다.</p>
        </div>
        {/* AI 분석 버튼 — 학습 스튜디오 AI 진도 분석 버튼 디자인 기준으로 통일 (크기는 기존 유지) */}
        <button
          onClick={handleFetchAnalysis}
          disabled={isAnalysisLoading}
          className={`flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.2em] px-8 py-4 bg-linear-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-2xl transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 cursor-pointer ${isAnalysisLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'} disabled:opacity-50`}
        >
          <SparklesIcon size={14} />
          <span>{isAnalysisLoading ? 'AI 분석 중...' : 'AI 분석'}</span>
        </button>
      </div>

      {/* 차트 영역 (전체 너비 확장) */}
      <div className="space-y-4">
        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">일별 총 중량 (kg)</h3>
        <div className="w-full h-70">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-xs font-bold text-gray-400 bg-gray-50 dark:bg-[#0a0a0a] rounded-3xl">
              데이터를 불러오는 중...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-[#1f1f1f]" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '12px' }}
                  itemStyle={{ color: '#fff', paddingTop: '4px' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                  cursor={{ stroke: '#f43f5e', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="총 중량"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI 분석 결과 영역 (버튼 클릭 후 표시) */}
      {isAnalysisRequested && (
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-[#1a1a1a] animate-in fade-in duration-500">
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 mb-6">AI 운동 분석 결과</h3>
          {isAnalysisLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <span className="w-6 h-6 border-2 border-rose-500/20 border-t-rose-600 rounded-full animate-spin"></span>
              <p className="text-gray-400 text-xs font-bold">AI 정밀 솔루션 추출 중...</p>
            </div>
          ) : analysis.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <p className="text-gray-400 text-xs font-bold">분석에 필요한 7일간의 운동/신체 데이터가 부족합니다.</p>
              <button
                onClick={handleFetchAnalysis}
                className="text-[0.6rem] font-black text-rose-500 uppercase tracking-widest hover:underline cursor-pointer"
              >
                다시 시도하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in duration-500">
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
      )}
    </Card>
  );
}
