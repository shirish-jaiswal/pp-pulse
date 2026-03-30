import { cn } from "@/utils/cn";

export function DataList({ items, type }: { items?: any[], type: 'money' | 'standard' }) {
  return (
    <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar shadow-2xl">
      {items?.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background/50 text-sm hover:bg-accent/50 transition-colors">
          <span className="font-medium">{item.label}</span>
          <span className={cn("font-mono font-bold", type === 'money' ? "text-emerald-500" : "text-primary")}>
            {type === 'money' ? `+$${item.value}` : item.value}
          </span>
        </div>
      ))}
      {items?.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm italic">
          No data available for this section.
        </div>
      )}
    </div>
  );
}

export function LogTerminal({ logs }: { logs?: any[] }) {
  return (
    <div className="rounded-lg bg-zinc-950 p-2 font-mono text-xs text-zinc-400 border border-zinc-800 shadow-inner h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500 sticky top-0 bg-zinc-950 pb-2 border-b border-zinc-900">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        LIVE_KIBANA_FEED
      </div>
      {logs?.map((log, i) => (
        <div key={i} className="mb-1 flex gap-3 border-b border-zinc-900/40 pb-1.5 last:border-0 hover:bg-zinc-900/30 transition-colors">
          <span className="text-zinc-600 shrink-0 font-light">
            [{new Date().toLocaleTimeString([], { hour12: false })}]
          </span>
          <span className="text-blue-500 shrink-0 font-bold tracking-tighter">PULSE</span>
          <span className="truncate hover:text-zinc-200 cursor-default">
            {JSON.stringify(log)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BetTable({ items }: { items?: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm italic">
        No bet data available.
      </div>
    );
  }

  // Color mapping for statuses
  const statusStyles: Record<string, string> = {
    settled: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    unsettled: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <div className="overflow-x-auto border rounded-lg bg-background/50 shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="p-3 font-bold uppercase text-xs tracking-wider">Bet Details</th>
            <th className="p-3 font-bold uppercase text-xs tracking-wider">Initiated</th>
            <th className="p-3 font-bold uppercase text-xs tracking-wider text-right">Amount</th>
            <th className="p-3 font-bold uppercase text-xs tracking-wider text-right">Win</th>
            <th className="p-3 font-bold uppercase text-xs tracking-wider text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((bet, i) => {
            const statusKey = bet.betStatus?.toLowerCase() || "unsettled";
            const isSettled = statusKey === "settled";

            return (
              <tr key={i} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                <td className="p-3 font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span className="truncate max-w-52">{bet.betCode}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {isSettled ? `Settled: ${bet.settlementTime}` : "Awaiting Settlement"}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                  {bet.betInitiatedOn}
                </td>
                <td className="p-3 text-right font-mono font-bold text-primary">
                  ${parseFloat(bet.betAmount).toFixed(2)}
                </td>
                <td className={cn(
                  "p-3 text-right font-mono font-bold",
                  parseFloat(bet.winAmount) > 0 ? "text-emerald-500" : "text-muted-foreground"
                )}>
                  ${parseFloat(bet.winAmount).toFixed(2)}
                </td>
                <td className="p-3 text-center">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-tighter transition-all",
                    statusStyles[statusKey] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                  )}>
                    {bet.betStatus}
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

export function TransactionTable({ transactions }: { transactions: any[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="w-[16%] p-2 text-xs font-bold uppercase tracking-widest text-slate-500">Transaction ID</th>
            <th className="w-[12%] p-2 text-xs font-bold uppercase tracking-widest text-slate-500">Type</th>
            <th className="w-[15%] p-2 text-xs font-bold uppercase tracking-widest text-slate-500">Operator Ref</th>
            <th className="w-[20%] p-2 text-xs font-bold uppercase tracking-widest text-slate-500">Slot Trace (PP)</th>
            <th className="w-[12%] p-2 text-xs font-bold uppercase tracking-widest text-right text-slate-500">Amount</th>
            <th className="w-[15%] p-2 text-xs font-bold uppercase tracking-widest text-center text-slate-500">Status & Error</th>
            <th className="w-[10%] p-2 text-xs font-bold uppercase tracking-widest text-center text-slate-500">Retry</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((tx, i) => {
            const isError = tx.error !== "0(Ok)" && tx.error !== "No Error";
            const isSettled = tx.transType === "Bet Settled";
            const retryVal = parseInt(tx.retryCount || "0");

            return (
              <tr key={i} className="group hover:bg-blue-50/40 transition-colors duration-150 text-slate-600">
                {/* 1. TRANSACTION ID */}
                <td className="p-2 align-top">
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-mono text-xs font-bold">
                      {tx.transId}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {tx.transDate}
                    </span>
                  </div>
                </td>

                {/* 2. TYPE */}
                <td className="p-2 align-top">
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs font-bold uppercase border",
                    isSettled
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-blue-50 text-blue-600 border-blue-200"
                  )}>
                    {tx.transType}
                  </span>
                </td>

                {/* 3. OPERATOR REF */}
                <td className="p-2 align-top">
                  <span className="font-mono text-xs break-all leading-tight">
                    {tx.operatorTransId !== "null" ? tx.operatorTransId : "—"}
                  </span>
                </td>

                {/* 4. SLOT TRACE */}
                <td className="p-2 align-top">
                  <span className="font-mono text-xs text-slate-500 break-all leading-relaxed whitespace-pre-line">
                    {tx.ppSlotsTransId !== "null"
                      ? tx.ppSlotsTransId
                      : "—"}
                  </span>
                </td>

                {/* 6. AMOUNT */}
                <td className="p-2 align-top text-right">
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-sm font-mono font-bold tracking-tight text-slate-900"
                    )}>
                      {parseFloat(tx.transAmt).toFixed(2)}
                    </span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                      {tx.transCur}
                    </span>
                  </div>
                </td>

                {/* 7. STATUS & ERROR */}
                <td className="p-2 align-top">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        tx.transStatus === "Success" ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {tx.transStatus}
                      </span>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded border text-xs font-mono w-full text-center truncate max-w-24",
                      isError
                        ? "bg-rose-50 border-rose-200 text-rose-500 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    )}>
                      {tx.error}
                    </span>
                  </div>
                </td>

                {/* 5. RETRY COUNT (NEW) */}
                <td className="p-2 align-top text-center">
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-6 h-6 rounded-full font-mono text-xs font-bold border",
                    retryVal > 0
                      ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                  )}>
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