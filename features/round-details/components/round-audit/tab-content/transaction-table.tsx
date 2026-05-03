"use client";

import { TPTTableInfo } from "@/features/round-details/types/tpt-table-info";
import { cn } from "@/utils/cn";

export const formatDate = (dateStr: string | Date) => {
  const date = new Date(dateStr);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const parts = timeFormatter.formatToParts(date);
  const datePart = date.toLocaleDateString("en-US");
  const ms = date.getMilliseconds().toString().padStart(3, "0");

  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;
  const second = parts.find((p) => p.type === "second")?.value;
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value;

  return `${datePart}, ${hour}:${minute}:${second}.${ms} ${dayPeriod}`;
};

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
    return action === "Settled"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : "bg-blue-50 text-blue-600 border-blue-200";
  };

  const isError = (tx: any) =>
    !(tx.error_code === "0" || tx.error_code === null);

  /**
   * ✅ UNIVERSAL SAFE DATETIME PARSER
   */
  const getTime = (value: any) => {
    if (!value) return 0;

    // epoch number
    if (typeof value === "number") return value;

    // numeric string epoch
    if (typeof value === "string" && /^\d+$/.test(value)) {
      return Number(value);
    }

    // ISO / normal date string fallback
    const time = new Date(value).getTime();

    return isNaN(time) ? 0 : time;
  };

  /**
   * ✅ SORTING: LATEST FIRST (HIGH → LOW)
   */
  const sortedTransactions = [...transactions].sort((a, b) => {
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
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 text-center font-medium">Status</th>
            <th className="px-4 py-3 text-center font-medium">Retry</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {sortedTransactions.map((tx, i) => {
            const error = isError(tx);
            const retryVal = tx.retry_counter || 0;
            const currency = tx.currency_code?.trim();

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

                {/* AMOUNT */}
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-semibold">
                      {Number(tx.amount).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {currency}
                    </span>
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