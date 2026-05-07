import { useNavigate } from "react-router";
import { AlertCircle, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6 animate-bounce">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner">
            <AlertCircle className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-8 font-medium">
          요청하신 페이지가 존재하지 않거나, 주소가 잘못 입력되었습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            이전 페이지
          </button>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            메인으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
