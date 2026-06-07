"use client";

import React, { useState } from "react";
import {
  NormalisedCasinoData,
  SharedEnv,
} from "@/lib/api/casino-details/casino-details";

/* SHADCN components */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

/* LUCIDE ICONS */
import { 
  Search, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Layers, 
  Sliders, 
  Table2, 
  Info, 
  Database 
} from "lucide-react";

/* ───────── HELPERS ───────── */

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 py-2.5 text-sm border-b border-gray-100 last:border-0 items-baseline">
      <span className="text-muted-foreground font-medium break-words">{label}</span>
      <span className="text-foreground font-semibold break-all whitespace-pre-wrap selection:bg-blue-50">
        {value ?? <span className="text-muted-foreground/40">—</span>}
      </span>
    </div>
  );
}

/* ───────── CASINO INFO OVERVIEW ───────── */

function CasinoInfoTab({ data }: { data: NormalisedCasinoData }) {
  return (
    <div className="w-full border border-gray-200 rounded-xl p-5 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-muted-foreground border-b border-gray-100 pb-3">
        <Info className="w-4 h-4 text-gray-500 stroke-[2.5]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Casino Overview</h3>
      </div>

      <div className="space-y-0.5">
        <KVRow label="Casino ID" value={data.casino_id} />
        <KVRow label="Casino Name" value={data.casino_desc} />
        <KVRow label="Wallet Type" value={data.Wallet_Type} />
        <KVRow label="Main Env ID" value={data.main_env_id} />
        <KVRow label="Main Env Name" value={data.main_env_name} />
        <KVRow 
          label="Extra Data On Bet" 
          value={
            <Badge variant={data.extra_data_on_bet ? "success" : "secondary"}>
              {data.extra_data_on_bet ? "Enabled" : "Disabled"}
            </Badge>
          } 
        />
        <KVRow 
          label="Extra Data On Win" 
          value={
            <Badge variant={data.extra_data_on_win ? "success" : "secondary"}>
              {data.extra_data_on_win ? "Enabled" : "Disabled"}
            </Badge>
          } 
        />
        <KVRow 
          label="Extra Data on DF" 
          value={
            <Badge variant={data.extra_data_on_df ? "success" : "secondary"}>
              {data.extra_data_on_df ? "Enabled" : "Disabled"}
            </Badge>
          } 
        />
      </div>
    </div>
  );
}

/* ───────── SHARDED ENVS TABLE ───────── */

