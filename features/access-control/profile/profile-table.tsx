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

import ColumnFilter from "@/features/template-gallery/components/template-table/column-filters";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  colSpan: number;
};

export function ProfileTable<T>({
  data,
  columns,
  isLoading,
  colSpan,
}: Props<T>) {
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

                return (
                  <TableHead key={header.id} className="h-9 px-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 truncate">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              column.columnDef.header,
                              header.getContext()
                            )}
                      </div>

                      {/* FILTER UI */}
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

        {/* BODY */}
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="h-24 text-center text-sm"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
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
                colSpan={colSpan}
                className="h-24 text-center text-sm"
              >
                No Profiles found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}