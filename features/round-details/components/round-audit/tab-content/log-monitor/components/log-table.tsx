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
    return (
        <div className="flex-1 overflow-auto">
            <Table className="w-full table-fixed border-separate border-spacing-0">
                <TableHeader className="sticky top-0 bg-background border-b border-border">
                    <TableRow>
                        <TableHead className="w-32 px-2 py-2 text-xs text-muted-foreground">
                            Time
                        </TableHead>

                        {visibleColumns.map((col: string) => (
                            <TableHead
                                key={col}
                                className="px-2 py-2 text-xs text-muted-foreground break-words"
                            >
                                {col}
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
                            {/* TIME */}
                            <TableCell className="w-32 px-2 py-1.5 text-xs whitespace-nowrap">
                                {log.raw?.["@timestamp"]?.split("T")[1]?.replace("Z", "") ||
                                    "--"}
                            </TableCell>

                            {/* DYNAMIC COLUMNS */}
                            {visibleColumns.map((col: string) => {
                                const val = getNestedValue(log, col);

                                return (
                                    <TableCell
                                        key={col}
                                        className="
                      px-2 py-1.5
                      min-w-0
                      max-w-[260px]
                      whitespace-pre-wrap
                      break-words
                      align-top
text-[11px]
                    "
                                    >
                                        {typeof val === "object" ? (
                                            <pre className="whitespace-pre-wrap break-words text-xs">
                                                {JSON.stringify(val, null, 2)}
                                            </pre>
                                        ) : (
                                            <span className="whitespace-pre-wrap break-words">
                                                {String(val ?? "-")}
                                            </span>
                                        )}
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