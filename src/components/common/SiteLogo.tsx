import siteLogo from '../../assets/site-logo.svg';

export const SiteLogo = () => { 
    return (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-transparent rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                <img src={siteLogo} className="w-7 h-7 dark:invert" alt="Learn Time Logo" />
            </div>
            <span className="text-xl font-extrabold tracking-tight [word-spacing:-0.15em] text-white">Learn Time</span>
        </div>
    )
}