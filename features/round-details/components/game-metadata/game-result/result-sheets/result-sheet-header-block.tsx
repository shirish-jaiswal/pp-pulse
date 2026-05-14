"use client";

import { useState } from "react";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

export function ResultSheetHeaderBlock() {
    const { roundDetails } = useRoundDetails();

    const info = roundDetails?.tptInfo?.[0];

    const [copied, setCopied] = useState(false);

    const handleCopyQuery = async () => {
        if (!info) return;

        const query = `${info.round_id} OR (${info.game_id.trim()
        } AND ${info.user_id})`;

        try {
            await navigator.clipboard.writeText(query);

            setCopied(true);

            // reset after short delay
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy query:", err);
        }
    };

    return (
        <div className="border-b pb-4 mb-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
                    Game Result Details
                </h3>

                {/* Copy Button */}
                <button
                    onClick={handleCopyQuery}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all duration-200
                        ${
                            copied
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                >
                    {copied ? "Copied ✓" : "Copy Generic Query"}
                </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                        Player ID
                    </p>
                    <p className="text-sm font-semibold text-slate-900 break-all">
                        {info?.user_id || "N/A"}
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                        Round ID
                    </p>
                    <p className="text-sm font-semibold text-slate-900 break-all">
                        {info?.round_id || "N/A"}
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                        Game ID
                    </p>
                    <p className="text-sm font-semibold text-slate-900 break-all">
                        {info?.game_id || "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
}