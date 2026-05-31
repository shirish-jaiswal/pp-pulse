"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColumnVisibilityMenu } from "@/features/bet-history/components/bet-table/dashboard/column-visibility-menu";
import { useBetHistory } from "@/features/bet-history/context/bet-history-context";
import { ExternalLink } from "lucide-react";

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
  compact,
  setCompact,
  table,
  onExport,
}: any) {

  const { input } = useBetHistory();
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-60"
        />

        <Button size="sm" variant="outline" onClick={onExport}>
          Export CSV
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setCompact(!compact)}
        >
          {compact ? "Comfortable" : "Compact"}
        </Button>

        <ColumnVisibilityMenu table={table} />
      </div>

      <Button
        size="sm"
        variant="link"
        onClick={() => window.open(`/portal/user-management?userId=${input}`, "_blank", "noopener,noreferrer")}
        disabled={!input}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 gap-1 px-2 h-9 font-medium"
      >
        Visit :: {input?.playerId || "User"}
        <span className="text-xs">↗</span>
      </Button>

    </div>
  );
}