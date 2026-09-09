import React, { useState, useEffect, useMemo, useRef } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { usePageTitle } from "../../../hooks/usePageTitle";
import { extractTocApi, getFriendsApi, type FriendResponse } from "../api/CreateStudyApi";
import { getApiErrorUtil } from "../../../utils/getApiErrorUtil";
import TocSection from "./TocSection";
import StudyBaseInfoForm from "./StudyBaseInfoForm";
import { useStudyGeneration } from "../../../hooks/useStudyGeneration";
import StudyGeneratingOverlay from "./StudyGeneratingOverlay";
import { toast } from '../../../utils/toast';

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
    isPublic: boolean;      // 스터디 공개 여부 (true: 공개, false: 비공개)
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

export default function CreateStudyPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <CreateStudyPageInner />
        </QueryClientProvider>
    );
}

function CreateStudyPageInner() {

    const [ file, setFile ] = useState<File | null>(null);
    const [ bookToc, setBookToc ] = useState<BookToc[]>([]);
    const [ studyForm, setStudyForm ] = useState<StudyForm>({
        bookTitle: '',
        studyTitle: '',
        startDate: '',
        endDate: '',
        restDays: [],
        restDates: [],
        isPublic: false
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

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 페이지 제목 변경
    usePageTitle("learn-time | 진도 생성");

    // 파일 선택
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileError(''); // 에러 초기화
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

    // 사진 업로드
    const handleUpload = async () => {
        if (isUploadingUpload) return; // 중복 클릭 방지

        if (!file) {
            setFileError("파일을 선택하세요.");
            return;
        }

        try {
            setIsUploadingUpload(true); // 요청 시작
            setFileError('');
            
            // 빠른 응답으로 인한 UI 깜빡임 방지 (최소 1초 대기)
            const [data] = await Promise.all([
                extractTocApi(file),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
            
            setBookToc(data);

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
            toast.info(`실제 진행일은 14~90일이어야 합니다. (현재: ${studyDays}일)`);
            return;
        }

        if (!isValidToc) {
            toast.error('유효한 목차가 없습니다.');
            return;
        }

        // POST 요청 후 폴링 시작 (useStudyGeneration 훅이 처리)
        await requestGeneration(studyForm, bookToc, studyMember);
    };

    useEffect(() => {
        if (bookToc.length > MAX_TOC) {
            toast.info(`목차는 최대 ${MAX_TOC}개까지만 유지됩니다.`);
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
            toast.info(`최대 ${MAX_STUDY_MEMBERS}명까지만 선택할 수 있습니다.`);
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
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 페이지 헤더 */}
            <header className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mb-3 text-gray-900 dark:text-white border-l-8 border-indigo-600 pl-4 sm:pl-6 inline-block sm:block w-fit sm:w-auto mx-auto">
                    새로운 스터디 만들기
                </h1>
                <p className="text-base text-gray-500 dark:text-gray-400 font-medium sm:ml-8 mt-2">
                    목표를 달성하기 위한 완벽한 진도표를 AI와 함께 생성하세요.
                </p>
            </header>
        
            {/* 1. 스터디 기본 정보 */}
            <StudyBaseInfoForm
                studyForm={studyForm}
                setStudyForm={setStudyForm}
                tempRestDate={tempRestDate}
                setTempRestDate={setTempRestDate}
                studyDays={studyDays}
            />

            {/* 2. 멤버 구성 / 목차 이미지 업로드 (하나의 카드로 묶고 수직선으로 구분) */}
            <section className="bg-white dark:bg-[#050505] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm mb-6 flex flex-col lg:flex-row">
                
                {/* 2-1. 함께할 친구 선택 영역 */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-[#1a1a1a]">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">2. 멤버 구성</h2>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">스터디를 함께할 친구를 초대하세요.</p>
                        </div>
                        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold shrink-0">
                            {studyMember.length} / {MAX_STUDY_MEMBERS}명
                        </div>
                    </div>
                    
                    {/* 선택된 친구 목록 (태그 형태) */}
                    {studyMember.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 dark:bg-[#0a0a0a] p-3 rounded-xl border border-gray-100 dark:border-[#222]">
                            {friendList
                                .filter(f => studyMember.includes(f.userId))
                                .map(friend => (
                                    <div key={friend.friendId} className="flex items-center gap-1.5 bg-white dark:bg-[#1a1a1a] border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                                        <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-xs">
                                            {friend.name.charAt(0)}
                                        </div>
                                        <span>{friend.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveFriend(friend.userId)}
                                            className="text-indigo-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md p-0.5 ml-1 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {/* 검색 및 드롭다운 (커스텀 콤보박스) */}
                    <div className="relative mt-auto">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={friendSearchTerm}
                                onChange={(e) => {
                                    setFriendSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
                                placeholder="이름으로 친구 검색"
                                className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-[#111] transition-all dark:text-white"
                                disabled={studyMember.length >= MAX_STUDY_MEMBERS}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                        </div>
                        
                        {isDropdownOpen && !studyMember.length.toString().includes(MAX_STUDY_MEMBERS.toString()) && (
                            <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#222] rounded-xl shadow-xl max-h-45 overflow-y-auto custom-scrollbar">
                                {friendList.filter(f => f.name.includes(friendSearchTerm) && !studyMember.includes(f.userId)).length > 0 ? (
                                    friendList
                                        .filter(f => f.name.includes(friendSearchTerm) && !studyMember.includes(f.userId))
                                        .map(friend => (
                                            <li 
                                                key={friend.friendId}
                                                className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#222] cursor-pointer flex justify-between items-center transition-colors border-b border-gray-50 dark:border-[#222] last:border-0"
                                                onMouseDown={() => handleAddFriend(friend.userId)} // onBlur보다 먼저 실행되게
                                            >
                                                <span className="font-bold text-gray-800 dark:text-gray-200">{friend.name}</span>
                                                <span className="text-gray-400 text-xs truncate ml-2 font-medium">{friend.email}</span>
                                            </li>
                                        ))
                                ) : (
                                    <li className="px-4 py-6 text-sm text-gray-500 text-center font-medium bg-gray-50/50 dark:bg-[#111]/50">
                                        검색 결과가 없습니다
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 2-2. 목차 이미지 업로드 섹션 */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">AI 목차 추출</h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">교재의 목차 이미지를 업로드하면 AI가 자동으로 텍스트를 추출합니다.</p>
                    </div>

                    <div 
                        className={`flex-1 min-h-35 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer relative overflow-hidden group
                            ${file 
                                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
                                : 'border-gray-300 dark:border-[#333] bg-gray-50 dark:bg-[#0a0a0a] hover:border-indigo-400 dark:hover:border-indigo-600'
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            ref={fileInputRef}
                        />
                        
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-indigo-500 shadow-sm mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate max-w-50">{file.name}</p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">다른 파일 선택</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">클릭하여 이미지 업로드</p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">PNG, JPG, JPEG 형식 지원</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        {fileError && <p className="text-xs font-bold text-rose-500">{fileError}</p>}
                        <button 
                            onClick={handleUpload} 
                            disabled={isUploadingUpload || !file}
                            className="w-full py-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                        >
                            {isUploadingUpload ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    분석 중...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                                    AI 목차 자동 추출
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. 목차 편집 */}            
            <TocSection
                bookToc={bookToc}
                setBookToc={setBookToc}
                MAX_TOC={MAX_TOC}
            />

            {/* 최종 제출 컨테이너 */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleStudyPlanSubmit}
                    type="button"
                    disabled={isBusy}
                    className="
                        w-full sm:w-auto min-w-70
                        px-8 py-5
                        bg-linear-to-r from-violet-600 to-indigo-600
                        hover:from-violet-500 hover:to-indigo-500
                        text-white font-black text-lg
                        rounded-2xl shadow-xl shadow-indigo-500/20
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        hover:-translate-y-1 hover:shadow-indigo-500/40
                        flex items-center justify-center gap-3
                    "
                >
                    {isBusy ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            진도를 생성하고 있습니다...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            공부 진도 생성
                        </>
                    )}
                </button>
            </div>

            {/* 진도 생성 상태 오버레이 (PLANNING / FAILED / 타임아웃) */}
            <StudyGeneratingOverlay
                isVisible={isPolling}
                error={generationError}
                onRetry={resetGeneration}
            />
            
        </div>
    );
};


