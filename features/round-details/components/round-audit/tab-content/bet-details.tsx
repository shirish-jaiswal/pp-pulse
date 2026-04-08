import { cn } from "@/utils/cn";

export default function BetTable({ items }: { items?: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm italic">
        No bet data available.
      </div>
    );
  }

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