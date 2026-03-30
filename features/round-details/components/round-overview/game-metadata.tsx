import { useState } from "react";
import { cn } from "@/utils/cn";
import { Copy, Check } from "lucide-react"; // Assuming you use lucide-react for icons

const GameMetadata = () => {
    const [copied, setCopied] = useState(false);

    const data = [
        { label: "Game Type", value: "Free Bet Blackjack", isTechnical: false },
        { label: "Session Time", value: "2026-03-21 06:05:13.977", isTechnical: true },
        { label: "Table ID", value: "fbj0000000000092", isTechnical: true },
        { label: "Table Name", value: "SO-BJ-06.2", isTechnical: true },
        { label: "Mega Slot", value: "--", isTechnical: false },
        { label: "Mega Multiplier", value: "--", isTechnical: false },
        { label: "Platform", value: "Blackjack Mobile", isTechnical: false },
    ];

    const handleCopy = () => {
        const textToCopy = data
            .map((item) => `${item.label}: ${item.value}`)
            .join("\n");

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg shadow-sm flex items-center group">
            {/* Scrollable Metadata Area */}
            <div className="flex-1 flex items-center overflow-x-auto no-scrollbar py-2 px-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center shrink-0">
                        <div className="flex items-baseline gap-2 px-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">
                                {item.label} :
                            </span>
                            <span className={cn(
                                "text-xs font-medium whitespace-nowrap",
                                item.isTechnical
                                    ? "font-mono text-blue-600 bg-blue-100/50 px-1.5 rounded-sm"
                                    : "text-slate-700"
                            )}>
                                {item.value}
                            </span>
                        </div>
                        {index !== data.length - 1 && (
                            <div className="h-4 w-px bg-slate-200 mx-1" />
                        )}
                    </div>
                ))}
            </div>

            {/* Copy Button Section */}
            <div className="pr-2 pl-1 border-l border-slate-200 bg-slate-50 sticky right-0">
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
                    title="Copy all metadata"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-[10px] font-bold text-green-600 uppercase">Copied</span>
                        </>
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default GameMetadata;