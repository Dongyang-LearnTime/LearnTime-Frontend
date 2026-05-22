import React from 'react';

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-4">
            <div>
                {badgeText && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                            {badgeText}
                        </span>
                    </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    요청일시: {new Date(date).toLocaleString()}
                </p>
            </div>
            
            <div className="flex items-center gap-2">
                {type === 'received' ? (
                    <>
                        {onAccept && (
                            <button 
                                onClick={onAccept}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                수락
                            </button>
                        )}
                        {onReject && (
                            <button 
                                onClick={onReject}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
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
                                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
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
