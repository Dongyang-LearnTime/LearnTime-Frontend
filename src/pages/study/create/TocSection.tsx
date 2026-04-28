import type { BookToc } from "./CreateStudy";

interface TocSectionProps {
    bookToc: BookToc[];
    setBookToc: React.Dispatch<React.SetStateAction<BookToc[]>>;
}

export default function TocSection({
    bookToc,
    setBookToc,
}: TocSectionProps) {

    // --- 목차(TOC) CRUD 로직 ---
    const addToc = () => {
        // 기존 배열 메모리 주소를 변경하기 위해 Spread 구문 사용 (불변성 유지)
        setBookToc([...bookToc, { chapter: '', title: '', page: null }]);
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
                            <label>챕터 (10자): </label>
                            <input 
                                type="text" 
                                maxLength={10} 
                                value={item.chapter} 
                                onChange={(e) => updateToc(index, "chapter", e.target.value)} 
                            />
                            
                            <label> 제목 (100자): </label>
                            <input 
                                type="text" 
                                maxLength={100} 
                                value={item.title} 
                                style={{ width: "300px" }}
                                onChange={(e) => updateToc(index, "title", e.target.value)} 
                            />
                            
                            <label> 페이지: </label>
                            <input 
                                type="number" 
                                value={item.page || ""} 
                                style={{ width: "60px" }}
                                onChange={(e) => updateToc(index, "page", parseInt(e.target.value) || 0)} 
                            />
                            
                            <button onClick={() => removeToc(index)} style={{ marginLeft: "10px" }}>삭제</button>
                        </div>
                    ))
                )}
            </section>
        </>
    )
}     
