import { Loader2 } from "lucide-react";

export default function LoadMoreLogsLoading() {
    return <div className="sticky bottom-0 left-0 w-full py-4 flex items-center justify-center bg-linear-to-t from-white via-white/95 to-transparent z-20 backdrop-blur-xs select-none">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-200/60 bg-slate-900/3 shadow-xs backdrop-blur-md ring-4 ring-slate-100/50">
            <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-40"></span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
            </div>
            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-sans flex items-center gap-1">
                Streaming
                <span className="inline-block h-1 w-1 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="inline-block h-1 w-1 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="inline-block h-1 w-1 rounded-full bg-slate-300 animate-bounce"></span>
            </span>
        </div>
    </div>
}