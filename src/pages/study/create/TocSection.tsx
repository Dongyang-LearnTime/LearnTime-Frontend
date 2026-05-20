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
            alert("목차는 최대 150개까지만 가능합니다.");

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
        <>
            <h2>목차 편집</h2>

            <button onClick={addToc}>+ 목차 직접 추가</button>

            {/* 스크롤 영역 적용: maxHeight와 overflowY를 통한 UI 제한 */}
            <section style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
                {bookToc.length === 0 ? <p>등록된 목차가 없습니다.</p> : (
                    bookToc.map((item, index) => (
                        <div key={index} style={{ marginBottom: "10px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                            <label>챕터: </label>
                            <input
                                type="text"
                                maxLength={10}
                                value={item.chapter}
                                onChange={(e) => updateToc(index, "chapter", e.target.value)}
                                placeholder="챕터 입력 (최대 10자)"
                            />

                            <label> 제목: </label>
                            <input
                                type="text"
                                maxLength={100}
                                value={item.title}
                                style={{ width: "300px" }}
                                onChange={(e) => updateToc(index, "title", e.target.value)}
                                placeholder="제목 입력 (최대 100자)"
                            />

                            <label> 페이지: </label>
                            <input
                                type="number"
                                value={item.page || ""}
                                style={{ width: "60px" }}
                                onChange={(e) => updateToc(index, "page", parseInt(e.target.value) || 0)}
                                placeholder="입력"
                            />

                            <button onClick={() => removeToc(index)} style={{ marginLeft: "10px" }}>삭제</button>
                        </div>
                    ))
                )}
            </section>
        </>
    )
}     
