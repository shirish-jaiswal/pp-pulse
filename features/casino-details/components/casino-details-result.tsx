"use client";

import { useState } from "react";
import {
  NormalisedCasinoData,
  SharedEnv,
} from "@/lib/api/casino-details/casino-details";

/* SHADCN */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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

/* ───────── HELPERS ───────── */

/* ✅ FIXED ALIGNMENT ONLY (NO STYLE CHANGE) */

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-6 py-2 text-sm border-b">
      
      <span className="text-gray-600 font-medium">
        {label}
      </span>

      <span className="text-gray-900 font-semibold break-words">
        {value ?? "—"}
      </span>

    </div>
  );
}

/* ✅ CASINO TAB — SAME STRUCTURE (JUST CLEAN ALIGNMENT) */

function CasinoInfoTab({ data }: { data: NormalisedCasinoData }) {
  return (
    <div className="max-w-3xl border rounded-lg p-5 shadow-sm bg-white">

      <h3 className="text-base font-semibold mb-4">Casino Overview</h3>

      <KVRow label="Casino ID" value={data.casino_id} />
      <KVRow label="Casino Name" value={data.casino_desc} />
      <KVRow label="Wallet Type" value={data.Wallet_Type} />
      <KVRow label="Main Env ID" value={data.main_env_id} />
      <KVRow label="Main Env Name" value={data.main_env_name} />
      <KVRow label="Extra Data On Bet" value={data.extra_data_on_bet ? "Yes" : "No"} />
      <KVRow label="Extra Data On Win" value={data.extra_data_on_win ? "Yes" : "No"} />
      <KVRow label="Extra Data on DF" value={data.extra_data_on_df ? "Yes" : "No"} />

    </div>
  );
}

/* ───────── SHARDED TAB ───────── */

