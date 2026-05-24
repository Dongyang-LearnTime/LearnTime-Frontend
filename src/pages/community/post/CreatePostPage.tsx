import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { usePageTitle } from '../../../hooks/usePageTitle';
import { createPostApi } from '../api/PostApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';

export default function CreatePostPage() {
    const navigate = useNavigate();

    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
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

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
            const request = { title, content };
            const postId = await createPostApi(request, images);
            
            alert('게시글이 성공적으로 등록되었습니다!');
            navigate(-1); // 임시 링크
        } catch (error) {
            const errorMessage = getApiErrorUtil(error);
            setPostError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 mt-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">새 게시글 작성</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 제목 입력 */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="font-semibold text-gray-900 dark:text-gray-200">
                        제목 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({title.length}/{MAX_TITLE_LENGTH})</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={MAX_TITLE_LENGTH}
                        placeholder="제목을 입력하세요"
                        className="border border-gray-300 dark:border-[#333] bg-white dark:bg-[#111] text-gray-900 dark:text-white rounded-md p-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        required
                    />
                </div>

                {/* 내용 입력 */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="content" className="font-semibold text-gray-900 dark:text-gray-200">
                        내용 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({content.length}/{MAX_CONTENT_LENGTH})</span>
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={MAX_CONTENT_LENGTH}
                        placeholder="게시글 내용을 입력하세요"
                        className="border border-gray-300 dark:border-[#333] bg-white dark:bg-[#111] text-gray-900 dark:text-white rounded-md p-2 h-40 resize-y focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        required
                    />
                </div>

                {/* 이미지 업로드 */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-900 dark:text-gray-200">
                        이미지 첨부 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({images.length}/{MAX_IMAGES_COUNT})</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40 text-gray-700 dark:text-gray-300 cursor-pointer"
                        disabled={images.length >= MAX_IMAGES_COUNT}
                    />

                    {/* 선택된 이미지 목록 미리보기(파일명만) */}
                    {images.length > 0 && (
                        <ul className="mt-2 flex flex-col gap-1">
                            {images.map((img, idx) => (
                                <li key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded-md text-sm text-gray-900 dark:text-white">
                                    <span className="truncate">{img.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="text-red-500 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 ml-4 shrink-0"
                                    >
                                        삭제
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-white font-semibold py-2 px-4 rounded-md transition-colors ${
                        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isSubmitting ? '등록 중...' : '게시글 등록'}
                </button>

                {postError && (
                    <div className="text-red-500 text-center mt-4">{postError}</div>
                )}
            </form>
        </div>
    );
}
