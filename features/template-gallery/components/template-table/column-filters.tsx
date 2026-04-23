"use client";

import { useMemo, useState } from "react";
import { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";

export default function ColumnFilter<TData>({
  column,
}: {
  column: Column<TData, unknown>;
}) {
  const [search, setSearch] = useState("");

  const filterValue = column.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(filterValue) ? (filterValue as string[]) : []
  );

  const options = useMemo(() => {
    return Array.from(column.getFacetedUniqueValues().keys());
  }, [column]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const setValues = (values: string[]) => {
    column.setFilterValue(values.length ? values : undefined);
  };

  const toggleValue = (value: string) => {
    const next = new Set(selectedValues);

    if (next.has(value)) next.delete(value);
    else next.add(value);

    setValues(Array.from(next));
  };

  const selectAll = () => setValues(filteredOptions);
  const clearAll = () => setValues([]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-muted relative"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2 space-y-2">
        {/* Search */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="h-7 text-xs"
        />

        {/* Actions */}
        <div className="flex justify-between text-[11px]">
          <button
            onClick={selectAll}
            className="text-muted-foreground hover:text-foreground"
          >
            All
          </button>
          <button
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>

        {/* Options */}
        <div className="max-h-52 overflow-auto space-y-1 pr-1">
          {filteredOptions.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 text-xs cursor-pointer rounded px-1 py-1 hover:bg-muted"
            >
              <Checkbox
                checked={selectedValues.has(value)}
                onCheckedChange={() => toggleValue(value)}
              />
              <span className="truncate">{value}</span>
            </label>
          ))}

          {filteredOptions.length === 0 && (
            <p className="text-xs text-muted-foreground px-1">
              No results
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}