import { LayersIcon } from '../ui/Icons';

export const SiteLogo = () => { 
    return (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
            <LayersIcon className="text-black" size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white uppercase">Learn Time</span>
        </div>
    )
}