import React, { useState, useMemo } from "react";
import { extractTocApi } from "./api/CreateStudyApi";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";
import TocSection from "./TocSection";
import StudyBaseInfoForm from "./StudyBaseInfoForm";

export interface BookToc { // 응답 책 목차 정보
    chapter : string;
    title : string;
    page : number | null;
}

export interface StudyForm {
    bookTitle: string;
    studyTitle: string;
    startDate: string;
    endDate: string;
    restDays: string[];     // 예: ['MONDAY', 'WEDNESDAY']
    restDates: string[];    // 예: ['2026-05-01', '2026-05-05']
}

export const dayMap: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
};

export default function CreateStudy() {
    const [ file, setFile ] = useState<File | null>(null);
    const [ fileError, setFileError ] = useState<string>('');
    const [ bookToc, setBookToc ] = useState<BookToc[]>([]);

    const [studyForm, setStudyForm] = useState<StudyForm>({
        bookTitle: '',
        studyTitle: '',
        startDate: '',
        endDate: '',
        restDays: [],
        restDates: []
    });
    const [tempRestDate, setTempRestDate] = useState<string>(''); 

    // 파일 선택
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    
    // 쉬는 날, 요일 포함 진도 일수 계산
    const calculateStudyDays = () => {
        if (!studyForm.startDate || !studyForm.endDate) return 0;

        const start = new Date(studyForm.startDate);
        const end = new Date(studyForm.endDate);

        let count = 0;
        const restDateSet = new Set(studyForm.restDates);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            const dateStr = d.toISOString().split('T')[0];

            if (studyForm.restDays.some(r => dayMap[r] === day)) continue;
            if (restDateSet.has(dateStr)) continue;

            count++;
        }

        return count;
    };

    // =========================
    // 백엔드제출 함수
    // =========================

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

    const studyDays = useMemo(() => calculateStudyDays(), [studyForm]); // 총 진도 일수

    // 진도 정보 제출
    const handleStudySubmit = () => { // 제출 검증
        if (studyDays < 14 || studyDays > 90) {
            alert(`실제 진행일은 14~90일이어야 합니다. (현재: ${studyDays}일)`);
            return;
        }
    };

    return (
        <div>
        
            <StudyBaseInfoForm
                studyForm={studyForm}
                setStudyForm={setStudyForm}
                tempRestDate={tempRestDate}
                setTempRestDate={setTempRestDate}
                studyDays={studyDays}
            />

            <hr />

            <h2>이미지 업로드 및 목차 분석</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드하여 추출</button>
            {fileError && <p style={{ color: 'red' }}>{fileError}</p>}

            <hr />

            {/* 목차 편집 */}            
            <TocSection
                bookToc={bookToc}
                setBookToc={setBookToc}
            />


            <button
                onClick={handleStudySubmit}
                type="submit"
                className="
                    mt-6
                    px-3 py-1.5
                    border border-gray-400
                    bg-gray-100
                    text-black
                    rounded
                "
            >
                진도 생성
            </button>
            
        </div>
    );
};
