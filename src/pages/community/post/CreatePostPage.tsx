import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { usePageTitle } from '../../../hooks/usePageTitle';
import { createPostApi } from '../api/PostApi';
import { getApiErrorUtil } from '../../../utils/getApiErrorUtil';
import PostForm, { type PostFormPayload } from '../components/PostForm';
import { toast } from '../../../utils/toast';

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const studyIdParam = searchParams.get('studyId');
    const studyTitleParam = searchParams.get('studyTitle');
    const categoryParam = searchParams.get('category') === 'RECRUITMENT' ? 'RECRUITMENT' : 'FREE';
    const studyId = studyIdParam ? Number(studyIdParam) : undefined;

    const [ postError , setPostError ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    usePageTitle("learn-time | 게시글 작성");

    const handleSubmit = async (payload: PostFormPayload) => {
        setIsSubmitting(true);
        setPostError('');

        try {
            const request = { 
                title: payload.title, 
                content: payload.content, 
                isNotice: payload.isNotice,
                studyId: payload.studyId,
                category: payload.category
            };
            const postId = await createPostApi(request, payload.newImages);
            
            toast.success('게시글이 성공적으로 등록되었습니다!');
            navigate(`/community/post/${postId}`); // 생성된 상세 보기로 이동
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

            <div className="relative max-w-5xl mx-auto z-10">
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
                    <PostForm
                        onSubmit={handleSubmit}
                        submitButtonText="게시글 등록"
                        submittingText="등록 중..."
                        isSubmitting={isSubmitting}
                        error={postError}
                        studyId={studyId}
                        studyTitle={studyTitleParam}
                        initialCategory={categoryParam}
                    />
                </div>
            </div>
        </div>
    );
}

