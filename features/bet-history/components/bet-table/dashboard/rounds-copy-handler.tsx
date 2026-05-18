"use client";

import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { RoundRow } from "@/features/bet-history/components/bet-table/transform-bets";
import { Button } from "@/components/ui/button";

interface RoundsCopyHandlerProps<TData> {
  table: Table<TData>;
}

export const RoundsCopyHandler = <TData,>({
  table,
}: RoundsCopyHandlerProps<TData>) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const selectedRows = table.getSelectedRowModel().rows;

    // Use selected rows if any are checked; otherwise, fallback to all visible rows
    const rowsToCopy = selectedRows.length > 0
      ? selectedRows
      : table.getRowModel().rows;

    const roundIdsStr = rowsToCopy
      .map((row) => (row.original as RoundRow).roundId)
      .filter(Boolean) // Prevents undefined/null if a row lacks a roundId
      .join(", ");

    if (!roundIdsStr) return;

    try {
      await navigator.clipboard.writeText(roundIdsStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2 group/header">
      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
        Round ID
      </span>
      <Button
        variant="outline"
        size="xs"
        className="gap-1 bg-accent-foreground/10"
        onClick={handleCopy}
        aria-label="Copy Round IDs"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 animate-in fade-in zoom-in-75 duration-150" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
};