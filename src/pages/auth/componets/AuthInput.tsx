import React from 'react';
import { Check, Loader2 } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  isValid: boolean;
  onCheckDuplicate?: () => void;
  isChecking?: boolean;
  isChecked?: boolean;
  checkDisabled?: boolean;
  errorMessage?: string;
  hasError?: boolean;
}

export default function AuthInput({
  label,
  icon,
  isValid,
  onCheckDuplicate,
  isChecking = false,
  isChecked = false,
  checkDisabled = false,
  errorMessage,
  hasError = false,
  className,
  ...props
}: AuthInputProps) {
  const getInputClass = (isValid: boolean, hasError?: boolean) => `
    w-full pl-4 pr-10 py-3 
    border-2 rounded-xl bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-4 text-sm sm:text-base 
    ${hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/30 dark:bg-red-950/10 bg-red-50/30'
      : isValid 
        ? 'border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/50' 
        : 'border-gray-200 dark:border-[#333] focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/50'} 
    ${className || ''}
  `;

  return (
    <div className="space-y-1">
      <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input className={getInputClass(isValid, hasError)} {...props} />
          <div className="absolute right-4 top-3.5">
            {isValid && !hasError && <Check className="text-indigo-500 dark:text-indigo-400" size={16}/>}
          </div>
        </div>
        {onCheckDuplicate && (
          <button
            type="button"
            onClick={onCheckDuplicate}
            disabled={checkDisabled || isChecking || isChecked}
            className={`
              px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-sm whitespace-nowrap
              ${isChecked 
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 cursor-default'
                : checkDisabled
                  ? 'bg-gray-100 dark:bg-[#222] text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-[#333]'
                  : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:shadow-indigo-100 dark:hover:shadow-none'
              }
            `}
          >
            {isChecking ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : isChecked ? '확인됨' : '중복확인'}
          </button>
        )}
      </div>
      {errorMessage && (
        <p className="text-[11px] sm:text-xs text-red-500 font-semibold ml-1 animate-pulse">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
