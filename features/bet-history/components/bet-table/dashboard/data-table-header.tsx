"use client";

import {
  flexRender,
} from "@tanstack/react-table";

import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import ColumnFilter from "./column-filter";

export function DataTableHeader({ table }: any) {
  return (
    /* Added shadow utility to preserve the horizontal border while scrolling */
    <TableHeader className="sticky top-0 bg-background z-20 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
      {table.getHeaderGroups().map((hg: any) => (
        <TableRow key={hg.id}>
          {hg.headers.map((h: any) => {
            const column = h.column;

            return (
              <TableHead
                key={h.id}
                onClick={
                  column.getCanSort()
                    ? column.getToggleSortingHandler()
                    : undefined
                }
                className="cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {flexRender(
                    column.columnDef.header,
                    h.getContext()
                  )}

                  {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    column.getCanSort() && (
                      <ArrowUpDown className="w-4 h-4 opacity-30" />
                    )
                  )}

                  {column.getCanFilter() && (
                    <ColumnFilter column={column} />
                  )}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}