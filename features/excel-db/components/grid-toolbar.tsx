import { Search, RefreshCw, Download, Plus, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function GridToolbar({
  tableName,
  rowCount,
  search,
  onSearchChange,
  onRefresh,
  onExport,
  onInsert,
}: any) {
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-b border-border bg-background w-full">

      {/* LEFT: Context */}
      <div className="flex items-center gap-2 min-w-0">
        <Table2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

        <span className="text-xs font-semibold truncate">
          {tableName}
        </span>

        <Badge
          variant="outline"
          className="text-[10px] h-4 px-1.5 font-medium border-border"
        >
          {rowCount} rows
        </Badge>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-1.5">

        {/* Search (compact + stable width behavior) */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-7 pl-7 pr-2 text-xs border-border bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Actions (icon-only = faster scanning) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-muted/60"
          onClick={onRefresh}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-muted/60"
          onClick={onExport}
        >
          <Download className="h-3.5 w-3.5" />
        </Button>

        {/* Primary action */}
        <Button
          size="sm"
          className="h-7 text-xs px-2.5 font-medium"
          onClick={onInsert}
        >
          <Plus className="h-3.5 w-3.5" />
          Insert
        </Button>

      </div>
    </div>
  );
}