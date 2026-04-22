"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RoundRow } from "@/features/bet-history/components/bet-table/transform-bets";
import Link from "next/link";

export const columns: ColumnDef<RoundRow>[] = [
    {
        accessorKey: "roundId",
        header: "Round ID",
        cell: ({ row }) => (
            <Link
                target="_blank"
                href={`/round-activity/?roundId=${row.original.roundId}`}
                className="text-blue-500 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
                {row.original.roundId}
            </Link>),
        enableSorting: true,
    },
    {
        accessorKey: "gameId",
        header: "Game ID",
        enableSorting: true,
    },

    {
        accessorKey: "time",
        header: "Time",
        enableSorting: true,
        sortingFn: "datetime",
        cell: ({ row }) =>
            new Date(row.original.time).toLocaleString(),
    },

    {
        accessorKey: "totalPlaced",
        header: "Placed",
        enableSorting: true,
        cell: ({ row }) => row.original.totalPlaced.toFixed(2),
    },

    {
        accessorKey: "totalSettled",
        header: "Settled",
        enableSorting: true,
        cell: ({ row }) => row.original.totalSettled.toFixed(2),
    },

    {
        accessorKey: "profitLoss",
        header: "P/L",
        enableSorting: true,
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
        enableSorting: true,
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
    },
    {
        accessorKey: "errorDescription",
        header: "Error Description",
        enableSorting: false,
    },
    {
        accessorKey: "retryCounter",
        header: "Retries",
        enableSorting: true,
    },
    {
        accessorKey: "gameMode",
        header: "Game Mode",
        enableSorting: false,
    },
];