import React from 'react';

interface PaginationProps {
  currentPage: number; // 0-based index
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages === 0) return null;

  // 페이징 블록 크기 (예: 5페이지씩 보여줌)
  const blockSize = 5;
  const currentBlock = Math.floor(currentPage / blockSize);
  const startPage = currentBlock * blockSize;
  const endPage = Math.min(startPage + blockSize, totalPages);

  const pages = Array.from({ length: endPage - startPage }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center items-center gap-2 py-6 mt-4">
      <button
        onClick={() => onPageChange(Math.max(0, startPage - 1))}
        disabled={startPage === 0}
        className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
        aria-label="이전 블록"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
              currentPage === page
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#1a1a1a]'
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(endPage)}
        disabled={endPage >= totalPages}
        className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
        aria-label="다음 블록"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}
