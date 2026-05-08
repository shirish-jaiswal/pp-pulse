"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RoundRow } from "@/features/bet-history/components/bet-table/transform-bets";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { formatDate } from "@/features/round-details/components/round-audit/tab-content/transaction-table";

export const columns: ColumnDef<RoundRow>[] = [
  {
    accessorKey: "roundId",
    header: "Round ID",
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
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "time",
    header: "Time",
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: false,
    cell: ({ row }) =>
      formatDate(row.original.time)
  },
  {
    accessorKey: "totalPlaced",
    header: "Placed",
    enableSorting: false,
    enableColumnFilter: false, // optional (numeric filter later)
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
          row.original.profitLoss >= 0
            ? "text-green-600"
            : "text-red-600"
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
    filterFn: "arrIncludesSome",
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
    filterFn: "includesString",
  },
  {
    accessorKey: "errorDescription",
    header: "Error Desc",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "includesString",
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
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "gameMode",
    header: "Game Mode",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "arrIncludesSome",
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
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all rows"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
  };
}