"use client";

import { useMemo, useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Settings2 } from "lucide-react";

/* ------------------ Debounce Hook ------------------ */
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function ColumnVisibilityMenu({ table }: any) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(search, 200);

  const columns = table.getAllLeafColumns();

  /* ------------------ FILTER COLUMNS ------------------ */
  const filteredColumns = useMemo(() => {
    return columns.filter((col: any) => {
      const label =
        typeof col.columnDef.header === "string"
          ? col.columnDef.header
          : col.id;

      return label
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });
  }, [columns, debouncedSearch]);

  /* ------------------ ACTIONS ------------------ */
  const toggleColumn = (column: any) => {
    column.toggleVisibility(!column.getIsVisible());
  };

  const visibleCount = columns.filter((c: any) =>
    c.getIsVisible()
  ).length;

  const selectAll = () => {
    columns.forEach((c: any) => c.toggleVisibility(true));
  };

  const clearAll = () => {
    columns.forEach((c: any) => c.toggleVisibility(false));
  };

  /* ------------------ AUTO FOCUS ------------------ */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Columns
          {visibleCount !== columns.length && (
            <span className="text-xs text-muted-foreground">
              ({visibleCount}/{columns.length})
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-2">
        {/* HEADER */}
        <DropdownMenuLabel className="flex justify-between items-center text-xs p-0">
          <span>Manage Columns</span>

          <div className="flex gap-1">
            <Button size="sm" variant="secondary" onClick={selectAll}>
              All
            </Button>
            <Button size="sm" variant="ghost" onClick={clearAll}>
              None
            </Button>
          </div>
        </DropdownMenuLabel>

        {/* SEARCH */}
        <Input
          ref={inputRef}
          placeholder="Search columns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-xs mt-2"
        />

        <DropdownMenuSeparator />

        {/* SCROLL AREA */}
        <div className="max-h-52 overflow-auto space-y-1 pr-1">
          {filteredColumns.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2">
              No columns found
            </p>
          ) : (
            filteredColumns.map((column: any) => {
              const label =
                typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id;

              return (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-xs"
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    onCheckedChange={() => toggleColumn(column)}
                  />
                  <span className="truncate">{label}</span>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}