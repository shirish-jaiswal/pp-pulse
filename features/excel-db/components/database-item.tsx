"use client";

import { Database, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DatabaseItemProps {
  db: { name: string; tableCount: number };
  isSelected: boolean;
  onSelect: (name: string) => void;
  onRename: () => void;
  onDelete: () => void;
}

export function DatabaseItem({
  db,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: DatabaseItemProps) {
  return (
    <div
      onClick={() => onSelect(db.name)}
      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-sm cursor-pointer transition-colors border ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:bg-muted/50 border-transparent"
      }`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-2 min-w-0">

        <Database
          className={`h-3.5 w-3.5 shrink-0 ${
            isSelected
              ? "opacity-90"
              : "opacity-60"
          }`}
        />

        <span className="text-xs font-medium truncate">
          {db.name}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1.5">

        <Badge
          variant={isSelected ? "secondary" : "outline"}
          className="text-[10px] h-4 px-1.5 leading-none"
        >
          {db.tableCount}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ${
                isSelected
                  ? "hover:bg-primary-foreground/15 text-primary-foreground"
                  : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36">

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
              className="text-xs"
            >
              <Pencil className="h-3 w-3 mr-2" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  );
}