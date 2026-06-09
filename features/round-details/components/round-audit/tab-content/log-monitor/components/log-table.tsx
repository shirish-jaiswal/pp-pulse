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
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

interface LogTableProps {
    filteredLogs: any[];
    visibleColumns: string[];
    activeTab: string;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
}

export function LogTable({ 
    filteredLogs, 
    visibleColumns, 
    activeTab = "default",
    isLoading = false,
    isError = false,
    onRetry
}: LogTableProps) {
    const { roundDetails, selectedRowsMap, setSelectedRowsMap, activeId } =
        useRoundDetails();

    const roundId = activeId || roundDetails?.tptInfo?.[0]?.round_id || "";

    // Simplified to prioritize the steady, unique 'id' derived by our hook
    const getLogId = (log: any, fallbackIdx: number): string => {
        if (!log) return String(fallbackIdx);
        if (log.id) return String(log.id);

        const timestamp = log.timestamp || log.raw?.["@timestamp"];
        if (timestamp) {
            return `${String(timestamp)}-${fallbackIdx}`;
        }

        const id = log.logId || log.raw?.id || log.raw?.logId;
        return id ? `${String(id)}-${fallbackIdx}` : String(fallbackIdx);
    };

    const allColumns = ["checkbox", "time", ...visibleColumns];

    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(() => {
        const widths: { [key: string]: number } = {
            checkbox: 36,
            time: 120,
        };
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
        e.stopPropagation();
        resizingRef.current = {
            col,
            startX: e.clientX,
            startWidth: columnWidths[col] ?? 260,
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

        setColumnWidths((prev) => {
            let minWidth = 100;
            if (col === "checkbox") minWidth = 32;
            if (col === "time") minWidth = 90;

            return {
                ...prev,
                [col]: Math.max(minWidth, startWidth + delta),
            };
        });
    };

    const onMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
    };

    const handleRowCheck = (logId: string) => {
        setSelectedRowsMap((prev: any) => {
            const roundData = prev[roundId] || {};
            const tabData: string[] = roundData[activeTab] || [];

            const exists = tabData.includes(logId);
            const updated = exists
                ? tabData.filter((id) => id !== logId)
                : [...tabData, logId];

            return {
                ...prev,
                [roundId]: {
                    ...roundData,
                    [activeTab]: updated,
                },
            };
        });
    };

    const handleSelectAll = () => {
        setSelectedRowsMap((prev: any) => {
            const roundData = prev[roundId] || {};
            const allIds = filteredLogs.map((log, i) => getLogId(log, i));
            const tabData: string[] = roundData[activeTab] || [];

            const isAllSelected = tabData.length === filteredLogs.length;

            return {
                ...prev,
                [roundId]: {
                    ...roundData,
                    [activeTab]: isAllSelected ? [] : allIds,
                },
            };
        });
    };

    const currentSelected = new Set<string>(
        selectedRowsMap?.[roundId]?.[activeTab] || []
    );

    const isAllSelected =
        filteredLogs.length > 0 &&
        currentSelected.size === filteredLogs.length;

    const isSomeSelected =
        currentSelected.size > 0 &&
        currentSelected.size < filteredLogs.length;

    return (
        <div className="flex-1 w-full max-h-full overflow-auto rounded-md border bg-background">
            <Table className="w-full table-fixed border-collapse">
                <TableHeader className="sticky top-0 z-20 bg-muted/50 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
                    <TableRow className="hover:bg-transparent">
                        {allColumns.map((col) => {
                            const isCheckbox = col === "checkbox";
                            const isTime = col === "time";
                            const width = columnWidths[col] ?? 260;

                            return (
                                <TableHead
                                    key={col}
                                    style={{ width, minWidth: width, maxWidth: width }}
                                    className={cn(
                                        "relative h-9 px-3 py-2 text-xs font-semibold text-foreground select-none truncate border-b border-r last:border-r-0",
                                        isCheckbox && "text-center p-0 align-middle"
                                    )}
                                >
                                    {isCheckbox ? (
                                        <div className="flex items-center justify-center h-full">
                                            <input
                                                type="checkbox"
                                                className="h-3.5 w-3.5 rounded border-muted-foreground/30 text-primary focus:ring-primary accent-primary cursor-pointer"
                                                checked={isAllSelected}
                                                ref={(el) => {
                                                    if (el) el.indeterminate = isSomeSelected;
                                                }}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                    ) : isTime ? (
                                        "Time"
                                    ) : (
                                        col
                                    )}
                                    <div
                                        onMouseDown={(e) => onMouseDown(e, col)}
                                        className="absolute -right-0.5 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-30"
                                    />
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={allColumns.length} className="h-32 text-center align-middle">
                                <div className="flex items-center justify-center space-x-2 font-mono text-xs text-muted-foreground">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span>Streaming live segment records...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={allColumns.length} className="h-32 text-center align-middle">
                                <div className="flex flex-col items-center justify-center space-y-2 text-xs">
                                    <p className="text-destructive font-medium">This logging context failed to respond.</p>
                                    {onRetry && (
                                        <button 
                                            onClick={onRetry}
                                            className="px-3 py-1 border text-[11px] bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 font-mono transition-all"
                                        >
                                            Retry Connection
                                        </button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : filteredLogs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={allColumns.length} className="h-24 text-center align-middle text-xs text-muted-foreground font-mono">
                                No logs recorded in this query view window.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredLogs.map((log: any, idx: number) => {
                            const logId = getLogId(log, idx);
                            const isChecked = currentSelected.has(logId);

                            return (
                                <TableRow
                                    key={logId}
                                    className={cn(
                                        "relative border-b last:border-b-0 group transition-colors hover:bg-muted/20",
                                        isChecked && "bg-muted/40 hover:bg-muted/50"
                                    )}
                                >
                                    {allColumns.map((col) => {
                                        const width = columnWidths[col] ?? 140;

                                        if (col === "checkbox") {
                                            return (
                                                <TableCell
                                                    key={col}
                                                    style={{ width, minWidth: width, maxWidth: width }}
                                                    className="p-0 align-middle text-center border-r group-last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-center h-full">
                                                        <input
                                                            type="checkbox"
                                                            className={cn(
                                                                "h-3.5 w-3.5 rounded border-muted-foreground/30 text-primary focus:ring-primary accent-primary cursor-pointer",
                                                                "after:absolute after:inset-0 after:z-10"
                                                            )}
                                                            checked={isChecked}
                                                            onChange={() => handleRowCheck(logId)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        if (col === "time") {
                                            const timestamp = log.timestamp || log.raw?.["@timestamp"];
                                            return (
                                                <TableCell
                                                    key={col}
                                                    style={{ width, minWidth: width, maxWidth: width }}
                                                    className="px-3 py-1.5 align-top border-r text-xs font-mono tracking-tight text-muted-foreground group-last:border-b-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                                                >
                                                    <div className="relative z-20 flex flex-col space-y-0.5 select-text whitespace-normal break-words">
                                                        <span>{timestamp ? new Date(timestamp).toUTCString() : "-"}</span>
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        const val = getNestedValue(log, col);
                                        return (
                                            <TableCell
                                                key={col}
                                                style={{ width, minWidth: width, maxWidth: width }}
                                                className="px-3 py-1.5 align-top border-r last:border-r-0 group-last:border-b-0"
                                            >
                                                <div className="relative z-20 text-xs leading-5 break-words [overflow-wrap:anywhere] select-text">
                                                    {typeof val === "object" && val !== null ? (
                                                        <pre className="relative z-20 text-[11px] font-mono bg-muted/40 p-2 rounded border border-muted/50 whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-h-40 overflow-y-auto cursor-default">
                                                            {JSON.stringify(val, null, 2)}
                                                        </pre>
                                                    ) : (
                                                        <span className="text-xs text-foreground/95 whitespace-pre-wrap break-all block">
                                                            {String(val ?? "-")}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}