function ShardedDetailsTab({ data }: { data: NormalisedCasinoData }) {
  if (!data.sharedEnvs || data.sharedEnvs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 border rounded-md">
        No sharded config
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-50 border-b sticky top-0">
        <TableRow>
          <TableHead>CasinoId</TableHead>
          <TableHead>Env Id</TableHead>
          <TableHead>Env Name</TableHead>
          <TableHead>Sharded CasinoId</TableHead>
          <TableHead>Sharded OperatorId</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.sharedEnvs.map((e: SharedEnv, i) => (
          <TableRow key={i} className="hover:bg-gray-50">
            <TableCell>{e.casino_id}</TableCell>
            <TableCell>{e.env ?? e.env_id}</TableCell>
            <TableCell>{e.env_name}</TableCell>
            <TableCell>{e.shardedCasinoId ?? "null"}</TableCell>
            <TableCell>{e.shardedOperatorId ?? "null"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ✅ CONFIG TAB */

function ConfigurationsTab({ data }: { data: NormalisedCasinoData }) {

  const [search, setSearch] = useState("");

  // ✅ NEW STATE
  const [copied, setCopied] = useState(false);

  const text = data.conf_data || "";

  const filtered = text
    .split("\n")
    .filter((l) => l.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex gap-2 mb-3">

        <Input
          placeholder="Search config..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px]"
        />

        {/* ✅ UPDATED COPY BUTTON */}
        <Button
          disabled={!text || text.trim() === ""}
          className="bg-gray-900 text-white hover:bg-gray-800 transition-all"
          onClick={() => {
            navigator.clipboard.writeText(text);

            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied ✅" : "Copy"}
        </Button>

      </div>

      <div className="max-h-[60vh] overflow-auto border rounded-md">
        <Table>
          <TableBody>
            {filtered.map((line, i) => {
              const [k, ...v] = line.split("=");
              return (
                <TableRow key={i}>
                  <TableCell className="w-[40%] text-gray-700 font-medium">
                    {k}
                  </TableCell>
                  <TableCell>
                    {v.join("=")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/* ✅ TABLES TAB */

function TablesTab({ tables }: { tables: any[] }) {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [configFilter, setConfigFilter] = useState("all");

  const [config, setConfig] = useState<string | null>(null);

  /* ✅ dialog state */
  const [dialogSearch, setDialogSearch] = useState("");

  /* ✅ selection state */
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

/* ✅ ALL LINES + SELECT ALL LOGIC */
const allLines = (config || "").split("\n");

const handleSelectAll = () => {
  if (selectedRows.length === allLines.length) {
    setSelectedRows([]); // Unselect all
  } else {
    setSelectedRows(allLines); // Select all
  }
};

// ✅ ✅ ADD THIS RIGHT BELOW
const exportToCSV = () => {
  if (filtered.length === 0) {
    alert("No data to export");
    return;
  }

  const rows = filtered.map((t) => ({
    table_name: t.table_name,
    operator_game_id: t.operator_game_id,
    table_id: t.table_id,
    env_name: t.env_name,
    status: t.table_open ? "Open" : "Closed",
  }));

  const header = Object.keys(rows[0]).join(",");

  const csv = [
    header,
    ...rows.map((r) => Object.values(r).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "lc_enabled_tables.csv";
  a.click();

  URL.revokeObjectURL(url);
};

  let filtered = tables.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.table_name?.toLowerCase().includes(q) ||
      String(t.operator_game_id || "").toLowerCase().includes(q) ||
      String(t.table_id || "").toLowerCase().includes(q) ||
      String(t.env_name || "").toLowerCase().includes(q)
    );
  });

  if (statusFilter !== "all") {
    filtered = filtered.filter((t) =>
      statusFilter === "open" ? t.table_open : !t.table_open
    );
  }

  if (configFilter !== "all") {
    filtered = filtered.filter((t) => {
      const isDefault = !t.tc_conf_data || t.tc_conf_data === "#";
      return configFilter === "default" ? isDefault : !isDefault;
    });
  }

  return (
    <>
      {/* ✅ FILTERS + COUNT */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">

        <div className="flex items-center gap-4">

          <Input
            placeholder="Search name, id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[220px]"
          />

          <div className="text-sm flex items-center gap-1">
            <span className="font-semibold text-gray-800">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="text-sm flex items-center gap-1">
            <span className="font-semibold text-gray-800">Config:</span>
            <select
              value={configFilter}
              onChange={(e) => setConfigFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="default">Default</option>
              <option value="custom">Custom</option>
            </select>
          </div>

        </div>

       <div className="flex items-center gap-4">

  <div className="text-sm text-muted-foreground">
    Total: <b>{tables.length}</b> | Showing: <b>{filtered.length}</b>
  </div>

<Button
  size="sm"
  className="
    bg-emerald-500 
    text-white 
    hover:bg-emerald-600 
    px-5 py-2 
    rounded-md 
    font-semibold 
    transition-all
  "
  onClick={exportToCSV}
>
  EXPORT TO CSV
</Button>

</div>

      </div>

      {/* ✅ TABLE */}
      <div className="max-h-[65vh] overflow-auto border rounded-md">
        <Table>
          <TableHeader className="bg-gray-50 sticky top-0 border-b">
            <TableRow>
              <TableHead>Table Name</TableHead>
              <TableHead>Game ID</TableHead>
              <TableHead>Table ID</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Config</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((t, i) => (
              <TableRow key={i} className="hover:bg-gray-50">
                <TableCell>{t.table_name}</TableCell>
                <TableCell>{t.operator_game_id}</TableCell>
                <TableCell>{t.table_id}</TableCell>
                <TableCell>{t.env_name}</TableCell>

                <TableCell>
                  <Badge className={t.table_open ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                    {t.table_open ? "● Open" : "● Closed"}
                  </Badge>
                </TableCell>

                <TableCell>
                  {!t.tc_conf_data || t.tc_conf_data === "#" ? (
                    <Badge className="bg-gray-100 text-gray-500">Default</Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      onClick={() => {
                        setConfig(t.tc_conf_data);
                        setDialogSearch("");
                        setSelectedRows([]); // reset
                      }}
                    >
                      👁 View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✅ POPUP */}
      <Dialog open={!!config} onOpenChange={() => setConfig(null)}>
        <DialogContent className="w-[85vw] max-w-[1100px] max-h-[80vh] flex flex-col">

          <DialogHeader>
            <DialogTitle>Table Configuration</DialogTitle>
          </DialogHeader>

          {/* ✅ CONTROLS */}
         <div className="flex items-center justify-between mb-3 gap-2">

  <div className="flex items-center gap-2">

    <Input
      placeholder="Search config..."
      value={dialogSearch}
      onChange={(e) => setDialogSearch(e.target.value)}
    />

    {/* ✅ SELECT ALL */}
    <Button size="sm" variant="outline" onClick={handleSelectAll}>
      {selectedRows.length === allLines.length
        ? "Unselect All"
        : "Select All"}
    </Button>

    {/* ✅ NEW: CLEAR SELECTED */}
    <Button
      size="sm"
      variant="outline"
      onClick={() => setSelectedRows([])}
      disabled={selectedRows.length === 0}
    >
      Clear Selected
    </Button>

  </div>

{/* ✅ COPY WITH FEEDBACK */}
<Button
  disabled={allLines.length === 0}
  className="bg-gray-900 text-white hover:bg-gray-800 transition-all"
  onClick={() => {
    const data =
      selectedRows.length > 0
        ? selectedRows
        : allLines;

    navigator.clipboard.writeText(data.join("\n"));

    setCopied(true);                 // ✅ show Copied
    setTimeout(() => {
      setCopied(false);              // ✅ revert after delay
    }, 1500);
  }}
>
  {copied ? "Copied ✅" : "Copy"}
</Button>

</div>
          {/* ✅ LIST */}
          <div className="max-h-[65vh] overflow-auto border rounded p-2">

            {allLines
              .filter(line =>
                line.toLowerCase().includes(dialogSearch.toLowerCase())
              )
              .map((line, i) => {
                const checked = selectedRows.includes(line);

                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2 border-b hover:bg-gray-50"
                  >

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows([...selectedRows, line]);
                        } else {
                          setSelectedRows(
                            selectedRows.filter(l => l !== line)
                          );
                        }
                      }}
                    />

                    <span className="text-sm select-text break-all">
                      {line}
                    </span>

                  </div>
                );
              })}

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}

/* ───────── MAIN ───────── */

export function CasinoDetailsResult({ data }: { data: NormalisedCasinoData }) {
  return (
    <Tabs defaultValue="casino" className="border rounded-lg p-4">
<TabsList className="flex gap-2 mb-3">

  <TabsTrigger
    value="casino"
    className="
      px-4 py-1.5 rounded-md text-sm transition-all

      text-gray-600

      hover:bg-gray-100 hover:text-gray-900

      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm
      data-[state=active]:font-medium
    "
  >
    Casino Details
  </TabsTrigger>

  <TabsTrigger
    value="sharded"
    className="
      px-4 py-1.5 rounded-md text-sm transition-all
      text-gray-600
      hover:bg-gray-100 hover:text-gray-900
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm
      data-[state=active]:font-medium
    "
  >
    Sharded Details
  </TabsTrigger>

  <TabsTrigger
    value="config"
    className="
      px-4 py-1.5 rounded-md text-sm transition-all
      text-gray-600
      hover:bg-gray-100 hover:text-gray-900
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm
      data-[state=active]:font-medium
    "
  >
    Configurations
  </TabsTrigger>

  <TabsTrigger
    value="tables"
    className="
      px-4 py-1.5 rounded-md text-sm transition-all
      text-gray-600
      hover:bg-gray-100 hover:text-gray-900
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm
      data-[state=active]:font-medium
    "
  >
    LC_Enabled_Tables
  </TabsTrigger>

</TabsList>

      <TabsContent value="casino"><CasinoInfoTab data={data} /></TabsContent>
      <TabsContent value="sharded"><ShardedDetailsTab data={data} /></TabsContent>
      <TabsContent value="config"><ConfigurationsTab data={data} /></TabsContent>
      <TabsContent value="tables"><TablesTab tables={data?.tables || []} /></TabsContent>

    </Tabs>
  );
}