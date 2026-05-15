"use client";

import {
  TableFooter,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export function DataTableFooter({ totals }: any) {
  return (
    <TableFooter>
      <TableRow className="bg-muted font-semibold">
        <TableCell colSpan={4} className="text-right">
          Totals
        </TableCell>

        <TableCell>{totals.totalPlaced.toFixed(2)}</TableCell>
        <TableCell>{totals.totalSettled.toFixed(2)}</TableCell>

        <TableCell>
          <span
            className={
              totals.netResult >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {totals.netResult.toFixed(2)}
          </span>
        </TableCell>

        <TableCell>
          <span
            className={
              totals.netResult >= 0
                ? "text-green-600 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {totals.netResult >= 0 ? "PROFIT" : "LOSS"}
          </span>
        </TableCell>

        <TableCell colSpan={999} />
      </TableRow>
    </TableFooter>
  );
}