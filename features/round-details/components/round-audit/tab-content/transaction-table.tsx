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
      <div className="text-center py-10 text-muted-foreground text-sm italic border rounded-lg">
        No transaction data available.
      </div>
    );
  }

  const getActionStyle = (action: string) => {
    return action === "Settled"
      ? "bg-emerald-500/5 text-emerald-400 border-emerald-400/20"
      : "bg-blue-500/5 text-blue-400 border-blue-400/20";
  };

  return (
    <div className="overflow-x-auto border border-border/60 rounded-lg bg-background/40">
      <table className="w-full text-sm border-collapse">

        {/* HEADER */}
        <thead>
          <tr className="border-b border-border/50 bg-muted">
            <th className="px-4 py-2 text-xs font-medium text-left">Transaction</th>
            <th className="px-4 py-2 text-xs font-medium text-left">Action</th>
            <th className="px-4 py-2 text-xs font-medium text-left">3rd Party</th>
            <th className="px-4 py-2 text-xs font-medium text-left">Platform</th>
            <th className="px-4 py-2 text-xs font-medium text-right">Amount</th>
            <th className="px-4 py-2 text-xs font-medium text-center">Status</th>
            <th className="px-4 py-2 text-xs font-medium text-center">Retry</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {transactions.map((tx, i) => {
            const isError = !(tx.error_code === "0" || tx.error_code === null);
            const retryVal = tx.retry_counter || 0;
            const currency = tx.currency_code?.trim();

            return (
              <tr
                key={tx.transaction_id || i}
                className="border-b border-border/40 last:border-0 hover:bg-accent/20 transition-colors"
              >
                {/* TRANSACTION */}
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs text-foreground truncate max-w-56">
                      {tx.transaction_id}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formatDate(tx.trans_date)}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md border text-[11px] font-medium",
                      getActionStyle(tx.action_type)
                    )}
                  >
                    {tx.action_type}
                  </span>
                </td>

                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {tx.third_party_txn_id && tx.third_party_txn_id !== "null"
                    ? tx.third_party_txn_id
                    : "—"}
                </td>

                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {tx.platform_trans_id || "—"}
                </td>

                <td className="px-4 py-2 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm text-foreground">
                      {Number(tx.amount)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {currency}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-2 text-center">
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      isError ? "text-rose-400" : "text-emerald-400"
                    )}
                  >
                    {isError ? "Failed" : "Success"}
                    {isError && tx.error_description && ` (${tx.error_description})`}
                  </span>
                </td>

                {/* RETRY */}
                <td className="px-4 py-2 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-6 h-6 rounded-md text-[11px] font-mono border",
                      retryVal > 0
                        ? "bg-amber-500/5 text-amber-400 border-amber-400/20"
                        : "bg-muted/40 text-muted-foreground border-border"
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