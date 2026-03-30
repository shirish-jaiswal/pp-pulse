import { Table2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function TableListItem({ table, isSelected, onSelect, onRename, onDelete }: any) {
  return (
    <div
      onClick={() => onSelect(table.name)}
      className={`group flex items-start justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"
      }`}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <Table2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
          <span className="text-sm font-medium truncate">{table.name}</span>
        </div>
        <span className={`text-[10px] ml-5 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {table.rowCount} rows · {table.columnCount} cols
        </span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename(); }}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}