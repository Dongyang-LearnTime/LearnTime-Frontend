import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, BookOpen, Command, AlertCircle } from 'lucide-react';

import { MenuBar } from './MenuBar';
import '../../../../styles/NotesEditor.css';

// 단축키 목록
const SHORTCUT_GUIDE = [
  { keys: 'Ctrl+B', label: '굵게' },
  { keys: 'Ctrl+I', label: '기울임' },
  { keys: 'Ctrl+Alt+1~3', label: '제목' },
  { keys: 'Ctrl+Shift+7', label: '번호 목록' },
  { keys: 'Ctrl+Shift+8', label: '기호 목록' },
];

export interface NotesEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => Promise<void>;
  submitButtonText: string;
}

export function NotesEditor({
  initialTitle = '',
  initialContent = '',
  onSubmit,
  submitButtonText,
}: NotesEditorProps) {
  const [title, setTitle] = useState<string>(initialTitle);
  const [notesError, setNotesError] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(!initialContent);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false); // 변경사항 여부 추적

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
      setIsDirty(true); // 에디터 내용 변경 시 dirty 상태로 변경
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none min-h-[500px] py-8 px-8 sm:px-12',
      },
    },
  });

  // initialContent가 나중에 로딩될 경우 대비 (수정 페이지)
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  // 창 닫기, 새로고침 등 페이지 이탈 시도 시 브라우저 경고창 띄우기
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async () => {
    if (!title.trim()) {
      setNotesError('노트 제목을 입력해주세요.');
      return;
    }

    setNotesError('');

    if (editor) {
      try {
        setIsDirty(false); // 저장 시도 중에는 이탈 방지 해제 (이동을 위해)
        await onSubmit(title, editor.getHTML());
      } catch (error: any) {
        setIsDirty(true); // 실패 시 다시 이탈 방지 활성화
        // 에러 메세지가 넘어오면 세팅, 아니면 기본 메세지
        setNotesError(error?.message || '저장 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 bg-white">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-5 w-full">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <BookOpen size={28} className="stroke-[1.5]" />
              </div>
              <div className="grow">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= 100) {
                      setTitle(newValue);
                      setIsDirty(true); // 제목 변경 시 dirty 상태로 변경
                      if (notesError) setNotesError(''); // 입력 시 에러 초기화
                    }
                  }}
                  maxLength={100}
                  className="text-2xl sm:text-3xl font-bold text-slate-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded-lg px-2 -ml-2 w-full transition-all"
                  placeholder="노트 제목을 입력하세요"
                />
              </div>
            </div>

            {notesError && (
              <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={15} className="shrink-0" />
                <p className="text-xs sm:text-sm font-medium">{notesError}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-sm shrink-0 w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200/50 hover:shadow-lg active:scale-[0.98]"
          >
            <Save size={20} />
            {submitButtonText}
          </button>
        </div>

        {/* Editor Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-md focus-within:shadow-indigo-100/50">
          <MenuBar editor={editor!} />

          <div className="relative grow bg-white">
            {!isFocused && isEmpty && (
              <div className="absolute top-8 left-8 sm:left-12 text-slate-400 pointer-events-none text-[1.05rem]">
                여기에 오늘 학습한 내용을 자유롭게 작성해보세요...
              </div>
            )}
            <div
              className="h-full overflow-y-auto cursor-text"
              onClick={() => editor?.commands.focus()}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 text-sm text-slate-500 flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5">
              <Command size={14} className="text-slate-400" />
              <span>단축키 안내</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              {SHORTCUT_GUIDE.map((item) => (
                <span key={item.keys}>
                  <kbd className="font-sans px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">
                    {item.keys}
                  </kbd>{' '}
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
