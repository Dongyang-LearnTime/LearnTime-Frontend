import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePageTitle } from '../../../hooks/usePageTitle';
import { createPostApi } from '../api/PostApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import { useAuthStore } from '../../../store/useAuthStore';

export default function CreatePostPage() {
    const navigate = useNavigate();
    // 전역 상태관리에서 사용자의 role 조회
    const role = useAuthStore((state) => state.role);

    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [ isNotice, setIsNotice ] = useState<boolean>(false); // 공지사항 여부 상태 추가
    const [ images, setImages ] = useState<File[]>([]);

    const [ postError , setPostError ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    usePageTitle("learn-time | 게시글 작성");

    // 최대 입력 길이 상수
    const MAX_TITLE_LENGTH = 100;
    const MAX_CONTENT_LENGTH = 1000;
    const MAX_IMAGES_COUNT = 3;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        // 기존 이미지와 새로 추가할 이미지의 합이 3개를 넘지 않도록 제한
        const totalImagesCount = images.length + selectedFiles.length;
        if (totalImagesCount > MAX_IMAGES_COUNT) {
            alert(`이미지는 최대 ${MAX_IMAGES_COUNT}개까지만 업로드 가능합니다.`);
            return;
        }

        setImages((prev) => [...prev, ...selectedFiles].slice(0, MAX_IMAGES_COUNT));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        // 입력값 검증 (방어 로직)
        if (title.trim() === '' || content.trim() === '') {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        if (title.length > MAX_TITLE_LENGTH || content.length > MAX_CONTENT_LENGTH) {
            alert('입력 가능 글자 수를 초과했습니다.');
            return;
        }

        setIsSubmitting(true);
        setPostError('');

        try {
            // isNotice 파라미터 전달 추가
            const request = { title, content, isNotice };
            const postId = await createPostApi(request, images);
            
            alert('게시글이 성공적으로 등록되었습니다!');
            navigate(-1); // 이전 페이지로 복귀
        } catch (error) {
            const errorMessage = getApiErrorUtil(error);
            setPostError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            
            {/* 백그라운드 그라디언트 오로라 구체 */}
            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative max-w-2xl mx-auto z-10">
                <header className="mb-8">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block"
                    >
                        &larr; 게시판 목록으로 돌아가기
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">새 게시글 작성</h1>
                    <p className="text-sm text-gray-500 mt-1">배움의 가치를 나누고 함께 성장하는 글을 나누어 주세요.</p>
                </header>

                <div className="bg-white dark:bg-[#111] border border-gray-200/80 dark:border-[#222] rounded-4xl p-6 sm:p-8 shadow-xl transition-all duration-300">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        
                        {/* 1. 공지사항 여부 선택 (JWT 권한이 ROLE_ADMIN일 때만 렌더링) */}
                        {role === 'ROLE_ADMIN' && (
                            <div className="flex items-center gap-3.5 p-4.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl transition-all duration-300">
                                <input
                                    id="isNotice"
                                    type="checkbox"
                                    checked={isNotice}
                                    onChange={(e) => setIsNotice(e.target.checked)}
                                    className="w-5 h-5 text-amber-500 border-gray-300 dark:border-[#333] rounded focus:ring-amber-500/20 focus:ring-offset-0 accent-amber-500 cursor-pointer"
                                />
                                <label htmlFor="isNotice" className="font-bold text-sm text-amber-800 dark:text-amber-300 cursor-pointer flex flex-col">
                                    <span>중요 공지사항으로 게시</span>
                                    <span className="text-[11px] font-semibold text-amber-600/80 dark:text-amber-400/80 mt-0.5">이 글을 전체 게시판의 최상단에 중요 공지로 고정하여 노출시킵니다.</span>
                                </label>
                            </div>
                        )}

                        {/* 2. 제목 입력 */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="font-bold text-gray-900 dark:text-gray-200 text-sm flex justify-between items-center">
                                <span>제목</span>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{title.length} / {MAX_TITLE_LENGTH}자</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={MAX_TITLE_LENGTH}
                                placeholder="글의 제목을 간결하고 명확하게 입력하세요"
                                className="border border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-semibold text-sm transition-all placeholder:text-gray-400"
                                required
                            />
                        </div>

                        {/* 3. 내용 입력 */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="content" className="font-bold text-gray-900 dark:text-gray-200 text-sm flex justify-between items-center">
                                <span>내용</span>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{content.length} / {MAX_CONTENT_LENGTH}자</span>
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={MAX_CONTENT_LENGTH}
                                placeholder="게시판 운영원칙을 준수하여 따뜻하고 유익한 글을 작성해 주세요."
                                className="border border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl p-3 h-48 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-medium text-sm transition-all placeholder:text-gray-400 leading-relaxed"
                                required
                            />
                        </div>

                        {/* 4. 드래그앤드롭 스타일 이미지 업로드 */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-gray-900 dark:text-gray-200 text-sm flex justify-between items-center">
                                <span>이미지 첨부</span>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{images.length} / {MAX_IMAGES_COUNT}장</span>
                            </label>
                            
                            <div className="relative border border-dashed border-gray-300 dark:border-[#2b2b2b] hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 transition-all duration-300 text-center cursor-pointer group bg-gray-50/30 dark:bg-transparent">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={images.length >= MAX_IMAGES_COUNT}
                                    title=""
                                />
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {images.length >= MAX_IMAGES_COUNT ? '이미지 첨부 한도에 도달하였습니다.' : '클릭하여 이미지를 첨부해 주세요 (최대 3장)'}
                                </p>
                            </div>

                            {/* 선택된 이미지 격자 뷰어 */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mt-2">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-[#222]">
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-transform hover:scale-105 active:scale-95"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                            <div className="w-full h-full bg-gray-50 dark:bg-gray-900/60 p-2 flex flex-col justify-center items-center text-center">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate w-full">{img.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 mt-0.5">{(img.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 5. 에러 메시지 */}
                        {postError && (
                            <div className="text-rose-500 dark:text-rose-400 text-center font-bold text-xs p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-xl">
                                {postError}
                            </div>
                        )}

                        {/* 6. 제출 / 취소 액션 버튼 */}
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-4 rounded-xl transition-all text-sm"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-2 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md text-sm ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                                        : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]'
                                }`}
                            >
                                {isSubmitting ? '등록 중...' : '게시글 등록'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
