"use client";

import { Column } from "@tanstack/react-table";
import { useMemo, useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Filter } from "lucide-react";

/* ------------------ Debounce Hook ------------------ */
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

interface ColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export default function ColumnFilter<TData, TValue>({
  column,
}: ColumnFilterProps<TData, TValue>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  /* ✅ IMPORTANT: DO NOT memoize this */
  const facetedValues = column.getFacetedUniqueValues();

  const MAX_OPTIONS = 500;

  const options = useMemo(() => {
    return Array.from(facetedValues.keys())
      .map(String)
      .filter((v) =>
        v.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      .sort()
      .slice(0, MAX_OPTIONS);
  }, [facetedValues, debouncedSearch]);

  const filterValue = (column.getFilterValue() as string[]) ?? [];

  const toggleValue = (value: string) => {
    const isSelected = filterValue.includes(value);

    column.setFilterValue(
      isSelected
        ? filterValue.filter((v) => v !== value)
        : [...filterValue, value]
    );
  };

  const clearAll = () => column.setFilterValue([]);
  const selectAll = () => column.setFilterValue(options);

  /* focus search input when open */
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="gap-1 bg-accent-foreground/10"
        >
          <Filter className="w-3 h-3" />
          {filterValue.length > 0 && (
            <span className="text-xs">({filterValue.length})</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-2">
        {/* HEADER */}
        <DropdownMenuLabel className="text-xs flex justify-between p-0">
          <span>Filter values</span>

          <div className="flex gap-1">
            <Button size="xs" variant="secondary" onClick={selectAll}>
              All
            </Button>
            <Button size="xs" variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </DropdownMenuLabel>

        {/* SEARCH */}
        <Input
          ref={inputRef}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-xs mt-2"
        />

        <DropdownMenuSeparator />

        {/* OPTIONS */}
        <div className="max-h-48 overflow-auto space-y-1 pr-1">
          {options.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2">
              No options
            </p>
          ) : (
            options.map((value) => (
              <DropdownMenuItem
                key={value}
                onSelect={(e) => e.preventDefault()}
                className="flex items-center gap-2 text-xs"
              >
                <Checkbox
                  checked={filterValue.includes(value)}
                  onCheckedChange={() => toggleValue(value)}
                />
                <span className="truncate">{value}</span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}