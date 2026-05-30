import { useState, useEffect } from 'react';
import { Card, CardTitle } from '../../../../components/common/Card';
import { EditIcon, TrashIcon } from '../../../../components/ui/Icons';
import type { StudyMemberContentResponse } from '../../types/studyTypes';
import { addStudyMemberContentApi, updateStudyMemberContentApi, getStudyMemberContentApi, deleteStudyMemberContentApi } from '../../api/studyStudioApi';
import FormattedPlanContent from './FormattedPlanContent';

type MemberContentItem = StudyMemberContentResponse['memberContents'][0];

interface StudyMemberContentProps {
  studyId: string;
  planDate: string;
}

export default function StudyMemberContent({ studyId, planDate }: StudyMemberContentProps) {

  const [ studyDailyPlanId, setStudyDailyPlanId ] = useState<number | null>(null);
  const [ planContent, setPlanContent ] = useState<string | null>(null);
  const [ isHoliday, setIsHoliday ] = useState<boolean>(false);
  const [ memberContents, setMemberContents ] = useState<MemberContentItem[]>([]);
  
  const [ inputValue, setInputValue ] = useState('');
  const [ editingId, setEditingId ] = useState<number | null>(null);
  const [ editValue, setEditValue ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  // 컴포넌트 마운트 시 (또는 날짜 변경 시) 초기 진도 내용 불러오기
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const data = await getStudyMemberContentApi(studyId, planDate);
        setStudyDailyPlanId(data.studyDailyPlanId);
        setPlanContent(data.planContent);
        setIsHoliday(data.isHoliday ?? false);
        setMemberContents(data.memberContents || []);
      } catch (error) {
        console.error("진도 내용을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (studyId && planDate) {
      fetchContent();
    }
  }, [studyId, planDate]);

  // 일정 추가 핸들러
  const handleAddContent = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !studyDailyPlanId) return;

    try {
      setIsLoading(true);
      const newId = await addStudyMemberContentApi(
        studyDailyPlanId,
        inputValue.trim()
      );

      const newItem: MemberContentItem = {
        studyMemberContentId: newId,
        memberContent: inputValue.trim(),
      };
      setMemberContents((prev) => [...prev, newItem]);
      setInputValue('');
    } catch (error) {
      console.error("진도 추가 실패:", error);
      alert("공부 내용을 등록하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 일정 삭제 핸들러
  const handleDeleteContent = async (id: number) => {
    try {
      await deleteStudyMemberContentApi(id);
      setMemberContents((prev) => prev.filter((item) => item.studyMemberContentId !== id));
    } catch (error) {
      console.error("진도 삭제 실패:", error);
      alert("공부 내용을 삭제하는데 실패했습니다.");
    }
  };

  // 인라인 편집 시작
  const startEdit = (item: MemberContentItem) => {
    setEditingId(item.studyMemberContentId);
    setEditValue(item.memberContent);
  };

  // 인라인 편집 저장
  const saveEdit = async (id: number) => {
    if (!editValue.trim() || !studyDailyPlanId) return;
    
    try {
      setIsLoading(true);
      await updateStudyMemberContentApi(
        id,
        editValue.trim()
      );

      setMemberContents((prev) =>
        prev.map((item) =>
          item.studyMemberContentId === id ? { ...item, memberContent: editValue.trim() } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("진도 수정 실패:", error);
      alert("공부 내용을 수정하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group">
      <CardTitle icon={<EditIcon size={18} />}>오늘의 진도</CardTitle>

      <div className="grow overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
        {isLoading ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-[#1a1a1a] rounded-lg"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl mt-2"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#111] rounded-2xl"></div>
          </div>
        ) : isHoliday ? (
          <div className="py-14 flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl block mb-4">🏝️</span>
            <p className="text-gray-500 font-bold text-sm leading-relaxed">
              오늘은 스터디 휴무일입니다.<br />
              진도 내용을 등록할 수 없습니다.
            </p>
          </div>
        ) : (
          <>
            {planContent && (
              <div className="mb-6 p-4 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm text-sm">
                <FormattedPlanContent planContent={planContent} />
              </div>
            )}

            {memberContents.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium italic ml-1">등록된 공부 내용이 없습니다.</p>
            ) : (
              memberContents.map((item) => (
                <div key={item.studyMemberContentId} className="flex items-center justify-between group p-4 bg-gray-50/50 dark:bg-[#050505]/50 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
              
              {/* 텍스트 컨텐츠 */}
              <div className="flex items-center gap-3 grow overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                
                {/* 편집 모드 조건부 렌더링 */}
                {editingId === item.studyMemberContentId ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(item.studyMemberContentId)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.studyMemberContentId)}
                    className="text-sm bg-transparent border-b border-indigo-600 outline-none w-full font-bold text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className="text-sm font-bold tracking-tight text-gray-800 dark:text-gray-200" onDoubleClick={() => startEdit(item)}>
                    {item.memberContent}
                  </span>
                )}
              </div>

              {/* 컨트롤 툴바 */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                <button type="button" onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"><EditIcon size={14} /></button>
                <button type="button" onClick={() => handleDeleteContent(item.studyMemberContentId)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"><TrashIcon size={14} /></button>
              </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* 일정 추가 폼 */}
      {!isHoliday && (
        <form onSubmit={handleAddContent} className="flex gap-3 shrink-0">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="오늘 공부한 내용을 입력하세요..."
            className="grow bg-gray-50 dark:bg-[#050505] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900 dark:text-white"
          />
          <button type="submit" className="px-8 bg-black dark:bg-white text-white dark:text-black text-sm font-black rounded-2xl active:scale-95 transition-transform cursor-pointer">
            등록
          </button>
        </form>
      )}
    </Card>
  );
}
