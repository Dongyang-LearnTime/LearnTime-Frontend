import { XIcon } from '../../ui/Icons';

// PostWriteModal 컴포넌트의 Props 타입 정의
interface PostWriteModalProps {
  editingPostId: string | null;
  content: string;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

// 새 글 작성 혹은 기존 글 편집을 위한 에디터 모달 팝업 컴포넌트
export function PostWriteModal({
  editingPostId,
  content,
  onContentChange,
  onSave,
  onClose,
}: PostWriteModalProps) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-xl rounded-[3rem] border border-gray-100 dark:border-[#1a1a1a] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        
        {
          // 모달 헤더: 모드(작성/수정)별 타이틀 렌더링 및 닫기 버튼
        }
        <header className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black tracking-tight">
            {editingPostId ? '글 수정' : '새 생각 공유'}
          </h3>
          <button 
            onClick={onClose}
            className="p-3 bg-gray-50 dark:bg-[#111] hover:bg-gray-100 rounded-2xl text-gray-400 transition-all"
          >
            <XIcon size={20} />
          </button>
        </header>

        {
          // 입력 폼 영역 (텍스트 입력창 및 저장/등록 버튼)
        }
        <div className="space-y-6">
          <textarea 
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="오늘의 성장이나 고민을 공유해 보세요..."
            className="w-full bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] p-8 text-lg font-medium min-h-[250px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
          <button 
            onClick={onSave}
            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
            {editingPostId ? '수정 완료' : '업로드하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
