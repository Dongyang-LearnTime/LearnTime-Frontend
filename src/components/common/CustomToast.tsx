import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  t: string | number;
  title: string;
  type: ToastType;
}

export const CustomToast: React.FC<CustomToastProps> = ({ t, title, type }) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-900/50 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400';
      default:
        return 'bg-white border-gray-200 text-gray-800 dark:bg-[#121212] dark:border-[#2a2a2a] dark:text-gray-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-3 w-89 p-4 rounded-xl border shadow-lg transition-all ${getStyles()}`}>
      <div className="shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {title}
      </div>
      <button 
        onClick={() => sonnerToast.dismiss(t)}
        className="shrink-0 p-1 rounded-md opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
