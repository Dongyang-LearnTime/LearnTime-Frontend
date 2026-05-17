interface StudyGeneratingOverlayProps {
    isVisible: boolean;  // PLANNING 상태 여부
    error: string;       // 에러 메시지 (빈 문자열이면 에러 없음)
    onRetry: () => void; // 오버레이 닫기 / 재시도 콜백
}

export default function StudyGeneratingOverlay({
    isVisible,
    error,
    onRetry,
}: StudyGeneratingOverlayProps) {
    // 보여줄 내용이 없으면 렌더링하지 않음
    if (!isVisible && !error) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">

                {/* PLANNING 상태 */}
                {!error && (
                    <>
                        {/* 프로그레시브 인디케이터 바 */}
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ animation: 'progress-indeterminate 1.8s ease-in-out infinite' }}
                            />
                        </div>

                        {/* 스피너 */}
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            학습 계획 생성 중
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            AI가 맞춤형 학습 계획을 설계 중입니다...<br />
                            잠시만 기다려 주세요. (최대 30초)
                        </p>
                    </>
                )}

                {/* FAILED / 타임아웃 상태 */}
                {error && (
                    <>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-2xl font-bold">✕</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">생성 실패</h2>
                        <p className="text-sm text-red-500 mb-6">{error}</p>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            다시 시도하기
                        </button>
                    </>
                )}
            </div>

            {/* 인디케이터 바 애니메이션 (Tailwind arbitrary animation으로 불가한 keyframe) */}
            <style>{`
                @keyframes progress-indeterminate {
                    0%   { transform: translateX(-100%); width: 60%; }
                    50%  { transform: translateX(60%);   width: 60%; }
                    100% { transform: translateX(200%);  width: 60%; }
                }
            `}</style>
        </div>
    );
}
