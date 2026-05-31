"use client";

import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date-utils";

export default function TransactionTable({
  transactions,
}: {
  transactions: TPTTableInfo | undefined;
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm border rounded-xl bg-muted/20">
        No transaction data available
      </div>
    );
  }

  const getActionStyle = (action: string) => {
    switch (action) {
      case "Settled":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Placed":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Cancelled":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Adjusted":
        return "bg-purple-50 text-purple-600 border-purple-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const isError = (tx: any) =>
    !(tx.error_code === "0" || tx.error_code === null);
  
  const getTime = (value: any) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string" && /^\d+$/.test(value)) {
      return Number(value);
    }
    const time = new Date(value).getTime();
    return isNaN(time) ? 0 : time;
  };

  /**
   * 1. Sort ascending first to resolve edge-case anomalies dynamically
   */
  const chronologicalTx = [...transactions].sort((a, b) => getTime(a.trans_date) - getTime(b.trans_date));

  // Build a mapped look-up for fixed historical boundary logs (e.g., SW zeroed metrics)
  const evaluatedTransactions = chronologicalTx.map((tx, idx) => {
    let before = Number(tx.balance_before) || 0;
    let after = Number(tx.balance_after) || 0;
    const amount = Number(tx.amount) || 0;

    // Edge case correction if both balances are passed as 0 on standard actions
    if (before === 0 && after === 0 && idx > 0) {
      const prevTx = chronologicalTx[idx - 1];
      const prevAfter = Number(prevTx.balance_after) || Number(prevTx.balance_before) || 0;
      
      before = prevAfter;
      if (tx.action_type === "Cancelled" || tx.action_type === "Settled") {
        after = prevAfter + amount;
      } else if (tx.action_type === "Placed") {
        after = prevAfter - amount;
      } else {
        after = prevAfter;
      }
    }

    return { ...tx, computedBefore: before, computedAfter: after };
  });

  /**
   * 2. Final display sorting: LATEST FIRST (HIGH → LOW)
   */
  const sortedTransactions = [...evaluatedTransactions].sort((a, b) => {
    return getTime(b.trans_date) - getTime(a.trans_date);
  });

  return (
    <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="bg-muted/50 border-b">
          <tr className="text-xs text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">Transaction</th>
            <th className="px-4 py-3 text-left font-medium">Action</th>
            <th className="px-4 py-3 text-left font-medium">3rd Party</th>
            <th className="px-4 py-3 text-left font-medium">Platform</th>
            <th className="px-4 py-3 text-right font-medium">Amount / Wallet Balance</th>
            <th className="px-4 py-3 text-center font-medium">Status</th>
            <th className="px-4 py-3 text-center font-medium">Retry</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {sortedTransactions.map((tx, i) => {
            const error = isError(tx);
            const retryVal = tx.retry_counter || 0;
            const currency = tx.currency_code?.trim() || "";

            return (
              <tr
                key={tx.transaction_id || i}
                className={cn(
                  "border-b last:border-0 transition",
                  "hover:bg-muted/30",
                  error && "bg-rose-50/30"
                )}
              >

                {/* TRANSACTION */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-medium truncate max-w-52">
                      {tx.transaction_id}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formatDate(tx.trans_date)}
                    </span>
                  </div>
                </td>

                {/* ACTION */}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium border",
                      getActionStyle(tx.action_type)
                    )}
                  >
                    {tx.action_type}
                  </span>
                </td>

                {/* THIRD PARTY */}
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {tx.third_party_txn_id &&
                  tx.third_party_txn_id !== "null"
                    ? tx.third_party_txn_id
                    : "—"}
                </td>

                {/* PLATFORM */}
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {tx.platform_trans_id || "—"}
                </td>

                {/* AMOUNT & WALLET LEDGER CHANGES */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="font-mono font-semibold text-sm">
                      {Number(tx.amount).toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">{currency}</span>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground bg-muted/40 border border-border/60 px-1.5 py-0.5 rounded flex items-center gap-1 mt-0.5">
                      <span className="text-muted-foreground/70">Prev:</span> 
                      <span className="font-medium text-foreground">{tx.computedBefore.toLocaleString()}</span>
                      <span className="text-muted-foreground/40 mx-0.5">→</span>
                      <span className="text-muted-foreground/70">Post:</span> 
                      <span className="font-medium text-foreground">{tx.computedAfter.toLocaleString()}</span>
                    </div>
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      error ? "text-rose-600" : "text-emerald-600"
                    )}
                  >
                    {error ? "Failed" : "Success"}
                  </span>

                  {error && tx.error_description && (
                    <div className="text-[10px] text-muted-foreground mt-1 max-w-35 truncate">
                      {tx.error_description}
                    </div>
                  )}
                </td>

                {/* RETRY */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-mono border",
                      retryVal > 0
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {retryVal}
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