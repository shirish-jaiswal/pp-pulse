"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RoundRow } from "@/features/bet-history/components/bet-table/transform-bets";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { formatDate } from "@/utils/date-utils";
import { RoundsCopyHandler } from "@/features/bet-history/components/bet-table/dashboard/rounds-copy-handler";

// Reuseable true-OR matching function for primitive string values
const multiSelectOrFilterFn = (row: Row<RoundRow>, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true;
  const rowValue = row.getValue(columnId);
  return filterValue.includes(String(rowValue));
};

// Tells TanStack Table to automatically clean up the filter state when it's empty
multiSelectOrFilterFn.autoRemove = (val: any) => !val || val.length === 0;

export const columns: ColumnDef<RoundRow>[] = [
  {
    accessorKey: "roundId",
    header: ({ table }) => <RoundsCopyHandler table={table} />,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: ({ row }) => (
      <Link
        target="_blank"
        href={`/round-activity/?roundId=${row.original.roundId}`}
        className="text-blue-500 hover:text-blue-800 hover:underline font-medium transition-colors"
      >
        {row.original.roundId}
      </Link>
    ),
  },
  {
    accessorKey: "gameId",
    header: "Game ID",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "time",
    header: "Time",
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: false,
    cell: ({ row }) => formatDate(row.original.time),
  },
  {
    accessorKey: "totalPlaced",
    header: "Placed",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => row.original.totalPlaced.toFixed(2),
  },
  {
    accessorKey: "totalSettled",
    header: "Settled",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => row.original.totalSettled.toFixed(2),
  },
  {
    accessorKey: "profitLoss",
    header: "P/L",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span
        className={
          row.original.profitLoss >= 0 ? "text-green-600" : "text-red-600"
        }
      >
        {row.original.profitLoss.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: multiSelectOrFilterFn,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={
            status === "WIN"
              ? "bg-green-500"
              : status === "LOSS"
              ? "bg-red-500"
              : "bg-gray-400"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "errorCode",
    header: "Error Code",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: multiSelectOrFilterFn,
  },
  {
    accessorKey: "errorDescription",
    header: "Error Desc",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: multiSelectOrFilterFn,
    cell: ({ row }) => (
      <div className="max-w-52 whitespace-normal wrap-break-words">
        {row.original.errorDescription}
      </div>
    ),
  },
  {
    accessorKey: "retryCounter",
    header: "Retries",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "gameMode",
    header: "Game Mode",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: multiSelectOrFilterFn,
  },
];

export function getSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}