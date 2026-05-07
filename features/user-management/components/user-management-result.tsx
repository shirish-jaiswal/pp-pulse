"use client";

import { useState } from "react";
import { UserData, MergedUserData, mergeByUserId } from "@/lib/api/user-management/user-management";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

// Casino type resolution matching SQL CASE logic:
// WHEN oc.class_name LIKE '%impl.rgs.RGS_Impl%' THEN 'BT'
// WHEN oc.class_name LIKE '%impl.rgs.sw.RgsSwServiceImpl%' THEN 'SW'
// ELSE 'Internal'
function resolveCasinoType(className: string | null): "BT" | "SW" | "Internal" {
    if (!className) return "Internal";
    if (className.includes("impl.rgs.RGS_Impl")) return "BT";
    if (className.includes("impl.rgs.sw.RgsSwServiceImpl")) return "SW";
    return "Internal";
}

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[180px_1fr] gap-2 py-1.5 border-b border-border/40 last:border-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide self-start pt-0.5">
                {label}
            </span>
            <span className="text-xs text-foreground break-all">
                {value ?? <span className="text-muted-foreground/50">—</span>}
            </span>
        </div>
    );
}

/** Renders all comments for a merged user, sorted desc by noteTime. */
function CommentsSection({ user }: { user: MergedUserData }) {
    if (!user.comments.length) return null;

    return (
        <KVRow
            label="Comments"
            value={
                <div className="space-y-2">
                    {user.comments.map((entry, i) => (
                        <div key={i} className="text-[11px] text-foreground">
                            <span>{entry.comment}</span>
                            {entry.noteTime && (
                                <span className="block text-[10px] text-muted-foreground mt-0.5">
                                    {new Date(entry.noteTime).toLocaleString()}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            }
        />
    );
}

function UserResultCard({ user, index }: { user: MergedUserData; index: number }) {
    const [expanded, setExpanded] = useState(false);

    const casinoType = resolveCasinoType(user.className);
    const chatAllowed = Boolean(user.chatAllowedFlag);

    return (
        <div className="rounded-md border border-border bg-card overflow-hidden">

            {/* ── Summary row (always visible) ── */}
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/40 transition-colors text-left gap-3"
            >
                <div className="flex items-center gap-3 min-w-0">
                    {/* Index pill */}
                    <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {index + 1}
                    </span>

                    {/* Email */}
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                            {user.emailAddress ?? <span className="text-muted-foreground italic">No email</span>}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                            {user.casinoName ?? "—"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Badge
                        variant={casinoType === "BT" ? "default" : casinoType === "SW" ? "secondary" : "outline"}
                        className="text-[10px] px-1.5 py-0"
                    >
                        {casinoType}
                    </Badge>
                    <Badge
                        variant={user.status === "FOUND" ? "default" : "outline"}
                        className="text-[10px] px-1.5 py-0"
                    >
                        {user.status ?? "—"}
                    </Badge>
                    {expanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                        : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                </div>
            </button>

            {/* ── Expanded detail panel ── */}
            {expanded && (
                <div className="px-3 pb-3 pt-1 border-t border-border/40 space-y-0">
                    <KVRow label="User ID"         value={user.userId} />
                    <KVRow label="Email Address"   value={user.emailAddress} />
                    <KVRow label="Screen Name"     value={user.screenName} />
                    <KVRow label="Nick Name"       value={user.nickName} />
                    <KVRow label="Casino ID"       value={user.casinoId} />
                    <KVRow label="Casino Name"     value={user.casinoName} />
                    <KVRow
                        label="Casino Type"
                        value={
                            <Badge
                                variant={casinoType === "BT" ? "default" : casinoType === "SW" ? "secondary" : "outline"}
                                className="text-[10px] px-1.5 py-0"
                            >
                                {casinoType}
                            </Badge>
                        }
                    />
                    <KVRow label="Environment"     value={user.environmentName ?? user.env} />
                    <KVRow
                        label="Chat Allowed"
                        value={
                            <Badge
                                variant={chatAllowed ? "default" : "outline"}
                                className="text-[10px] px-1.5 py-0"
                            >
                                {chatAllowed ? "Allowed" : "Blocked"}
                            </Badge>
                        }
                    />
                    <CommentsSection user={user} />
                    <KVRow label="Screen Name Updates" value={user.screenNameUpdateCount ?? 0} />
                </div>
            )}
        </div>
    );
}

export function UserManagementResult({ data }: { data: UserData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-md border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">No data found.</p>
            </div>
        );
    }

    // Merge duplicates: latest timepoint wins for all fields; all comments collected desc
    const merged = mergeByUserId(data);

    return (
        <div className="space-y-2">
            {merged.length > 1 && (
                <p className="text-xs text-muted-foreground px-1">
                    {merged.length} result{merged.length > 1 ? "s" : ""} found — click a row to expand details
                </p>
            )}
            {merged.map((user, idx) => (
                <UserResultCard key={user.userId ?? idx} user={user} index={idx} />
            ))}
        </div>
    );
}

// ─── Flat KV display for User ID search ──────────────────────────────────────

export function UserManagementResultById({ data }: { data: UserData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-md border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">No data found.</p>
            </div>
        );
    }

    // Merge duplicates: latest timepoint wins for all fields; all comments collected desc
    const merged = mergeByUserId(data);

    // userId search typically returns a single record; show all if multiple
    return (
        <div className="space-y-3">
            {merged.map((user, idx) => {
                const casinoType = resolveCasinoType(user.className);
                const chatAllowed = Boolean(user.chatAllowedFlag);

                return (
                    <div key={user.userId ?? idx} className="rounded-md border border-border bg-card p-3 space-y-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            User Details
                        </p>
                        <KVRow label="User ID"           value={user.userId} />
                        <KVRow label="Email Address"     value={user.emailAddress} />
                        <KVRow label="Screen Name"       value={user.screenName} />
                        <KVRow label="Nick Name"         value={user.nickName} />
                        <KVRow label="Casino ID"         value={user.casinoId} />
                        <KVRow label="Casino Name"       value={user.casinoName} />
                        <KVRow
                            label="Casino Type"
                            value={
                                <Badge
                                    variant={casinoType === "BT" ? "default" : casinoType === "SW" ? "secondary" : "outline"}
                                    className="text-[10px] px-1.5 py-0"
                                >
                                    {casinoType}
                                </Badge>
                            }
                        />
                        <KVRow label="Environment"       value={user.environmentName ?? user.env} />
                        <KVRow
                            label="Chat Allowed"
                            value={
                                <Badge
                                    variant={chatAllowed ? "default" : "outline"}
                                    className="text-[10px] px-1.5 py-0"
                                >
                                    {chatAllowed ? "Allowed" : "Blocked"}
                                </Badge>
                            }
                        />
                    <CommentsSection user={user} />
                        <KVRow label="Screen Name Updates" value={user.screenNameUpdateCount ?? 0} />
                        {user.status && (
                            <KVRow
                                label="Status"
                                value={
                                    <Badge
                                        variant={user.status === "FOUND" ? "default" : "outline"}
                                        className="text-[10px] px-1.5 py-0"
                                    >
                                        {user.status}
                                    </Badge>
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
