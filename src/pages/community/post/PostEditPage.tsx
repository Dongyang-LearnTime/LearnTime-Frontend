import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { usePageTitle } from '../../../hooks/usePageTitle';
import { updatePostApi, getPostForUpdateApi } from '../api/PostApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import PostForm, { type PostFormPayload } from '../components/PostForm';

interface PostData {
    title: string;
    content: string;
    images: string[];
}

export default function PostEditPage() {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();

    const [ postData, setPostData ] = useState<PostData | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ postError , setPostError ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    usePageTitle("learn-time | 게시글 수정");

    useEffect(() => {
        if (!postId) return;
        const fetchEditData = async () => {
            try {
                const data = await getPostForUpdateApi(Number(postId));
                setPostData({
                    title: data.title,
                    content: data.content,
                    images: data.images || []
                });
            } catch (error) {
                console.error('Failed to fetch post for edit:', error);
                alert('게시글 정보를 불러오는 데 실패했습니다.');
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEditData();
    }, [postId, navigate]);

    const handleSubmit = async (payload: PostFormPayload) => {
        if (isSubmitting || !postId) return;

        setIsSubmitting(true);
        setPostError('');

        try {
            const request = { 
                title: payload.title, 
                content: payload.content, 
                isNotice: payload.isNotice, 
                deletedImageUrls: payload.deletedImages 
            };
            await updatePostApi(Number(postId), request, payload.newImages);
            
            alert('게시글이 성공적으로 수정되었습니다!');
            navigate(`/community/post/${postId}`); // 상세 페이지로 이동
        } catch (error) {
            const errorMessage = getApiErrorUtil(error);
            setPostError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative max-w-5xl mx-auto z-10">
                <header className="mb-8">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block"
                    >
                        &larr; 이전 페이지로 돌아가기
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">게시글 수정</h1>
                    <p className="text-sm text-gray-500 mt-1">작성하신 글의 내용을 자유롭게 수정해 보세요.</p>
                </header>

                <div className="bg-white dark:bg-[#111] border border-gray-200/80 dark:border-[#222] rounded-4xl p-6 sm:p-8 shadow-xl transition-all duration-300">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-gray-500 mt-4">데이터를 불러오는 중입니다...</p>
                        </div>
                    ) : (
                        postData && (
                            <PostForm
                                initialTitle={postData.title}
                                initialContent={postData.content}
                                initialImages={postData.images}
                                onSubmit={handleSubmit}
                                submitButtonText="수정 완료"
                                submittingText="수정 중..."
                                isSubmitting={isSubmitting}
                                error={postError}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

