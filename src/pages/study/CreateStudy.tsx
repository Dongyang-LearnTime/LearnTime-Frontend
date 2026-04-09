import React, { useState } from "react";
import { extractTocApi } from "./api/CreateStudyApi";
import { getApiErrorUtil } from "../../utils/getApiErrorUtil";

export interface BookToc { // 응답 책 목차 정보
    chapter : string;
    title : string;
    page : number | null;
}

export default function CreateStudy() {
    const [ file, setFile ] = useState<File | null>(null);
    const [ fileError, setFileError ] = useState<string>('');
    const [ bookToc, setBookToc ] = useState<BookToc[]>([]);

    // 파일 선택
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // 업로드 요청
    const handleUpload = async () => {
        if (!file) {
            alert("파일 선택하세요");
            return;
        }

        try {
            const data = await extractTocApi(file); // API 호출
            setBookToc(data);
            alert("성공");
        } catch (error: unknown) {
            const errorMessage = getApiErrorUtil(error);
            setFileError(errorMessage);
            alert("실패");
        }
    };

    return (
        <div>
            <h2>이미지 업로드 테스트</h2> {/* 임시 태그 */}

            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button onClick={handleUpload}>업로드</button>

            <br /> <br /> {/* 임시 태그 */}
            <h2>사진 분석 결과</h2> {/* 임시 태그 */}
            {
                bookToc &&
                    bookToc.map((item, index) => (
                        <div key={index}>
                            <p>챕터 : {item.chapter} | 제목 : {item.title} | 페이지 : {item.page ?? "정보 없음"}</p>
                        </div>
                    ))
            }
            { fileError && <p>{fileError}</p> }
        </div>
    );
};
