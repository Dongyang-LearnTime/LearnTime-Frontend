import type { BookToc } from "./CreateStudyPage";

interface TocSectionProps {
    bookToc: BookToc[];
    setBookToc: React.Dispatch<React.SetStateAction<BookToc[]>>;
    MAX_TOC: number;
}

export default function TocSection({
    bookToc,
    setBookToc,
    MAX_TOC
}: TocSectionProps) {

    // --- 목차(TOC) CRUD 로직 ---
    const addToc = () => {
        if (bookToc.length >= MAX_TOC) {
            alert(`목차는 최대 ${MAX_TOC}개까지만 가능합니다.`);

            // 초과된 상태라면 강제로 잘라냄
            setBookToc(bookToc.slice(0, MAX_TOC));
            return;
        }

        setBookToc([
            ...bookToc,
            { chapter: '', title: '', page: null }
        ]);
    };

    const updateToc = (index: number, field: keyof BookToc, value: string | number) => {
        const updatedToc = bookToc.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value }; // 대상 객체만 새 참조로 생성
            }
            return item; // 나머지는 기존 참조 유지 (메모리 절약)
        });
        setBookToc(updatedToc);
    };

    const removeToc = (index: number) => {
        // filter를 사용하여 해당 인덱스를 제외한 새로운 배열 반환
        setBookToc(bookToc.filter((_, i) => i !== index));
    };

    return (
        <section className="bg-white dark:bg-[#050505] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">3. 목차 편집</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">학습할 목차를 확인하고 수정할 수 있습니다.</p>
                </div>
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#111] px-3 py-1.5 rounded-lg shrink-0">
                    총 {bookToc.length}개 / 최대 {MAX_TOC}개
                </div>
            </div>

            {/* 스크롤 영역 적용 */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar border border-gray-200 dark:border-[#222] rounded-2xl bg-gray-50/50 dark:bg-[#0a0a0a] p-2 sm:p-4 mb-4">
                {bookToc.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">등록된 목차가 없습니다.</p>
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">목차를 직접 추가하거나 이미지에서 추출해 보세요.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {bookToc.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                                <div className="flex items-center gap-2 font-black text-gray-400 dark:text-gray-600 w-6 shrink-0 justify-center">
                                    {index + 1}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 w-full">
                                    {/* 챕터 */}
                                    <div className="sm:col-span-3">
                                        <input
                                            type="text"
                                            maxLength={10}
                                            value={item.chapter}
                                            onChange={(e) => updateToc(index, "chapter", e.target.value)}
                                            placeholder="챕터 (예: 1장)"
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-[#222] rounded-lg text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#111] transition-all"
                                        />
                                    </div>
                                    {/* 제목 */}
                                    <div className="sm:col-span-7">
                                        <input
                                            type="text"
                                            maxLength={100}
                                            value={item.title}
                                            onChange={(e) => updateToc(index, "title", e.target.value)}
                                            placeholder="제목을 입력하세요"
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-[#222] rounded-lg text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#111] transition-all"
                                        />
                                    </div>
                                    {/* 페이지 */}
                                    <div className="sm:col-span-2">
                                        <input
                                            type="number"
                                            value={item.page || ""}
                                            onChange={(e) => updateToc(index, "page", parseInt(e.target.value) || 0)}
                                            placeholder="페이지"
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-[#222] rounded-lg text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#111] transition-all"
                                        />
                                    </div>
                                </div>
                                {/* 삭제 버튼 */}
                                <button 
                                    onClick={() => removeToc(index)}
                                    className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all shrink-0 self-end sm:self-auto"
                                    title="목차 삭제"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button 
                type="button"
                onClick={addToc}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-[#222] rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                새로운 목차 항목 직접 추가
            </button>
        </section>
    );
}
     
