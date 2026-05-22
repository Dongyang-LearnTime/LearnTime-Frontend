// ============================================================
// components/section/study/ChecklistBox.tsx
// 학습 마일스톤 체크리스트.
// - React Query 서버 상태 연동
// - 순서 변경(move)은 추후 DB 연동(order_index) 시 활성화 예정
// ============================================================
import { useState } from 'react';
import type { Todo } from '../../../types';
import { useTodos } from '../../../hooks/queries/useTodos';
import { SparklesIcon, EditIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from '../../ui/Icons';
import { Card, CardTitle } from '../../common/Card';

export function ChecklistBox() {
  // useTodos CRUD 메서드 매핑
  const { todos, createTodo, updateTodo, deleteTodo } = useTodos();
  
  // 임시 로컬 UI 상태
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  /**
   * @description 완료 상태 토글
   * - PUT 요청 및 낙관적 업데이트 적용
   */
  const toggle = (todo: Todo) => updateTodo({ id: todo.id, dto: { completed: !todo.completed } });

  /**
   * @description Todo 신규 추가 (개인 일정)
   * - POST 요청 수행
   */
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    createTodo({ text: input, completed: false, isAi: false });
    setInput('');
  };

  /**
   * @description Todo 삭제
   */
  const remove = (id: string) => deleteTodo(id);

  /**
   * @description 인라인 편집 모드 시작
   */
  const startEdit = (todo: Todo) => { setEditingId(todo.id); setEditValue(todo.text); };

  /**
   * @description 인라인 편집 저장
   */
  const saveEdit = (id: string) => { 
    updateTodo({ id, dto: { text: editValue } }); 
    setEditingId(null); 
  };

  /**
   * @description 순서 이동
   * @param {string} id - 대상 Todo ID
   * @param {-1 | 1} dir - 방향 (-1: 위, 1: 아래)
   */
  const move = (id: string, dir: -1 | 1) => {
    console.warn("순서 변경 기능은 백엔드 API (bulk update) 연동 후 활성화됩니다.", id, dir);
    alert("순서 변경 기능은 서버 연동 후 지원됩니다. DB 스키마에 order_index가 추가될 예정입니다.");
  };

  return (
    <Card className="h-full border-t-4 border-indigo-500">
      <CardTitle>오늘의 진도</CardTitle>
      
      {/* AI 추천 / 개인 일정 구분 렌더링 */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8 mb-6">
        {['AI 추천', '개인 일정'].map(type => {
          const isAiType = type === 'AI 추천';
          const items = todos.filter(t => t.isAi === isAiType);
          return (
            <div key={type}>
              <h3 className={`text-[0.65rem] font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2 ${isAiType ? 'text-indigo-500' : 'text-gray-400'}`}>
                {isAiType ? <SparklesIcon size={12} /> : <EditIcon size={12} />} {type}
              </h3>
              <div className="space-y-4">
                {items.length === 0 && <p className="text-xs text-gray-400 font-medium italic ml-1">항목이 없습니다.</p>}
                {items.map((todo, idx) => (
                  <div key={todo.id} className="flex items-center justify-between group p-4 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                    
                    {/* 체크박스 및 텍스트 */}
                    <label className="flex items-center gap-4 cursor-pointer flex-grow overflow-hidden">
                      <input type="checkbox" className="hidden" checked={todo.completed} onChange={() => toggle(todo)} />
                      <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 dark:border-[#27272a]'}`}>
                        {todo.completed && <CheckIcon size={14} className="text-white" />}
                      </div>
                      
                      {/* 편집 모드 조건부 렌더링 */}
                      {editingId === todo.id ? (
                        <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => saveEdit(todo.id)} onKeyDown={e => e.key === 'Enter' && saveEdit(todo.id)} className="text-sm bg-transparent border-b border-indigo-600 outline-none w-full font-bold" />
                      ) : (
                        <span className={`text-sm font-bold tracking-tight ${todo.completed ? 'text-gray-400 line-through opacity-50' : 'text-gray-800 dark:text-gray-200'}`} onDoubleClick={() => startEdit(todo)}>{todo.text}</span>
                      )}
                    </label>

                    {/* 컨트롤 툴바 (수정, 이동, 삭제) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      <button onClick={() => startEdit(todo)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"><EditIcon size={14} /></button>
                      <button onClick={() => move(todo.id, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"><ArrowUpIcon size={14} /></button>
                      <button onClick={() => move(todo.id, 1)} disabled={idx === items.length - 1} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"><ArrowDownIcon size={14} /></button>
                      <button onClick={() => remove(todo.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"><TrashIcon size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 추가 폼 */}
      <form onSubmit={add} className="flex gap-3 shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="새 작업 추가..." className="flex-grow bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" />
        <button type="submit" className="px-8 bg-black dark:bg-white text-white dark:text-black text-sm font-black rounded-2xl active:scale-95 transition-transform">추가</button>
      </form>
    </Card>
  );
}


