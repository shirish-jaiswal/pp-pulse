"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ColumnFilter from "./column-filters";
import { Badge } from "@/components/ui/badge";

interface Props<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
}

const getFilterCount = (value: unknown): number => {
  return Array.isArray(value) ? value.length : 0;
};

export function TemplateGalleryTable<TData>({
  data,
  columns,
}: Props<TData>) {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="rounded-md border bg-background">
      <Table>
        {/* HEADER */}
        <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur border-b">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => {
                const column = header.column;
                const filterValue = column.getFilterValue();
                const filterCount = getFilterCount(filterValue);

                return (
                  <TableHead
                    key={header.id}
                    className="h-9 px-2 text-xs text-muted-foreground"
                  >
                    <div className="flex items-right gap-2">
                      <div className="flex items-right gap-1 truncate">
                        {flexRender(
                          column.columnDef.header,
                          header.getContext()
                        )}

                        {/* FILTER COUNT BADGE */}
                        {column.getCanFilter() && filterCount > 0 && (
                          <Badge variant="outline">
                            {filterCount}
                          </Badge>
                        )}
                      </div>

                      {/* FILTER ICON */}
                      {column.getCanFilter() && (
                        <div className="opacity-60 hover:opacity-100 transition">
                          <ColumnFilter column={column} />
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/40">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-2 py-1 text-sm">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}