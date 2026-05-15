"use client";

import React, { useState, useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils/cn";
import { getNestedValue } from "@/features/round-details/components/round-audit/tab-content/log-monitor/utils/log-utils";

export function LogTable({ filteredLogs, visibleColumns }: any) {
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(() => {
        const widths: { [key: string]: number } = { time: 180 };

        visibleColumns.forEach((col: string) => {
            widths[col] = 260;
        });

        return widths;
    });

    const resizingRef = useRef<{
        col: string;
        startX: number;
        startWidth: number;
    } | null>(null);

    const onMouseDown = (e: React.MouseEvent, col: string) => {
        resizingRef.current = {
            col,
            startX: e.clientX,
            startWidth: columnWidths[col],
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!resizingRef.current) return;

        const { col, startX, startWidth } = resizingRef.current;
        const delta = e.clientX - startX;

        setColumnWidths((prev) => ({
            ...prev,
            [col]: Math.max(140, startWidth + delta),
        }));
    };

    const onMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
    };

    return (
        <div className="flex-1 overflow-auto rounded-xl border bg-background">
            <Table className="w-full table-fixed border-separate border-spacing-y-2">

                {/* HEADER */}
                <TableHeader className="sticky top-0 z-20 bg-background">
                    <TableRow>
                        <TableHead
                            style={{ width: columnWidths["time"] }}
                            className="relative px-4 py-4 text-xs font-medium text-muted-foreground"
                        >
                            Time

                            <div
                                onMouseDown={(e) => onMouseDown(e, "time")}
                                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/40"
                            />
                        </TableHead>

                        {visibleColumns.map((col: string) => (
                            <TableHead
                                key={col}
                                style={{ width: columnWidths[col] }}
                                className="relative px-4 py-4 text-xs font-medium text-muted-foreground"
                            >
                                {col}

                                <div
                                    onMouseDown={(e) => onMouseDown(e, col)}
                                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/40"
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                {/* BODY */}
                <TableBody>
                    {filteredLogs.map((log: any, idx: number) => (
                        <TableRow
                            key={idx}
                            className={cn(
                                "bg-background",
                                "hover:bg-muted/20 transition-colors"
                            )}
                        >
                            {/* TIME */}
                            <TableCell
                                style={{ width: columnWidths["time"] }}
                                className="px-4 py-4 align-top border-r"
                            >
                                <div className="flex flex-col leading-6">
                                    <span className="text-xs text-muted-foreground ">
                                        {log.raw?.["@timestamp"]?.split("T")[0] || "--"}
                                    </span>

                                    <span className="text-foreground">
                                        {log.raw?.["@timestamp"]
                                            ?.split("T")[1]
                                            ?.replace("Z", "") || "--"}
                                    </span>
                                </div>
                            </TableCell>

                            {/* DYNAMIC COLUMNS */}
                            {visibleColumns.map((col: string) => {
                                const val = getNestedValue(log, col);

                                return (
                                    <TableCell
                                        key={col}
                                        style={{ width: columnWidths[col] }}
                                        className="px-4 py-4 align-top border-r"
                                    >
                                        <div className="text-sm leading-6 whitespace-normal wrap-break-word overflow-wrap-anywhere">
                                            {typeof val === "object" && val !== null ? (
                                                <pre className="text-xs font-mono bg-muted/30 p-3 rounded-md whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">
                                                    {JSON.stringify(val, null, 2)}
                                                </pre>
                                            ) : (
                                                <span className="block whitespace-normal wrap-break-word overflow-wrap-anywhere">
                                                    {String(val ?? "-")}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}