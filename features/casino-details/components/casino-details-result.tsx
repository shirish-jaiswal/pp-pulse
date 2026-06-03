"use client";

import { useState } from "react";
import { NormalisedCasinoData, SharedEnv } from "@/lib/api/casino-details/casino-details";
import { Badge } from "@/components/ui/badge";

/* ───────── HELPERS ───────── */

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center py-2 text-sm border-b border-border/40">
            <span className="w-[180px] text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value ?? "—"}</span>
        </div>
    );
}

function BoolBadge({ value }: { value: boolean }) {
    return (
        <Badge variant={value ? "default" : "outline"}>
            {value ? "Yes" : "No"}
        </Badge>
    );
}

/* ───────── CASINO TAB ───────── */

function CasinoInfoTab({ data }: { data: NormalisedCasinoData }) {
    return (
        <div className="max-w-xl border rounded-md p-4 bg-background">
            <h3 className="text-sm font-semibold mb-3">Casino Info</h3>
            <KVRow label="Casino ID" value={data.casino_id} />
            <KVRow label="Casino Name" value={data.casino_desc} />
            <KVRow label="Wallet Type" value={data.Wallet_Type} />
            <KVRow label="Main Env ID" value={data.main_env_id} />
            <KVRow label="Main Env Name" value={data.main_env_name} />
            <KVRow label="Extra Data On Bet" value={<BoolBadge value={!!data.extra_data_on_bet} />} />
            <KVRow label="Extra Data On Win" value={<BoolBadge value={!!data.extra_data_on_win} />} />
            <KVRow label="Extra Data on DF" value={<BoolBadge value={!!data.extra_data_on_df} />} />
        </div>
    );
}

/* ───────── SHARDED TAB ───────── */

