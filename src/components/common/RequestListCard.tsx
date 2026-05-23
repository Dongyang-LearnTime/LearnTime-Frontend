export interface RequestListCardProps {
    title: string;
    date: string;
    badgeText?: string;
    type: 'received' | 'sent';
    onAccept?: () => void;
    onReject?: () => void;
    onCancel?: () => void;
}

export default function RequestListCard({
    title,
    date,
    badgeText,
    type,
    onAccept,
    onReject,
    onCancel,
}: RequestListCardProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-[#050505] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-[#333] transition-all gap-4">
            <div>
                {badgeText && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold">
                            {badgeText}
                        </span>
                    </div>
                )}
                <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
                    요청일시: {new Date(date).toLocaleString()}
                </p>
            </div>
            
            <div className="flex items-center gap-2">
                {type === 'received' ? (
                    <>
                        {onAccept && (
                            <button 
                                onClick={onAccept}
                                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-indigo-600/20 hover:-translate-y-0.5"
                            >
                                수락
                            </button>
                        )}
                        {onReject && (
                            <button 
                                onClick={onReject}
                                className="px-5 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
                            >
                                거절
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {onCancel && (
                            <button 
                                onClick={onCancel}
                                className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                            >
                                취소
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
