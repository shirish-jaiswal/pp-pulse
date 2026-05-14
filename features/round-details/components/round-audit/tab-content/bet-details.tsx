"use client";

import { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import { BetTableInfo } from "@/features/round-details/types/bet-table-info";
import { formatDate } from "@/utils/date-utils";

type SortKey = "win" | "status";
type SortOrder = "asc" | "desc";

export default function BetTable({ items }: { items?: BetTableInfo }) {
  const [sortKey, setSortKey] = useState<SortKey>("win");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "S":
        return {
          label: "Settled",
          priority: 3,
          style: "bg-emerald-50 text-emerald-600 border-emerald-200",
        };
      case "C":
        return {
          label: "Cancelled",
          priority: 1,
          style: "bg-rose-50 text-rose-600 border-rose-200",
        };
      default:
        return {
          label: "Unsettled",
          priority: 2,
          style: "bg-amber-50 text-amber-600 border-amber-200",
        };
    }
  };

  // ✅ Hooks must be called BEFORE any early returns
  const sortedItems = useMemo(() => {
    if (!items || items.length === 0) return [];

    return [...items].sort((a, b) => {
      let valueA = 0;
      let valueB = 0;

      if (sortKey === "win") {
        valueA = a.payoff;
        valueB = b.payoff;
      }

      if (sortKey === "status") {
        valueA = getStatusConfig(a.status).priority;
        valueB = getStatusConfig(b.status).priority;
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [items, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  // ✅ Early return happens only after all hooks have been declared
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm italic border rounded-lg">
        No bet data available.
      </div>
    );
  }

  const SortIndicator = ({ active }: { active: boolean }) => (
    <span className="ml-1 text-[10px] opacity-70">
      {active ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr className="text-xs text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">Bet</th>
            <th className="px-4 py-3 text-left font-medium">Placed</th>
            <th className="px-4 py-3 text-left font-medium">Settled</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th
              onClick={() => handleSort("win")}
              className="px-4 py-3 text-right font-medium cursor-pointer hover:text-foreground"
            >
              Win
              <SortIndicator active={sortKey === "win"} />
            </th>
            <th
              onClick={() => handleSort("status")}
              className="px-4 py-3 text-center font-medium cursor-pointer hover:text-foreground"
            >
              Status
              <SortIndicator active={sortKey === "status"} />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((bet, i) => {
            const { label, style } = getStatusConfig(bet.status);
            const isWin = bet.payoff > 0;

            return (
              <tr
                key={i}
                className={cn(
                  "border-b last:border-0 transition",
                  "hover:bg-muted/40",
                  isWin && "bg-emerald-50/50"
                )}
              >
                <td className="px-4 py-3">
                  <div className="max-w-[220px] truncate font-medium">
                    {bet.displayDescription}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {formatDate(bet.place_time)}
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {formatDate(bet.settle_time)}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {bet.amount.toFixed(2)}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-mono font-medium",
                    isWin ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  {bet.payoff.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium border",
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