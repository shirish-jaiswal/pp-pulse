"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react"; // Icon addition
import { ColumnVisibilityMenu } from "@/features/bet-history/components/bet-table/dashboard/column-visibility-menu";
import { useBetHistory } from "@/features/bet-history/context/bet-history-context";

function formatDateString(isoStr: string | undefined): string {
  if (!isoStr) return "";
  const parsed = new Date(isoStr.endsWith("Z") ? isoStr : `${isoStr}Z`);
  if (isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
  compact,
  setCompact,
  table,
  onExport,
}: any) {
  const { input } = useBetHistory();

  const dateDisplay = React.useMemo(() => {
    if (!input?.from || !input?.to) return null;
    const fromFormatted = formatDateString(input.from);
    const toFormatted = formatDateString(input.to);

    if (fromFormatted === toFormatted) {
      return fromFormatted;
    }
    return `${fromFormatted} — ${toFormatted}`;
  }, [input?.from, input?.to]);

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between w-full">
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-60 h-9 text-sm"
        />

        {dateDisplay && (
          <div className="flex items-center gap-2 px-3 h-9 text-xs font-medium rounded-md border border-primary/20 bg-primary/5 text-primary shadow-sm select-none animate-in fade-in duration-200">
            <Calendar className="h-3.5 w-3.5 opacity-90 text-primary shrink-0" />
            <span className="opacity-85 tracking-wide uppercase font-semibold text-[10px] border-r border-primary/20 pr-2">
              Viewing
            </span>
            <span className="font-bold tracking-tight text-foreground dark:text-primary-foreground/90">
              {dateDisplay}
            </span>
          </div>
        )}

        <Button size="sm" variant="outline" className="h-9" onClick={onExport}>
          Export CSV
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-9"
          onClick={() => setCompact(!compact)}
        >
          {compact ? "Comfortable" : "Compact"}
        </Button>

        <ColumnVisibilityMenu table={table} />
      </div>

      <Button
        size="sm"
        variant="link"
        onClick={() => window.open(`/portal/user-management?userId=${input.playerId}`, "_blank", "noopener,noreferrer")}
        disabled={!input?.playerId}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 gap-1 px-2 h-9 font-medium"
      >
        Visit :: {input?.playerId || "User"}
        <span className="text-xs">↗</span>
      </Button>
    </div>
  );
}