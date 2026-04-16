"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTransactionLogs } from "@/hooks/use-transactionlogs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";

// Flatten keys
const getDeepKeys = (obj: any, prefix = ""): string[] => {
  return Object.keys(obj).reduce((res: string[], el) => {
    const name = prefix ? `${prefix}.${el}` : el;
    if (
      typeof obj[el] === "object" &&
      obj[el] !== null &&
      !Array.isArray(obj[el])
    ) {
      return [...res, ...getDeepKeys(obj[el], name)];
    }
    return [...res, name];
  }, []);
};

// Get nested value
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export default function PremiumLogMonitor({ roundId, timeStamp }: any) {
  const { data, isLoading } = useTransactionLogs({ roundId, timeStamp });

  const [activeTab, setActiveTab] = useState<string>("");
  const [query, setQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // Tabs
  const availableTabs = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).filter((k) => Array.isArray(data[k]));
  }, [data]);

  // Set first tab
  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  // Logs + sidebar fields
  const { logs, sidebarKeys } = useMemo(() => {
    if (!data || !activeTab || !data[activeTab]) {
      return { logs: [], sidebarKeys: [] };
    }

    const tabLogs = data[activeTab];
    const keySet = new Set<string>();

    tabLogs.forEach((log: any) => {
      if (log.message) keySet.add("message");

      if (log.raw) {
        getDeepKeys(log.raw).forEach((k) => {
          if (!k.includes("@timestamp")) {
            keySet.add(`raw.${k}`);
          }
        });
      }
    });

    return {
      logs: tabLogs,
      sidebarKeys: Array.from(keySet).sort(),
    };
  }, [data, activeTab]);

  useEffect(() => {
    if (!activeTab || sidebarKeys.length === 0) return;

    let defaultCols: string[] = ["message"];

    if (activeTab === "platform") {
      defaultCols = [
        "message",
        "raw.app.requestLog.log",
        "raw.app.responseLog.log",
        "raw.app.serviceMethod",
        "raw.app.url",
      ];
    }

    // Only include valid keys
    const validDefaults = defaultCols.filter((col) =>
      sidebarKeys.includes(col)
    );

    setVisibleColumns(validDefaults);
  }, [activeTab, sidebarKeys]);

  // Filter + sort
  const filteredLogs = useMemo(() => {
    return logs
      .filter((l: any) =>
        !query ||
        JSON.stringify(l).toLowerCase().includes(query.toLowerCase())
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.raw?.["@timestamp"] || 0).getTime() -
          new Date(b.raw?.["@timestamp"] || 0).getTime()
      );
  }, [logs, query]);

  const columnWidth = useMemo(() => {
    const totalCols = visibleColumns.length + 1;
    return `${100 / totalCols}%`;
  }, [visibleColumns]);

  return (
    <div className="h-full w-full bg-white text-gray-800 flex flex-col font-mono text-xs">

      {/* HEADER */}
      <header className="h-12 px-4 border-b border-border/50 bg-background flex items-center gap-4">

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-md transition-colors",
                activeTab === tab
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto w-64">
          <Search
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full border border-border/50 bg-background rounded-md px-7 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-60 border-r border-border/50 bg-muted/30 flex flex-col">

          <div className="px-3 py-2 text-xs text-muted-foreground font-medium">
            Fields
          </div>

          <div className="flex-1 overflow-y-auto">
            {sidebarKeys.map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/30 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(key)}
                  onChange={() =>
                    setVisibleColumns((prev) =>
                      prev.includes(key)
                        ? prev.filter((k) => k !== key)
                        : [...prev, key]
                    )
                  }
                  className="accent-foreground"
                />
                <span className="truncate">{key}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* TABLE */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <Table className="table-fixed w-full border-collapse text-sm">

              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs font-medium text-muted-foreground">
                    Timestamp
                  </TableHead>

                  {visibleColumns.map((col) => (
                    <TableHead key={col} className="text-xs font-medium text-muted-foreground">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLogs.map((log: any, idx: any) => (
                  <TableRow
                    key={idx}
                    className="border-b border-border/40 hover:bg-accent/20"
                  >
                    {/* Timestamp */}
                    <TableCell className="text-[11px] font-mono text-muted-foreground align-top">
                      {log.raw?.["@timestamp"]
                        ?.split("T")[1]
                        ?.replace("Z", "") || "-"}
                    </TableCell>

                    {/* Dynamic */}
                    {visibleColumns.map((col) => {
                      const val = getNestedValue(log, col);

                      return (
                        <TableCell
                          key={col}
                          className="align-top text-sm text-foreground whitespace-pre-wrap wrap-break-words"
                        >
                          {typeof val === "object"
                            ? JSON.stringify(val, null, 2)
                            : String(val ?? "-")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      <footer className="h-8 border-t border-border/50 bg-background px-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Logs: {filteredLogs.length} | Fields: {visibleColumns.length}
        </span>
        <span>Ready</span>
      </footer>
    </div>
  );
}