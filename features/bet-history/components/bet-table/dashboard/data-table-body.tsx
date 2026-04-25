"use client";

import { flexRender } from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export function DataTableBody({ table, compact, columns }: any) {
  return (
    <TableBody>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row: any) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell: any) => (
              <TableCell
                key={cell.id}
                className={compact ? "py-1" : "py-3"}
              >
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
          <TableCell colSpan={columns.length} className="text-center py-6">
            No results
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}