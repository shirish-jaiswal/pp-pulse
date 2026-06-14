"use client";

import { useMemo, useState } from "react";
import { Check, CheckSquare, Columns, Copy, RotateCcw, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatLabel, buildHtmlTable, buildPlainText } from "../utils/log-sidebar-utils";

type Props = {
  sidebarKeys: string[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  resetToDefault: () => void;
  filteredLogs: any[]; // Updated from 'logs' to 'filteredLogs'
};

export function LogSidebar({
  sidebarKeys,
  visibleColumns,
  setVisibleColumns,
  resetToDefault,
  filteredLogs,
}: Props) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const normalizedSearch = search.toLowerCase();
  const isSelected = (key: string) => visibleColumns.includes(key);

  const filteredKeys = useMemo(() => {
    return sidebarKeys.filter((key) =>
      formatLabel(key).toLowerCase().includes(normalizedSearch)
    );
  }, [sidebarKeys, normalizedSearch]);

  const selectedKeys = useMemo(
    () => filteredKeys.filter(isSelected),
    [filteredKeys, visibleColumns]
  );

  const unselectedKeys = useMemo(
    () => filteredKeys.filter((key) => !visibleColumns.includes(key)),
    [filteredKeys, visibleColumns]
  );

  const updateColumns = (columns: string[]) => setVisibleColumns(columns);
  const toggleKey = (key: string) => {
    updateColumns(
      isSelected(key) ? visibleColumns.filter((k) => k !== key) : [...visibleColumns, key]
    );
  };

  const copyTable = async () => {
    try {
      // Logic now correctly uses filteredLogs
      const html = buildHtmlTable(visibleColumns, filteredLogs);
      const text = buildPlainText(visibleColumns, filteredLogs);

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const renderColumnItem = (key: string) => (
    <label key={key} className={cn("flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-muted/60", isSelected(key) && "bg-background")}>
      <input type="checkbox" checked={isSelected(key)} onChange={() => toggleKey(key)} className="h-3 w-3" />
      <span className="truncate text-xs">{formatLabel(key)}</span>
    </label>
  );

  return (
    <aside className="flex w-48 h-full flex-col border-r bg-muted/40 shrink-0 select-none">
      <div className="flex h-10 items-center gap-2 border-b px-2 shrink-0">
        <Columns className="h-3 w-3" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fields..." className="flex-1 bg-transparent text-xs outline-none" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section title="Selected" actions={
          <>
            <button onClick={copyTable}>{copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}</button>
            <button onClick={resetToDefault}><RotateCcw className="h-3 w-3" /></button>
          </>
        }>
          {selectedKeys.map(renderColumnItem)}
        </Section>
        <Section title="Available" actions={<button onClick={() => updateColumns([...new Set([...visibleColumns, ...unselectedKeys])])}><CheckSquare className="h-3 w-3" /></button>}>
          {unselectedKeys.map(renderColumnItem)}
        </Section>
      </div>
    </aside>
  );
}

function Section({ title, children, actions }: any) {
  return (
    <div>
      <div className="flex justify-between px-3 py-1 text-[10px] uppercase text-muted-foreground sticky top-0 bg-muted/40 backdrop-blur-sm">
        <span>{title}</span>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}