import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router'; 

import { usePageTitle } from "../../../hooks/usePageTitle";
import { extractTocApi, createStudyPlanApi } from "../api/CreateStudyApi";
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
    const navigate = useNavigate();

    const [ file, setFile ] = useState<File | null>(null);
    const [ bookToc, setBookToc ] = useState<BookToc[]>([]);
    const [ studyForm, setStudyForm ] = useState<StudyForm>({
        bookTitle: '',
        studyTitle: '',
        startDate: '',
        endDate: '',
        restDays: [],
        restDates: []
    });
    const [tempRestDate, setTempRestDate] = useState<string>(''); 

    // 에러 메시지
    const [ fileError, setFileError ] = useState<string>('');
    const [ planError, setPlanError ] = useState<string>('');

    // 클릭 여부 확인 (여러 번 요청 방지)
    const [ isUploadingUpload, setIsUploadingUpload ] = useState<boolean>(false);
    const [ isUploadingStudy, setIsUploadingStudy ] = useState<boolean>(false);

    const MAX_TOC = 150; // 목록 최대 갯수
    const STUDY_DAY_LIMIT = {
        MIN: 14, // 최소 진도 일수
        MAX: 90  // 최대 진도 일수
    } as const;


    // 페이지 제목 변경
    usePageTitle("learn-time | 진도 생성");

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

    // 사진 업로드
    const handleUpload = async () => {
        if (isUploadingUpload) return; // 중복 클릭 방지

        if (!file) {
            alert("파일 선택하세요");
            return;
        }

        try {
            setIsUploadingUpload(true); // 요청 시작
            
            const data = await extractTocApi(file);
            setBookToc([]);
            setBookToc(data);

            alert("성공");
        } catch (error: unknown) {
            const errorMessage = getApiErrorUtil(error);
            setFileError(errorMessage);
        } finally {
            setIsUploadingUpload(false); // 요청 끝
        }
    };

    const studyDays = useMemo(() => calculateStudyDays(), [studyForm]); // 총 진도 일수

    // 진도 정보 제출
    const handleStudyPlanSubmit = async () => { // 제출 검증
        if (isUploadingStudy) return; // 중복 클릭 방지

        // 목차 목록 유효성 검사 (비어 있는지)
        const isValidToc = bookToc.some(toc => 
            toc.chapter.trim() !== '' &&
            toc.title.trim() !== ''
        );

        if (studyDays < STUDY_DAY_LIMIT.MIN || studyDays > STUDY_DAY_LIMIT.MAX) {
            alert(`실제 진행일은 14~90일이어야 합니다. (현재: ${studyDays}일)`);
            return;
        }

        if (!isValidToc) {
            alert('유효한 목차가 없습니다.');
            return;
        }

        try {
            setIsUploadingStudy(true); // 요청 시작
            await createStudyPlanApi(studyForm, bookToc);
            alert("생성 완료");
            navigate('/'); // 공부 페이지 생성 완료 시 링크 수정
        
        } catch (error: unknown) {
            const errorMessage = getApiErrorUtil(error);
            setPlanError(errorMessage);
        } finally {
            setIsUploadingStudy(false); // 요청 끝
        }
    };

    useEffect(() => {
        if (bookToc.length > MAX_TOC) {
            alert("목차는 최대 150개까지만 유지됩니다.");
            setBookToc(bookToc.slice(0, MAX_TOC));
        }
    }, [bookToc]);

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
            <button onClick={handleUpload} disabled={isUploadingUpload}>
                {isUploadingUpload ? "업로드 중..." : "업로드하여 추출"}
            </button>            
            {fileError && <p style={{ color: 'red' }}>{fileError}</p>}

            <hr />

            {/* 목차 편집 */}            
            <TocSection
                bookToc={bookToc}
                setBookToc={setBookToc}
                MAX_TOC={MAX_TOC}
            />


            <button
                onClick={handleStudyPlanSubmit}
                type="submit"
                className="
                    mt-6
                    px-3 py-1.5
                    border border-gray-400
                    bg-gray-100
                    text-black
                    rounded
                "
                disabled={isUploadingStudy}
            >
                {isUploadingStudy ? "생성 중..." : "진도 생성하기"}
            </button>      
            {planError && <p style={{ color: 'red' }}>{planError}</p>}
            
        </div>
    );
};
