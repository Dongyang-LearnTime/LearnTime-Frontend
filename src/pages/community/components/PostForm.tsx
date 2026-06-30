import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from '../../../utils/toast';

export interface PostFormPayload {
    title: string;
    content: string;
    isNotice: boolean;
    newImages: File[];
    deletedImages: string[];
    studyId?: number;
}

interface PostFormProps {
    initialTitle?: string;
    initialContent?: string;
    initialIsNotice?: boolean;
    initialImages?: string[];
    studyId?: number;
    studyTitle?: string | null;
    onSubmit: (payload: PostFormPayload) => Promise<void>;
    submitButtonText: string;
    submittingText: string;
    isSubmitting: boolean;
    error?: string;
}

const DEFAULT_IMAGES: string[] = [];

export default function PostForm({
    initialTitle = '',
    initialContent = '',
    initialIsNotice = false,
    initialImages = DEFAULT_IMAGES,
    studyId,
    studyTitle,
    onSubmit,
    submitButtonText,
    submittingText,
    isSubmitting,
    error
}: PostFormProps) {
    const navigate = useNavigate();
    const role = useAuthStore((state) => state.role);

    const [ title, setTitle ] = useState<string>(initialTitle);
    const [ content, setContent ] = useState<string>(initialContent);
    const [ isNotice, setIsNotice ] = useState<boolean>(initialIsNotice);
    const [ newImages, setNewImages ] = useState<File[]>([]);
    const [ existingImages, setExistingImages ] = useState<string[]>(initialImages);
    const [ deletedImages, setDeletedImages ] = useState<string[]>([]);
    const [ previewUrls, setPreviewUrls ] = useState<string[]>([]);

    const MAX_TITLE_LENGTH = 100;
    const MAX_CONTENT_LENGTH = 1000;
    const MAX_IMAGES_COUNT = 3;

    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent);
        setIsNotice(initialIsNotice);
        setExistingImages(initialImages);
        setDeletedImages([]);
        setNewImages([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialTitle, initialContent, initialIsNotice, JSON.stringify(initialImages)]);

    useEffect(() => {
        const urls = newImages.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImages]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);
        const totalImagesCount = existingImages.length + newImages.length + selectedFiles.length;

        if (totalImagesCount > MAX_IMAGES_COUNT) {
            toast.info(`이미지는 최대 ${MAX_IMAGES_COUNT}개까지만 업로드 가능합니다.`);
            return;
        }

        setNewImages((prev) => [...prev, ...selectedFiles].slice(0, MAX_IMAGES_COUNT - existingImages.length));
    };

    const handleRemoveExistingImage = (url: string) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
        setDeletedImages((prev) => [...prev, url]);
    };

    const handleRemoveNewImage = (indexToRemove: number) => {
        setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (title.trim() === '' || content.trim() === '') {
            toast.warning('제목과 내용을 모두 입력해주세요.');
            return;
        }

        if (title.length > MAX_TITLE_LENGTH || content.length > MAX_CONTENT_LENGTH) {
            toast.warning('입력 가능 글자 수를 초과했습니다.');
            return;
        }

        onSubmit({
            title,
            content,
            isNotice,
            newImages,
            deletedImages,
            studyId
        });
    };



    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {studyTitle && (
                <div className="flex items-center gap-3.5 p-4.5 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 rounded-2xl transition-all duration-300">
                    <span className="text-xs font-black bg-indigo-600 dark:bg-indigo-500 text-white px-2.5 py-1.5 rounded-xl uppercase tracking-wider">공부 인증 연동</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{studyTitle}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold ml-auto hidden sm:inline">글 등록 시 스터디 핵심 지표 스냅샷이 게시글에 첨부됩니다.</span>
                </div>
            )}

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
                    placeholder="글의 제목을 입력하세요."
                    className="border border-gray-200 dark:border-[#222] bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 font-semibold text-sm transition-all placeholder:text-gray-400"
                    required
                />
            </div>

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

            <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-900 dark:text-gray-200 text-sm flex justify-between items-center">
                    <span>이미지 첨부</span>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{existingImages.length + newImages.length} / {MAX_IMAGES_COUNT}장</span>
                </label>
                
                <div className="relative border border-dashed border-gray-300 dark:border-[#2b2b2b] hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 transition-all duration-300 text-center cursor-pointer group bg-gray-50/30 dark:bg-transparent">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={(existingImages.length + newImages.length) >= MAX_IMAGES_COUNT}
                        title=""
                    />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {(existingImages.length + newImages.length) >= MAX_IMAGES_COUNT ? '이미지 첨부 한도에 도달하였습니다.' : '클릭하여 이미지를 첨부해 주세요 (최대 3장)'}
                    </p>
                </div>

                {(existingImages.length > 0 || newImages.length > 0) && (
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {existingImages.map((img, idx) => (
                            <div key={`exist-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-[#222]">
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(img)}
                                        className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-transform hover:scale-105 active:scale-95"
                                    >
                                        삭제
                                    </button>
                                </div>
                                <img src={img} alt="기존 첨부" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {newImages.map((_img, idx) => (
                            <div key={`new-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-500/50">
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(idx)}
                                        className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-transform hover:scale-105 active:scale-95"
                                    >
                                        삭제
                                    </button>
                                </div>
                                <img src={previewUrls[idx]} alt="새 첨부" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="text-rose-500 dark:text-rose-400 text-center font-bold text-xs p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-xl">
                    {error}
                </div>
            )}

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
                    {isSubmitting ? submittingText : submitButtonText}
                </button>
            </div>

        </form>
    );
}