function ShardedDetailsTab({ data }: { data: NormalisedCasinoData }) {
  if (!data.sharedEnvs || data.sharedEnvs.length === 0) {
    return (
      <div className="text-xs font-medium text-muted-foreground p-8 border border-dashed rounded-xl bg-gray-50/50 text-center flex flex-col items-center justify-center gap-2">
        <Database className="w-5 h-5 text-muted-foreground/60" />
        <span>No sharded environment clustering mapped to this node.</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs w-full">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[18%]">Casino ID</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[15%]">Env ID</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[27%]">Env Name</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[20%]">Sharded Casino ID</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[20%]">Sharded Operator ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.sharedEnvs.map((e: SharedEnv, i) => (
            <TableRow key={i} className="hover:bg-muted/30 border-b border-gray-100 last:border-0 font-medium text-sm">
              <TableCell className="font-mono text-xs break-all whitespace-pre-wrap">{e.casino_id}</TableCell>
              <TableCell className="font-mono text-xs break-all whitespace-pre-wrap">{e.env ?? e.env_id}</TableCell>
              <TableCell className="text-gray-700 break-words whitespace-pre-wrap">{e.env_name}</TableCell>
              <TableCell className="font-mono text-xs break-all whitespace-pre-wrap">{e.shardedCasinoId ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
              <TableCell className="font-mono text-xs break-all whitespace-pre-wrap">{e.shardedOperatorId ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ───────── CONFIGURATIONS TAB ───────── */

function ConfigurationsTab({ data }: { data: NormalisedCasinoData }) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const text = data.conf_data || "";
  const filtered = text
    .split("\n")
    .filter((l) => l.toLowerCase().includes(search.toLowerCase()));

  const handleCopyAll = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
   <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex gap-2 items-center justify-between shrink-0">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter keys or attributes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs border-gray-200"
          />
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={!text || text.trim() === ""}
          className="h-9 gap-1.5 font-semibold text-xs uppercase tracking-wider border-gray-200"
          onClick={handleCopyAll}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy Buffer"}
        </Button>
      </div>
<div className="flex-1 overflow-auto border border-gray-200 bg-white rounded-xl shadow-xs min-h-0">
        <Table className="table-fixed w-full min-w-[800px]">
          <TableBody>
            {filtered.map((line, i) => {
              const [k, ...v] = line.split("=");
              if (!k && v.length === 0) return null;
              return (
                <TableRow key={i} className="hover:bg-muted/30 border-b border-gray-100 last:border-0 text-xs font-medium">
                  <TableCell className="w-[20%] bg-gray-50/50 border-r border-gray-100 break-all whitespace-pre-wrap selection:bg-blue-100">
                    {k}
                  </TableCell>
                  <TableCell className="font-mono text-foreground break-all whitespace-pre-wrap selection:bg-blue-100">
                    {v.join("=")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ───────── LIVE TABLES WORKBOOK TAB ───────── */

function TablesTab({ tables }: { tables: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [configFilter, setConfigFilter] = useState("all");
  const [config, setConfig] = useState<string | null>(null);

  const [dialogSearch, setDialogSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const allLines = (config || "").split("\n").filter(line => line.trim() !== "");

  const handleSelectAll = () => {
    if (selectedRows.length === allLines.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allLines);
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((t) => ({
      table_name: t.table_name,
      operator_game_id: t.operator_game_id,
      table_id: t.table_id,
      env_name: t.env_name,
      status: t.table_open ? "Open" : "Closed",
    }));

    const header = Object.keys(rows[0]).join(",");
    const csv = [header, ...rows.map((r) => Object.values(r).join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lc_enabled_tables_manifest.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = tables.filter((t) => {
    const q = search.toLowerCase();
    const matchQuery =
      t.table_name?.toLowerCase().includes(q) ||
      String(t.operator_game_id || "").toLowerCase().includes(q) ||
      String(t.table_id || "").toLowerCase().includes(q) ||
      String(t.env_name || "").toLowerCase().includes(q);

    let matchStatus = true;
    if (statusFilter !== "all") {
      matchStatus = statusFilter === "open" ? t.table_open : !t.table_open;
    }

    let matchConfig = true;
    if (configFilter !== "all") {
      const isDefault = !t.tc_conf_data || t.tc_conf_data === "#";
      matchConfig = configFilter === "default" ? isDefault : !isDefault;
    }

    return matchQuery && matchStatus && matchConfig;
  });

  
// Pagination block //
const [page, setPage] = useState(1);
const rowsPerPage = 25;
const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

const start = (page - 1) * rowsPerPage;

const paginatedData =
  start >= filtered.length
    ? filtered.slice(0, rowsPerPage)
    : filtered.slice(start, page * rowsPerPage);


React.useEffect(() => {
  setPage(1);
}, [search, statusFilter, configFilter]);

  return (
  <div className="flex flex-col gap-3 h-full">
      
      {/* FILTER & CONTROL TASKBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search table matrix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs border-gray-200"
            />
          </div>

          <div className="text-xs flex items-center gap-1.5">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 bg-white rounded-md text-xs px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">All Channels</option>
              <option value="open">Open Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>

          <div className="text-xs flex items-center gap-1.5">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Config:</span>
            <select
              value={configFilter}
              onChange={(e) => setConfigFilter(e.target.value)}
              className="border border-gray-200 bg-white rounded-md text-xs px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">All Variables</option>
              <option value="default">Default Stack</option>
              <option value="custom">Custom Payload</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Total: <span className="font-bold text-foreground">{tables.length}</span> | Matched: <span className="font-bold text-foreground">{filtered.length}</span>
          </div>

          <Button
            size="sm"
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 h-8 gap-1.5 text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Manifest
          </Button>
        </div>
      </div>

  {/* CORE MATRIX GRID */}
<div className="flex flex-col border border-gray-200 bg-white rounded-xl shadow-xs flex-1 min-h-0">
  {/* ✅ TABLE SCROLL */}
  <div className="flex-1 overflow-auto">
    <Table className="table-fixed w-full min-w-[1000px]">
      <TableHeader className="bg-gray-50 sticky top-0 border-b border-gray-200 z-10">
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[25%]">Table Name</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[15%]">Game ID</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[15%]">Table ID</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[20%]">Environment</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[10%]">Status</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider h-10 w-[15%]">Configuration</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {paginatedData.map((t, i) => (
          <TableRow key={i} className="hover:bg-muted/30 border-b border-gray-100 last:border-0 font-medium text-sm">
            <TableCell className="font-semibold text-foreground break-all whitespace-pre-wrap">{t.table_name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{t.operator_game_id}</TableCell>
            <TableCell className="font-mono text-xs">{t.table_id}</TableCell>
            <TableCell className="text-xs">{t.env_name}</TableCell>

            <TableCell>
              <Badge variant={t.table_open ? "success" : "default"} className="text-[10px]">
                {t.table_open ? "Open" : "Closed"}
              </Badge>
            </TableCell>

            <TableCell>
              {!t.tc_conf_data || t.tc_conf_data === "#" ? (
                <span className="text-xs text-muted-foreground/60 pl-2">System default</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs font-semibold gap-1 px-2 border-gray-200"
                  onClick={() => {
                    setConfig(t.tc_conf_data);
                    setDialogSearch("");
                    setSelectedRows([]);
                  }}
                >
                  <Eye className="w-3 h-3" />
                  View Layer
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

  {/* ✅ PAGINATION (INSIDE SAME BOX) */}
  <div className="flex items-center justify-between px-3 py-2 border-t text-xs bg-gray-50">
    <span>Page {page} of {totalPages}</span>

    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
      >
        Prev
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={page === totalPages}
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      >
        Next
      </Button>
    </div>
  </div>

</div>
      {/* ───────── DRAWER CONFIG MODAL ───────── */}
      <Dialog open={!!config} onOpenChange={() => setConfig(null)}>
        <DialogContent className="w-[90vw] max-w-4xl max-h-[85vh] flex flex-col p-5 rounded-xl">
          <DialogHeader className="border-b border-gray-100 pb-3">
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gray-800" />
              Runtime Payload Parameters
            </DialogTitle>
          </DialogHeader>

          {/* INTERNAL MODAL CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-3 my-2 pt-1">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter active scope strings..."
                  value={dialogSearch}
                  onChange={(e) => setDialogSearch(e.target.value)}
                  className="pl-8 h-8 text-xs border-gray-200"
                />
              </div>

              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs font-semibold shrink-0"
                onClick={handleSelectAll}
              >
                {selectedRows.length === allLines.length ? "Deselect All" : "Select All"}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 disabled:opacity-30 shrink-0"
                onClick={() => setSelectedRows([])}
                disabled={selectedRows.length === 0}
              >
                Clear
              </Button>
            </div>

            <Button
              size="sm"
              className="bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider h-8 gap-1.5"
              onClick={() => {
                const payload = selectedRows.length > 0 ? selectedRows : allLines;
                navigator.clipboard.writeText(payload.join("\n"));
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : selectedRows.length > 0 ? `Copy Selected (${selectedRows.length})` : "Copy Full State"}
            </Button>
          </div>

          {/* COMPACTED SELECT MATRIX BUFFER */}
          <div className="flex-1 overflow-auto border border-gray-100 bg-gray-50/50 rounded-lg p-1 font-mono text-xs max-h-[50vh]">
            {allLines
              .filter(line => line.toLowerCase().includes(dialogSearch.toLowerCase()))
              .map((line, i) => {
                const checked = selectedRows.includes(line);
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (checked) {
                        setSelectedRows(selectedRows.filter(l => l !== line));
                      } else {
                        setSelectedRows([...selectedRows, line]);
                      }
                    }}
                    className={`flex items-start gap-3 py-1.5 px-2 border-b border-gray-200/40 last:border-0 cursor-pointer transition-colors select-all ${
                      checked ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-white"
                    }`}
                  >
                    <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isTrue) => {
                          if (isTrue) {
                            setSelectedRows([...selectedRows, line]);
                          } else {
                            setSelectedRows(selectedRows.filter(l => l !== line));
                          }
                        }}
                      />
                    </div>
                    <span className="leading-relaxed text-gray-800 break-all whitespace-pre-wrap">{line}</span>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───────── MAIN MANAGEMENT MODULE ───────── */


export function CasinoDetailsResult({
  data,
  tables,
  tablesLoading,
}: {
  data: NormalisedCasinoData;
  tables: any[];
  tablesLoading: boolean;
})
{
  const shardedCount = data.sharedEnvs?.length || 0;

  return (
    <div className="w-full min-h-screen flex flex-col p-1">
      <Tabs defaultValue="casino" className="space-y-4 w-full flex-1 flex flex-col">
        
        {/* SYSTEM CONTROLS TABS HUB */}
        <TabsList className="flex items-center bg-gray-100 p-1 rounded-xl w-fit gap-1 border border-gray-200/30 shrink-0 mb-0">
          <TabsTrigger
            value="casino"
            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all flex items-center gap-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xs"
          >
            <Info className="w-3.5 h-3.5 stroke-[2]" />
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="sharded"
            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 stroke-[2]" />
            <span>Sharded Envs</span>
            
            <Badge 
              variant={shardedCount > 0 ? "success" : "secondary"} 
              className="text-[10px] px-1.5 py-0.5 font-mono lowercase rounded-md"
            >
              {shardedCount} envs
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="config"
            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all flex items-center gap-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 stroke-[2]" />
            Configurations
          </TabsTrigger>

          <TabsTrigger
            value="tables"
            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all flex items-center gap-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xs"
          >
            <Table2 className="w-3.5 h-3.5 stroke-[2]" />
            Tables Configuration
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full pt-1">
          <TabsContent value="casino" className="mt-0 focus-visible:outline-none h-full"><CasinoInfoTab data={data} /></TabsContent>
          <TabsContent value="sharded" className="mt-0 focus-visible:outline-none h-full"><ShardedDetailsTab data={data} /></TabsContent>
          <TabsContent value="config" className="mt-0 focus-visible:outline-none h-full flex flex-col overflow-hidden"><ConfigurationsTab data={data} /></TabsContent>
          
<TabsContent value="tables" className="mt-0 focus-visible:outline-none h-full">
  {tablesLoading && tables.length === 0 ? (
    <div className="p-8 text-center text-sm text-muted-foreground">
      Loading LC enabled tables...
    </div>
  ) : (
    <TablesTab tables={tables} />
  )}
</TabsContent>

        </div>
      </Tabs>
    </div>
  );
}