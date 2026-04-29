import { AlertCircle } from 'lucide-react';

const ErrorMessageBlock = ({ message }: { message: string }) => {
    return (
        <div className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-xs sm:text-sm font-medium">{message}</p>
        </div>
    )
}

export default ErrorMessageBlock;