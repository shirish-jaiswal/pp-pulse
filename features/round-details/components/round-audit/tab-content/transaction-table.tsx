import { cn } from "@/utils/cn";

export default function TransactionTable({ transactions }: { transactions: any[] }) {
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