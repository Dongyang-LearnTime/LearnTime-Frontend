import React, { useState, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { usePageTitle } from "../../../hooks/usePageTitle";
import { extractTocApi, getFriendsApi, type FriendResponse } from "../api/CreateStudyApi";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";
import TocSection from "./TocSection";
import StudyBaseInfoForm from "./StudyBaseInfoForm";
import { useStudyGeneration } from "../../../hooks/useStudyGeneration";
import StudyGeneratingOverlay from "./StudyGeneratingOverlay";

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

// QueryClient는 컴포넌트 외부에 선언하여 리렌더링 시 재생성 방지
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // 네트워크 에러 시 1회 자동 재시도
        },
    },
});


// QueryClientProvider를 하위 컴포넌트만 감싸는 웸퍼를 default export
export default function CreateStudyPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <CreateStudyPageInner />
        </QueryClientProvider>
    );
}


// 실제 로직은 Inner 컴포넌트에 처리
function CreateStudyPageInner() {

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
    const [ tempRestDate, setTempRestDate ] = useState<string>(''); 

    // 함께할 친구 목록 및 선택된 친구 상태 관리
    const [ friendList, setFriendList ] = useState<FriendResponse[]>([]);
    const [ studyMember, setStudyMember ] = useState<number[]>([]);
    const [ friendSearchTerm, setFriendSearchTerm ] = useState<string>(''); // 친구 검색어
    const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false); // 커스텀 드롭다운 열림 상태

    // 에러 메시지
    const [ fileError, setFileError ] = useState<string>('');

    // 클릭 여부 확인 (여러 번 요청 방지)
    const [ isUploadingUpload, setIsUploadingUpload ] = useState<boolean>(false);

    // 진도 생성 폴링 훅
    const { requestGeneration, resetGeneration, isBusy, isPolling, generationError } = useStudyGeneration();

    const MAX_TOC = 150; // 목록 최대 갯수
    const MAX_STUDY_MEMBERS = 3; // 최대 선택 가능한 친구 수
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
    const handleStudyPlanSubmit = async () => {
        if (isBusy) return; // 중복 클릭 방지

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

        // POST 요청 후 폴링 시작 (useStudyGeneration 훅이 처리)
        await requestGeneration(studyForm, bookToc, studyMember);
    };

    useEffect(() => {
        if (bookToc.length > MAX_TOC) {
            alert("목차는 최대 150개까지만 유지됩니다.");
            setBookToc(bookToc.slice(0, MAX_TOC));
        }
    }, [bookToc]);

    // 컴포넌트 마운트 시 친구 목록 조회
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const data = await getFriendsApi();
                setFriendList(data);
            } catch (error) {
                console.error("친구 목록을 불러오는데 실패했습니다.", error);
            }
        };
        fetchFriends();
    }, []);

    // 친구 추가
    const handleAddFriend = (userId: number) => {
        if (studyMember.length >= MAX_STUDY_MEMBERS) {
            alert(`최대 ${MAX_STUDY_MEMBERS}명까지만 선택할 수 있습니다.`);
            return;
        }
        if (!studyMember.includes(userId)) {
            setStudyMember((prev) => [...prev, userId]);
        }
        setFriendSearchTerm(''); // 선택 후 검색어 초기화
        setIsDropdownOpen(false); // 드롭다운 닫기
    };

    // 친구 제거
    const handleRemoveFriend = (userId: number) => {
        setStudyMember((prev) => prev.filter((id) => id !== userId));
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

            {/* 친구 선택 영역 */}
            <div className="my-6">
                <h2 className="text-lg font-semibold mb-3">
                    함께할 친구 선택 <span className="text-sm font-normal text-gray-500">({studyMember.length}/{MAX_STUDY_MEMBERS})</span>
                </h2>
                
                {/* 선택된 친구 목록 (태그 형태) */}
                {studyMember.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {friendList
                            .filter(f => studyMember.includes(f.userId))
                            .map(friend => (
                                <div key={friend.friendId} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                                    <span>{friend.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveFriend(friend.userId)}
                                        className="text-blue-600 hover:text-blue-800 ml-1 font-bold outline-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* 검색 및 드롭다운 (커스텀 콤보박스) */}
                <div className="relative max-w-sm">
                    <input 
                        type="text" 
                        value={friendSearchTerm}
                        onChange={(e) => {
                            setFriendSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)} // 클릭 이벤트 발생 보장을 위해 약간의 지연
                        placeholder="이름으로 친구 검색"
                        className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                    />
                    
                    {isDropdownOpen && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[180px] overflow-y-auto">
                            {friendList.filter(f => f.name.includes(friendSearchTerm) && !studyMember.includes(f.userId)).length > 0 ? (
                                friendList
                                    .filter(f => f.name.includes(friendSearchTerm) && !studyMember.includes(f.userId))
                                    .map(friend => (
                                        <li 
                                            key={friend.friendId}
                                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                            onClick={() => handleAddFriend(friend.userId)}
                                        >
                                            <span>{friend.name}</span>
                                            <span className="text-gray-500 text-xs truncate ml-2">{friend.email}</span>
                                        </li>
                                    ))
                            ) : (
                                <li className="px-3 py-2 text-sm text-gray-500 text-center">
                                    검색 결과가 없습니다
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

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
                type="button"
                className="
                    mt-6
                    px-3 py-1.5
                    border border-gray-400
                    bg-gray-100
                    text-black
                    rounded
                "
                disabled={isBusy}
            >
                {isBusy ? '처리 중...' : '진도 생성하기'}
            </button>

            {/* 진도 생성 상태 오버레이 (PLANNING / FAILED / 타임아웃) */}
            <StudyGeneratingOverlay
                isVisible={isPolling}
                error={generationError}
                onRetry={resetGeneration}
            />
            
        </div>
    );
};

