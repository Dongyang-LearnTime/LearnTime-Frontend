import { MainHeader } from "../components/layout/MainHeader";
import { usePageTitle } from "../hooks/usePageTitle";

export default function UnderConstructionPage() {
    usePageTitle('준비 중');
    return (
        <div className="flex flex-col h-full min-h-screen bg-gray-50 dark:bg-[#020202]">
            <MainHeader />
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center -mt-20">
                <div className="w-24 h-24 mb-6 rounded-full bg-gray-200 dark:bg-[#111] flex items-center justify-center shadow-inner">
                    <span className="text-4xl">🚧</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                    준비 중인 페이지입니다
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                    더 나은 서비스를 위해 현재 열심히 개발 중입니다. 빠른 시일 내에 멋진 모습으로 찾아뵙겠습니다!
                </p>
                <button 
                    onClick={() => window.history.back()} 
                    className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                >
                    이전 화면으로 돌아가기
                </button>
            </div>
        </div>
    );
}
