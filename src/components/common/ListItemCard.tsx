import React from 'react';
import { formatDateUtil } from '../../utils/formatDateUtil';

interface ListItemCardProps {
  title: string;
  date: string | Date; // LocalDateTime from backend
  content?: string;
  statusText?: string;
  statusColor?: 'indigo' | 'emerald' | 'amber' | 'gray';
  onClick?: () => void;
  rightElement?: React.ReactNode;
}

export default function ListItemCard({ 
  title, 
  date, 
  content, 
  statusText,
  statusColor = 'indigo',
  onClick,
  rightElement 
}: ListItemCardProps) {

  // 색상 맵핑
  const statusColors = {
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
    gray: 'text-gray-600 bg-gray-50 dark:bg-[#1a1a1a] dark:text-gray-400',
  };

  return (
    <div 
      onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-3xl border transition-all group bg-white dark:bg-[#050505] border-gray-200 dark:border-[#262626] hover:border-gray-400 dark:hover:border-[#444] ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h3 className="text-base font-black tracking-tight text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            {statusText && (
              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[statusColor]}`}>
                {statusText}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
            {typeof date === 'string' ? formatDateUtil(date) : date.toLocaleString()}
          </span>
        </div>
        {content && (
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
            {content}
          </p>
        )}
      </div>
      
      {rightElement && (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {rightElement}
        </div>
      )}
    </div>
  );
}
