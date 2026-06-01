import React from 'react';

interface ListContainerProps {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
  error?: string | null;
  bottomElement?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function ListContainer({ title, children, isLoading, error, bottomElement, actionButton }: ListContainerProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{title}</h1>
        {actionButton}
      </div>

      {error && (
        <div className="text-rose-500 text-center mb-6 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-sm font-bold">
          {error}
        </div>
      )}

      {isLoading && React.Children.count(children) === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold text-sm">목록을 불러오는 중입니다...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {children}
        </div>
      )}

      {bottomElement && (
        <div className="mt-8">
          {bottomElement}
        </div>
      )}
    </div>
  );
}

