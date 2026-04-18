"use client";

import { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import { formatDate } from "./transaction-table";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";

type SortKey = "win" | "status";
type SortOrder = "asc" | "desc";

export default function BetTable({ items }: { items?: BetTableInfo }) {
  const [sortKey, setSortKey] = useState<SortKey>("win");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm italic border rounded-lg">
        No bet data available.
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "S":
        return { label: "Settled", priority: 3, style: "bg-emerald-500/5 text-emerald-400 border-emerald-400/20" };
      case "C":
        return { label: "Cancelled", priority: 1, style: "bg-rose-500/5 text-rose-400 border-rose-400/20" };
      default:
        return { label: "Unsettled", priority: 2, style: "bg-amber-500/5 text-amber-400 border-amber-400/20" };
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc"); // default for new column
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let valueA: number = 0;
      let valueB: number = 0;

      if (sortKey === "win") {
        valueA = a.payoff;
        valueB = b.payoff;
      }

      if (sortKey === "status") {
        valueA = getStatusConfig(a.status).priority;
        valueB = getStatusConfig(b.status).priority;
      }

      if (sortOrder === "asc") return valueA - valueB;
      return valueB - valueA;
    });
  }, [items, sortKey, sortOrder]);

  return (
    <div className="overflow-x-auto border border-border/60 rounded-lg bg-background/40">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border/50 bg-muted">
            <th className="px-4 py-2 text-xs text-left">Bet Details</th>
            <th className="px-4 py-2 text-xs text-left">Placed</th>
            <th className="px-4 py-2 text-xs text-left">Settled</th>
            <th className="px-4 py-2 text-xs text-right">Amount</th>

            {/* WIN SORT */}
            <th
              onClick={() => handleSort("win")}
              className="px-4 py-2 text-xs text-right cursor-pointer select-none hover:text-foreground"
            >
              Win {sortKey === "win" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            {/* STATUS SORT */}
            <th
              onClick={() => handleSort("status")}
              className="px-4 py-2 text-xs text-center cursor-pointer select-none hover:text-foreground"
            >
              Status {sortKey === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedItems.map((bet, i) => {
            const { label, style } = getStatusConfig(bet.status);

            return (
              <tr
                key={i}
                className={cn(
                  "border-b border-border/40 last:border-0 transition-colors",
                  bet.payoff > 0 ? "bg-emerald-400/10 ring ring-emerald-400 honver:bg-emerald-500/60" : "hover:bg-accent",
                )}
              >
                <td className="px-4 py-2">
                  <span className="truncate max-w-56 text-sm font-medium">
                    {bet.displayDescription}
                  </span>
                </td>

                <td className="px-4 py-2 text-muted-foreground font-mono text-xs whitespace-nowrap">
                  {formatDate(bet.place_time)}
                </td>

                <td className="px-4 py-2 text-muted-foreground font-mono text-xs whitespace-nowrap">
                  {formatDate(bet.settle_time)}
                </td>

                <td className="px-4 py-2 text-right font-mono text-sm">
                  {bet.amount.toFixed(2)}
                </td>

                <td
                  className={cn(
                    "px-4 py-2 text-right font-mono text-sm",
                    bet.payoff > 0 ? "text-emerald-400" : "text-muted-foreground"
                  )}
                >
                  {bet.payoff.toFixed(2)}
                </td>

                <td className="px-4 py-2 text-center">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md border text-[11px] font-medium",
                      style
                    )}
                  >
                    {label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}