function ShardedDetailsTab({ data }: { data: NormalisedCasinoData }) {
    if (!data.sharedEnvs?.length) {
        return <p className="text-sm text-muted-foreground">No sharded config</p>;
    }

    return (
        <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/60">
                    <tr>
                        <th className="p-2 text-left">CasinoId</th>
                        <th className="p-2 text-left">Sharded Env Id</th>
                        <th className="p-2 text-left">Sharded Env Name</th>
                        <th className="p-2 text-left">Sharded CasinoId</th>
                        <th className="p-2 text-left">Sharded OperatorId</th>
                    </tr>
                </thead>

                <tbody>
                    {data.sharedEnvs.map((e: SharedEnv, i) => (
                        <tr key={i} className="border-t hover:bg-muted/20">
                            <td className="p-2">{e.casino_id}</td>
                            <td className="p-2">{e.env ?? e.env_id}</td>
                            <td className="p-2">{e.env_name}</td>
                            <td className="p-2">{e.shardedCasinoId ?? "—"}</td>
                            <td className="p-2">{e.shardedOperatorId ?? "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ───────── CONFIG TAB ───────── */

function ConfigurationsTab({ data }: { data: NormalisedCasinoData }) {
    const [search, setSearch] = useState("");

    const lines = data.conf_data?.split("\n") || [];

    const filtered = lines.filter(line =>
        line.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="mb-3">
                <input
                    placeholder="Search config..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-1 text-sm rounded w-[220px]"
                />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-auto">
                {filtered.map((line, i) => {
                    const [k, ...v] = line.split("=");
                    return (
                        <div key={i} className="border rounded p-2 text-xs">
                            <div className="text-muted-foreground">{k}</div>
                            <div className="font-medium break-all">{v.join("=")}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

/* ───────── TABLES TAB ───────── */

function TablesTab({ tables }: { tables: any[] }) {

    const [config, setConfig] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    /* ✅ NEW FILTER STATES */
    const [statusFilter, setStatusFilter] = useState("all");
    const [configFilter, setConfigFilter] = useState("all");

    const PAGE_SIZE = 20;

    let filtered = tables.filter(t =>
        t.table_name?.toLowerCase().includes(search.toLowerCase())
    );

    /* ✅ STATUS FILTER */
    if (statusFilter !== "all") {
        filtered = filtered.filter(t =>
            statusFilter === "open" ? t.table_open === true : t.table_open === false
        );
    }

    /* ✅ CONFIG FILTER */
    if (configFilter !== "all") {
        filtered = filtered.filter(t => {
            const isDefault = !t.tc_conf_data || t.tc_conf_data === "#";
            return configFilter === "default" ? isDefault : !isDefault;
        });
    }

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            {/* ✅ TOP BAR WITH FILTERS */}
            <div className="flex flex-wrap gap-2 justify-between mb-3">

                <div className="flex gap-2">

                    <input
                        placeholder="Search table..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="border px-3 py-1 text-sm rounded w-[200px]"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-2 py-1 text-sm rounded"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={configFilter}
                        onChange={(e) => setConfigFilter(e.target.value)}
                        className="border px-2 py-1 text-sm rounded"
                    >
                        <option value="all">All Config</option>
                        <option value="default">Default</option>
                        <option value="custom">Custom</option>
                    </select>

                </div>

                <span className="text-xs text-muted-foreground">
                    {filtered.length} tables
                </span>
            </div>

            {/* TABLE */}
            <div className="border rounded-md overflow-hidden">
                <div className="max-h-[500px] overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted sticky top-0">
                            <tr>
                                <th className="p-2 text-left">TableName</th>
                                <th className="p-2 text-left">Operator_GameId</th>
                                <th className="p-2 text-left">TableId</th>
                                <th className="p-2 text-left">Environment</th>
                                <th className="p-2 text-center w-[120px]">Status</th>
                                <th className="p-2 text-center w-[160px]">Config</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map((t, i) => (
                                <tr key={i} className="border-t hover:bg-muted/20">

                                    <td className="p-2">{t.table_name}</td>
                                    <td className="p-2">{t.operator_game_id}</td>
                                    <td className="p-2 font-mono text-xs">{t.table_id}</td>
                                    <td className="p-2">{t.env_name}</td>

                                    <td className="p-2 text-center">
                                        <Badge variant={t.table_open ? "default" : "outline"}>
                                            {t.table_open ? "Open" : "Closed"}
                                        </Badge>
                                    </td>

                                    <td className="p-2">
                                        <div className="flex justify-center">
                                            {!t.tc_conf_data || t.tc_conf_data === "#" ? (
                                                <Badge variant="outline" className="text-[10px]">
                                                    Default
                                                </Badge>
                                            ) : (
                                                <button
                                                    onClick={() => setConfig(t.tc_conf_data)}
                                                    className="text-xs px-2 py-1 bg-primary text-white rounded"
                                                >
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between mt-2 text-xs">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>{page} / {totalPages || 1}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>

            {/* MODAL */}
            {config && config !== "#" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-4 w-[600px] max-h-[70vh] overflow-auto rounded">
                        <table className="w-full text-xs">
                            <tbody>
                                {config.split("\n").map((l, i) => {
                                    const [k, ...v] = l.split("=");
                                    return (
                                        <tr key={i}>
                                            <td className="p-2 text-muted-foreground">{k}</td>
                                            <td className="p-2">{v.join("=")}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="text-right mt-2">
                            <button onClick={() => setConfig(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ───────── MAIN ───────── */

type TabKey = "casino" | "sharded" | "config" | "tables";

const TABS = [
    { key: "casino", label: "Casino Details" },
    { key: "sharded", label: "Sharded Details" },
    { key: "config", label: "Configurations" },
    { key: "tables", label: "Tables" },
];

export function CasinoDetailsResult({ data }: { data: NormalisedCasinoData }) {

    const [activeTab, setActiveTab] = useState<TabKey>("casino");

    return (
        <div className="border rounded bg-card">

            <div className="flex border-b">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as TabKey)}
                        className={activeTab === tab.key ? "px-4 py-2 border-b-2" : "px-4 py-2"}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-4">
                {activeTab === "casino" && <CasinoInfoTab data={data} />}
                {activeTab === "sharded" && <ShardedDetailsTab data={data} />}
                {activeTab === "config" && <ConfigurationsTab data={data} />}
                {activeTab === "tables" && <TablesTab tables={data?.tables || []} />}
            </div>

        </div>
    );
}