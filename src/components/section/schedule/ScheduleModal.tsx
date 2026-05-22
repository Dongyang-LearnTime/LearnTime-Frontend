import { StarIcon } from '../../ui/Icons';
import type { Schedule } from './types';
import { DAYS } from './constants';

// ScheduleModal 컴포넌트 Props 정의
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  formData: Partial<Schedule>;
  onChangeField: (field: keyof Schedule, value: any) => void;
  onToggleRepeatDay: (dayIndex: number) => void;
  onSave: () => void;
}

// 새 일정을 등록하거나 기존 일정을 편집할 수 있는 모달 팝업 컴포넌트
export function ScheduleModal({
  isOpen,
  onClose,
  editingId,
  formData,
  onChangeField,
  onToggleRepeatDay,
  onSave,
}: ScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        {
          // 모달 헤더 영역 (제목 및 즐겨찾기 스위치)
        }
        <header className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black tracking-tight">{editingId ? '일정 수정' : '새 일정 계획'}</h3>
          <button 
            onClick={() => onChangeField('isFavorite', !formData.isFavorite)}
            className={`p-3 rounded-2xl transition-all ${formData.isFavorite ? 'bg-indigo-500/10 text-indigo-500' : 'bg-gray-50 dark:bg-[#111] text-gray-400'}`}
          >
            <StarIcon size={20} className={formData.isFavorite ? 'fill-indigo-500' : ''} />
          </button>
        </header>

        {
          // 일정 입력 폼 영역
        }
        <div className="space-y-6">
          {
            // 일정 제목 입력
          }
          <div>
            <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">제목</label>
            <input 
              type="text" 
              value={formData.title || ''}
              onChange={(e) => onChangeField('title', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold text-lg"
              placeholder="무엇을 하실 건가요?"
            />
          </div>

          {
            // 일정 시작 / 종료 시간 지정
          }
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">시작 시간</label>
              <input 
                type="time" 
                value={formData.startTime || ''}
                onChange={(e) => onChangeField('startTime', e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">종료 시간</label>
              <input 
                type="time" 
                value={formData.endTime || ''}
                onChange={(e) => onChangeField('endTime', e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
          </div>

          {
            // 일정 유형 선택 (일회성 일정 / 반복 루틴)
          }
          <div>
            <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">유형</label>
            <div className="flex gap-3 bg-gray-50 dark:bg-[#111] p-1.5 rounded-[1.5rem]">
              <button 
                onClick={() => onChangeField('type', 'schedule')}
                className={`flex-grow py-4 rounded-2xl font-black transition-all ${formData.type === 'schedule' ? 'bg-white dark:bg-[#1a1a1a] shadow-lg text-black dark:text-white' : 'text-gray-400'}`}
              >
                일회성 일정
              </button>
              <button 
                onClick={() => onChangeField('type', 'routine')}
                className={`flex-grow py-4 rounded-2xl font-black transition-all ${formData.type === 'routine' ? 'bg-white dark:bg-[#1a1a1a] shadow-lg text-black dark:text-white' : 'text-gray-400'}`}
              >
                반복 루틴
              </button>
            </div>
          </div>

          {
            // 유형에 따라 반복 요일 또는 날짜 입력 필드 렌더링
          }
          {formData.type === 'routine' ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">반복 요일</label>
              <div className="flex justify-between gap-2">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => onToggleRepeatDay(index)}
                    className={`w-11 h-11 rounded-full font-black text-sm transition-all ${formData.repeatDays?.includes(index) ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-50 dark:bg-[#111] text-gray-400 hover:bg-gray-100'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">날짜</label>
              <input 
                type="date" 
                value={formData.date || ''}
                onChange={(e) => onChangeField('date', e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
          )}
        </div>

        {
          // 하단 버튼 그룹 (취소 / 저장)
        }
        <div className="flex gap-4 mt-12">
          <button 
            onClick={onClose}
            className="flex-grow py-5 bg-gray-50 dark:bg-[#111] text-gray-500 rounded-[1.5rem] font-black hover:bg-gray-100 transition-all"
          >
            취소
          </button>
          <button 
            onClick={onSave}
            className="flex-grow py-5 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {editingId ? '수정 완료' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
