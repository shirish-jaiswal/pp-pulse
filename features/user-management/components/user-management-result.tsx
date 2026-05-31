"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserData } from "@/lib/api/user-management/user-management";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

function resolveCasinoType(className: string | null): "BT" | "SW" | "Internal" {
    if (!className) return "Internal";
    if (className.includes("impl.rgs.RGS_Impl")) return "BT";
    if (className.includes("impl.rgs.sw.RgsSwServiceImpl")) return "SW";
    return "Internal";
}

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[180px_1fr] gap-2 py-1.5 border-b last:border-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase pt-0.5">
                {label}
            </span>
            <span className="text-xs break-all">
                {value ?? <span className="text-muted-foreground/50">—</span>}
            </span>
        </div>
    );
}

function UserResultCard({ user, index }: { user: UserData; index: number }) {
    const searchParams = useSearchParams();
    const queryUserId = searchParams.get("userId");

    const [expanded, setExpanded] = useState(
        queryUserId && queryUserId === user.userId
    );

    const [showAll, setShowAll] = useState(false);

    const casinoType = resolveCasinoType(user.className);
    const chatAllowed = Boolean(user.chatAllowedFlag);

    // ✅ ✅ FINAL STRICT FILTER (COVERS ALL CASES)
    const validHistory = (user.history || []).filter((h) => {
        // check comment
        const commentValid =
            typeof h?.comment === "string" &&
            h.comment.trim() !== "" &&
            h.comment.trim() !== "—";

        // check time
        const timeValid =
            typeof h?.time === "string" &&
            h.time !== null &&
            h.time !== undefined;

        return commentValid && timeValid;
    });

    const latestValid = validHistory.length > 0 ? validHistory[0] : null;

    const visibleHistory = showAll
        ? validHistory
        : validHistory.slice(0, 5);

    return (
        <div
            className={`rounded-md border bg-card overflow-hidden 
            ${queryUserId === user.userId ? "ring-2 ring-primary" : ""}`}
        >

            {/* SUMMARY */}
            <div
                onClick={() => {
                    window.open(
                        `/portal/user-management?userId=${user.userId}`,
                        "_blank"
                    );
                }}
                className="w-full flex justify-between px-3 py-2.5 hover:bg-muted/40 cursor-pointer"
            >
                <div className="flex gap-3">

                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {index + 1}
                    </span>

                    <div>
                        <p className="text-xs font-semibold truncate">
                            {user.emailAddress ?? "No email"}
                        </p>

                        {/* ✅ CASINO NAME FIX */}
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                               
window.open(`/portal/casino-details?casinoId=${user.casinoId}`, "_blank");

                            }}
                            className="text-[11px] text-muted-foreground hover:underline cursor-pointer block"
                        >
                            {(user.casinoName && user.casinoName.trim() !== ""
                                ? user.casinoName
                                : "No Casino"
                            )} ({casinoType})
                        </span>

                        {/* ✅ PERFECT LATEST FIX */}
                        {latestValid && (
                            <p className="text-[10px] text-muted-foreground truncate">
                                Latest: {latestValid.comment} (
                                {new Date(latestValid.time).toLocaleDateString()}
                                )
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="text-[10px]">
                        {casinoType}
                    </Badge>

                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(v => !v);
                        }}
                    >
                        {expanded
                            ? <ChevronUp className="w-3.5 h-3.5" />
                            : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                </div>
            </div>

            {/* EXPANDED */}
            {expanded && (
                <div className="px-3 pb-3 pt-1 border-t">
                    <KVRow label="User ID" value={user.userId} />
                    <KVRow label="Email" value={user.emailAddress} />
                    <KVRow label="Screen Name" value={user.screenName} />
                    <KVRow label="Nick Name" value={user.nickName} />
                    <KVRow label="Casino ID" value={user.casinoId} />

                    <KVRow
                        label="Casino Name"
                        value={user.casinoName && user.casinoName.trim() !== "" ? user.casinoName : "No Casino"}
                    />


                    <KVRow
                        label="Environment"
                        value={`${user.environmentName ?? "—"} (${user.env ?? "—"})`}
                    />

                    <KVRow
                        label="Chat Allowed"
                        value={
                            <Badge variant={chatAllowed ? "default" : "outline"}>
                                {chatAllowed ? "Allowed" : "Blocked"}
                            </Badge>
                        }
                    />

                    {/* ✅ COMMENTS (NOW PERFECT) */}
                    {validHistory.length > 0 && (
                        <div className="pt-3">
                            <p className="text-[10px] font-semibold uppercase mb-2">
                                Comment Notes
                            </p>

                            {visibleHistory.map((h, i) => (
                                <div key={i} className="border rounded-md p-2 mb-1">
                                    <p>{h.comment}</p>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(h.time).toLocaleString()}
                                    </span>
                                </div>
                            ))}

                            {validHistory.length > 5 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAll(v => !v);
                                    }}
                                    className="text-xs text-primary mt-2"
                                >
                                    {showAll
                                        ? "Show Less ▲"
                                        : `View More (${validHistory.length}) ▼`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ✅ EXPORTS */
export function UserManagementResult({ data }: { data: UserData[] }) {
    if (!data?.length) return <p>No data</p>;

    return (
        <div className="space-y-2">
            {data.map((user, i) => (
                <UserResultCard key={i} user={user} index={i} />
            ))}
        </div>
    );
}

export function UserManagementResultById({ data }: { data: UserData[] }) {
    if (!data?.length) return <p>No data</p>;

    return (
        <div className="space-y-2">
            {data.map((user, i) => (
                <UserResultCard key={i} user={user} index={i} />
            ))}
        </div>
    );
}
