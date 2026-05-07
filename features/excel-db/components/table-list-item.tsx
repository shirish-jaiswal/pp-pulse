import {
  Table2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TableListItem({
  table,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: any) {
  return (
    <div
      onClick={() => onSelect(table.name)}
      className={[
        "group flex items-center justify-between px-2 py-1 rounded-sm cursor-pointer",
        "transition-colors",
        isSelected
          ? "bg-muted border-l-2 border-primary"
          : "hover:bg-muted/50",
      ].join(" ")}
    >

      {/* LEFT SIDE */}
      <div className="flex items-center gap-2 min-w-0">

        <Table2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

        <div className="flex flex-col min-w-0 leading-tight">

          {/* name */}
          <span className="text-xs font-medium truncate">
            {table.name}
          </span>

          {/* meta */}
          <span className="text-[10px] text-muted-foreground">
            {table.rowCount}r · {table.columnCount}c
          </span>

        </div>
      </div>

      {/* ACTIONS */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
          >
            <Pencil className="h-3.5 w-3.5 mr-2" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}