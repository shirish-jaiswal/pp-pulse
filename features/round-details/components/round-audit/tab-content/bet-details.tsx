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

  // ✅ Computed values for sorting and footer totals
  const { sortedItems, totalAmount, totalPayoff, netProfit } = useMemo(() => {
    if (!items || items.length === 0) {
      return { sortedItems: [], totalAmount: 0, totalPayoff: 0, netProfit: 0 };
    }

    // 1. Calculate totals from the raw items
    const totals = items.reduce(
      (acc, curr) => {
        acc.amount += curr.amount || 0;
        acc.payoff += curr.payoff || 0;
        return acc;
      },
      { amount: 0, payoff: 0 }
    );

    // 2. Sort items
    const sorted = [...items].sort((a, b) => {
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

    return {
      sortedItems: sorted,
      totalAmount: totals.amount,
      totalPayoff: totals.payoff,
      netProfit: totals.payoff - totals.amount,
    };
  }, [items, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

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
        <tfoot className="bg-muted/30 border-t font-medium text-xs">
          <tr>
            <td colSpan={3} className="px-4 py-3 text-left font-semibold text-muted-foreground">
              Totals
              <span className={cn(
                "ml-2 text-[11px] px-1.5 py-0.5 rounded",
                netProfit >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              )}>
                {netProfit >= 0 ? "+" : ""}{netProfit.toFixed(2)} P&L
              </span>
            </td>
            <td className="px-4 py-3 text-right font-mono text-foreground">
              {totalAmount.toFixed(2)}
            </td>
            <td className="px-4 py-3 text-right font-mono text-emerald-600">
              {totalPayoff.toFixed(2)}
            </td>
            <td className="px-4 py-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}