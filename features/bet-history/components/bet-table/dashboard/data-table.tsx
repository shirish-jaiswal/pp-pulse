"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { RoundRow } from "@/features/bet-history/components/bet-table/transform-bets";

export function DataTable<T extends { roundId: string }>({
    columns,
    data,
}: {
    columns: ColumnDef<RoundRow, any>[];
    data: RoundRow[];

}) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "time", desc: true },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const table = useReactTable<RoundRow>({
        data,
        columns: [ ...columns],
        state: {
            sorting,
            globalFilter,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row: any) => row.roundId,
    });

    const fetchBulkRounds = () => {
        const selectedRows = table.getSelectedRowModel().rows;

        const roundIds = selectedRows
            .map((row) => row.original?.roundId)
            .join(",");
        const url = `/portal/round-activity?isBulk=true&rounds=${encodeURIComponent(roundIds)}`;
        console.log(url);
        window.open(url, "_blank");
    };
    return (
        <div>
            <div className="flex gap-1">
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="mb-1"
                />
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader className="bg-accent-foreground/10">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead
                                        key={h.id}
                                        onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}
                                        className={
                                            h.column.getCanSort()
                                                ? "cursor-pointer select-none"
                                                : ""
                                        }
                                    >
                                        <div className="flex items-center gap-1 ">
                                            {flexRender(
                                                h.column.columnDef.header,
                                                h.getContext()
                                            )}

                                            {h.column.getCanSort() && (
                                                h.column.getIsSorted() === "asc" ? (
                                                    <ArrowUp className="w-4 h-4" />
                                                ) : h.column.getIsSorted() === "desc" ? (
                                                    <ArrowDown className="w-4 h-4" />
                                                ) : (
                                                    <ArrowUpDown className="w-4 h-4 opacity-30" />
                                                )
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="text-center py-6"
                                >
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}