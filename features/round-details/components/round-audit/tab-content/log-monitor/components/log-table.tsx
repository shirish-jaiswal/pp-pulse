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
    // Initializing widths for both the "Time" column and all dynamic columns
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(() => {
        const widths: { [key: string]: number } = { time: 120 }; // Base width for timestamp
        visibleColumns.forEach((col: string) => {
            widths[col] = 200;
        });
        return widths;
    });

    const resizingRef = useRef<{ col: string; startX: number; startWidth: number } | null>(null);

    const onMouseDown = (e: React.MouseEvent, col: string) => {
        resizingRef.current = {
            col,
            startX: e.clientX,
            startWidth: columnWidths[col] || (col === 'time' ? 120 : 200),
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "col-resize";
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!resizingRef.current) return;
        const { col, startX, startWidth } = resizingRef.current;
        const delta = e.clientX - startX;

        setColumnWidths((prev) => ({
            ...prev,
            [col]: Math.max(col === 'time' ? 100 : 80, startWidth + delta),
        }));
    };

    const onMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "default";
    };

    return (
        <div className="flex-1 overflow-auto rounded-md border bg-background">
            <Table className="w-full table-fixed border-separate border-spacing-0">
                <TableHeader className="sticky top-0 z-10 bg-background border-b border-border">
                    <TableRow>
                        {/* Time Header with Resizer */}
                        <TableHead
                            style={{ width: columnWidths["time"] }}
                            className="relative px-2 py-2 text-xs text-muted-foreground border-r group"
                        >
                            <div className="truncate">Time</div>
                            <div
                                onMouseDown={(e) => onMouseDown(e, "time")}
                                className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/50 active:bg-primary z-20"
                            />
                        </TableHead>

                        {/* Dynamic Column Headers */}
                        {visibleColumns.map((col: string) => (
                            <TableHead
                                key={col}
                                style={{ width: columnWidths[col] || 200 }}
                                className="relative px-2 py-2 text-xs text-muted-foreground border-r group"
                            >
                                <div className="truncate">{col}</div>
                                <div
                                    onMouseDown={(e) => onMouseDown(e, col)}
                                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/50 active:bg-primary z-20"
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredLogs.map((log: any, idx: number) => (
                        <TableRow
                            key={idx}
                            className={cn(
                                "border-b border-border/40",
                                idx % 2 === 0 ? "bg-background" : "bg-muted/20",
                                "hover:bg-muted/40"
                            )}
                        >
                            {/* Time Cell - Width matches Header */}
                            <TableCell
                                style={{ width: columnWidths["time"] }}
                                className="px-2 py-1.5 text-[11px] whitespace-nowrap font-mono align-top border-r overflow-hidden"
                            >
                                <div className="flex flex-col leading-tight">
                                    <span>
                                        {log.raw?.["@timestamp"]?.split("T")[0] || "--"}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {log.raw?.["@timestamp"]
                                            ?.split("T")[1]
                                            ?.replace("Z", "") || "--"}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Dynamic Value Cells */}
                            {visibleColumns.map((col: string) => {
                                const val = getNestedValue(log, col);
                                return (
                                    <TableCell
                                        key={col}
                                        style={{ width: columnWidths[col] || 200 }}
                                        className="px-2 py-1.5 text-[11px] align-top min-w-0 border-r"
                                    >
                                        <div className="w-full break-all whitespace-pre-wrap overflow-hidden">
                                            {typeof val === "object" ? (
                                                <pre className="text-[10px] bg-muted/30 p-1 rounded font-mono break-all whitespace-pre-wrap">
                                                    {JSON.stringify(val, null, 2)}
                                                </pre>
                                            ) : (
                                                <span className="block leading-tight">
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