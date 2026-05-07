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
    border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 text-sm sm:text-base 
    ${hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/30'
      : isValid 
        ? 'border-blue-500 focus:ring-blue-100' 
        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'} 
    ${className || ''}
  `;

  return (
    <div className="space-y-1">
      <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input className={getInputClass(isValid, hasError)} {...props} />
          <div className="absolute right-4 top-3.5">
            {isValid && !hasError && <Check className="text-blue-500" size={16}/>}
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
                ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-default'
                : checkDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 hover:shadow-indigo-100'
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
