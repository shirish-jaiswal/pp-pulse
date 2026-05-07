"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ColumnVisibilityMenu } from "./column-visibility-menu";

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
  compact,
  setCompact,
  table,
  onExport,
}: any) {
  return (
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
  );
}