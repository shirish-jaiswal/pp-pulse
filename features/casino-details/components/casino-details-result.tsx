"use client";

import { useState } from "react";
import { NormalisedCasinoData, SharedEnv } from "@/lib/api/casino-details/casino-details";
import { Badge } from "@/components/ui/badge";

// ─── Helpers ────────────────────────────────────────────────────────────────

type KVRowProps = {
    label: string;
    value: React.ReactNode;
};

function KVRow({ label, value }: KVRowProps) {
    return (
        <div className="grid grid-cols-[200px_1fr] gap-2 py-1.5 border-b border-border/40 last:border-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide self-start pt-0.5">
                {label}
            </span>
            <span className="text-xs text-foreground break-all">{value ?? "—"}</span>
        </div>
    );
}

function BoolBadge({ value }: { value: boolean }) {
    return (
        <Badge variant={value ? "default" : "outline"} className="text-[10px] px-1.5 py-0">
            {value ? "Yes" : "No"}
        </Badge>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 pt-2">
            {children}
        </p>
    );
}

// ─── Tab: Casino Details ─────────────────────────────────────────────────────

function CasinoInfoTab({ data }: { data: NormalisedCasinoData }) {
    return (
        <div className="space-y-1">
            <SectionTitle>Casino Info</SectionTitle>
            <KVRow label="Casino ID" value={data.casino_id} />
            <KVRow label="Casino Name / Description" value={data.casino_desc?.trim() || "—"} />
            <KVRow label="Main Env ID" value={data.main_env_id} />
            <KVRow label="Main Env Name" value={data.main_env_name?.trim() || "—"} />

            <div className="pt-2">
                <SectionTitle>Extra Data Flags</SectionTitle>
                <KVRow label="Extra Data on Bet" value={<BoolBadge value={!!data.extra_data_on_bet} />} />
                <KVRow label="Extra Data on Win" value={<BoolBadge value={!!data.extra_data_on_win} />} />
                <KVRow label="Extra Data on DF" value={<BoolBadge value={!!data.extra_data_on_df} />} />
            </div>
        </div>
    );
}

// ─── Tab: Sharded Details ────────────────────────────────────────────────────

type ShardedRow = {
    casinoId: string;
    envId: string | number;
    envName: string;
    shardedCasinoId: string | number;
    shardedOperatorId: string | number;
};

function buildShardedRows(data: NormalisedCasinoData): ShardedRow[] {
    // Primary: array from API  { casino_id, env, env_name, shardedCasinoId, shardedOperatorId }
    if (Array.isArray(data.sharedEnvs) && data.sharedEnvs.length > 0) {
        return data.sharedEnvs
            .filter((e: SharedEnv) => {
                // Keep rows that have at least an env id or env name
                const hasEnv = e.env != null && e.env !== "";
                const hasEnvId = e.env_id != null && e.env_id !== "";
                const hasName = e.env_name && (e.env_name as string).trim();
                return hasEnv || hasEnvId || hasName;
            })
            .map((e: SharedEnv) => ({
                casinoId:         String(e.casino_id ?? data.casino_id ?? "—"),
                envId:            e.env ?? e.env_id ?? "—",
                envName:          e.env_name?.trim() || "—",
                shardedCasinoId:  e.shardedCasinoId ?? e.sharded_casino_id ?? "—",
                shardedOperatorId:e.shardedOperatorId ?? e.sharded_operator_id ?? "—",
            }));
    }

    // Flat-field fallback (legacy)
    const flatEnvs = [
        {
            id: (data as any).shared_env_1_id,
            name: (data as any).shared_env_1_name,
            casinoId: (data as any).shared_env_1_shardedCasinoId,
            operatorId: (data as any).shared_env_1_shardedOperatorId,
        },
        {
            id: (data as any).shared_env_2_id,
            name: (data as any).shared_env_2_name,
            casinoId: (data as any).shared_env_2_shardedCasinoId,
            operatorId: (data as any).shared_env_2_shardedOperatorId,
        },
        {
            id: (data as any).shared_env_3_id,
            name: (data as any).shared_env_3_name,
            casinoId: (data as any).shared_env_3_shardedCasinoId,
            operatorId: (data as any).shared_env_3_shardedOperatorId,
        },
    ];
    return flatEnvs
        .filter((e) => {
            const hasId = e.id != null && e.id !== "";
            const hasName = e.name && (e.name as string).trim();
            return hasId || hasName;
        })
        .map((e) => ({
            casinoId:          String(data.casino_id ?? "—"),
            envId:             e.id ?? "—",
            envName:           e.name?.trim() || "—",
            shardedCasinoId:   e.casinoId ?? "—",
            shardedOperatorId: e.operatorId ?? "—",
        }));
}

function ShardedDetailsTab({ data }: { data: NormalisedCasinoData }) {
    const rows = buildShardedRows(data);

    if (rows.length === 0) {
        return (
            <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">Casino is not sharded</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                            Casino ID
                        </th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                            Env ID
                        </th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                            Env Name
                        </th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                            Sharded Casino ID
                        </th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                            Sharded Operator ID
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                            <td className="py-2 px-3 text-foreground font-mono text-[11px]">{row.casinoId}</td>
                            <td className="py-2 px-3 text-foreground">{String(row.envId)}</td>
                            <td className="py-2 px-3 text-foreground">{row.envName}</td>
                            <td className="py-2 px-3 text-foreground">{String(row.shardedCasinoId)}</td>
                            <td className="py-2 px-3 text-foreground">{String(row.shardedOperatorId)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Tab: Configurations ─────────────────────────────────────────────────────

function ConfigurationsTab({ data }: { data: NormalisedCasinoData }) {
    const confLines = data.conf_data
        ? data.conf_data
              .split(/\r\n|\r|\n/)
              .map((l) => l.trim())
              .filter(Boolean)
        : [];

    const parsedLines: { key: string; value: string }[] = confLines.map((line) => {
        const eqIdx = line.indexOf("=");
        if (eqIdx === -1) return { key: line, value: "" };
        return {
            key: line.substring(0, eqIdx),
            value: line.substring(eqIdx + 1),
        };
    });

    if (parsedLines.length === 0) {
        return (
            <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground italic">No configuration data available</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-[220px]">
                            Configuration
                        </th>
                        <th className="py-2 px-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {parsedLines.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                            <td className="py-2 px-3 font-medium text-muted-foreground align-top">
                                {row.key}
                            </td>
                            <td className="py-2 px-3 text-foreground break-all align-top">
                                {row.value || (
                                    <span className="italic text-muted-foreground/60">empty</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

type TabKey = "casino" | "sharded" | "config";

const TABS: { key: TabKey; label: string }[] = [
    { key: "casino", label: "Casino Details" },
    { key: "sharded", label: "Sharded Details" },
    { key: "config", label: "Configurations" },
];

export function CasinoDetailsResult({ data }: { data: NormalisedCasinoData }) {
    const [activeTab, setActiveTab] = useState<TabKey>("casino");

    return (
        <div className="rounded-md border border-border bg-card overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-border bg-muted/30">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={[
                            "px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                            activeTab === tab.key
                                ? "border-b-2 border-primary text-primary bg-background"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                        ].join(" ")}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-3">
                {activeTab === "casino" && <CasinoInfoTab data={data} />}
                {activeTab === "sharded" && <ShardedDetailsTab data={data} />}
                {activeTab === "config" && <ConfigurationsTab data={data} />}
            </div>
        </div>
    );
}
