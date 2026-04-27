import { Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Transaction {
  txnType: string;
  txnStatus: string;
  errorCode: string;
  ppLiveTxnId: string;
  operatorTxnId?: string | null;
  txnCurrency: string;
  txnAmount: string;
  txnDate: string;
  retryCount: string | number;
}

interface TransactionLedgerProps {
  settlements: Transaction[];
}

export function TransactionLedger({ settlements }: TransactionLedgerProps) {
  return (
    <Card className="border-none shadow-md ring-1 ring-border overflow-hidden p-0 gap-0">
      <CardHeader className="py-2 px-4 bg-slate-100">
        <CardTitle className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
          <Terminal className="h-3 w-3" /> Transactional Ledger Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/20">
            <TableRow className="h-8 hover:bg-transparent">
              <TableHead className="text-[9px] uppercase font-bold">Type/Status</TableHead>
              <TableHead className="text-[9px] uppercase font-bold">Transaction IDs</TableHead>
              <TableHead className="text-[9px] uppercase font-bold">Amount/Cur</TableHead>
              <TableHead className="text-right text-[9px] uppercase font-bold">Date & Retry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.map((txn, i) => {
              const isSuccess = txn.txnStatus.toLowerCase() === "success";
              
              return (
                <TableRow key={i} className="text-[10px] font-mono hover:bg-slate-50/80 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900 leading-none">{txn.txnType}</span>
                      <span className={`text-[9px] font-semibold ${isSuccess ? "text-emerald-600" : "text-red-500"}`}>
                        {txn.txnStatus.toUpperCase()} {txn.errorCode !== "Ok" && `(${txn.errorCode})`}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-0.5 opacity-80">
                      <div className="flex gap-1">
                        <span className="text-slate-400">PP:</span>
                        <span className="text-slate-700">{txn.ppLiveTxnId}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-slate-400">OP:</span>
                        <span className="text-slate-700 truncate max-w-[100px]">
                          {txn.operatorTxnId || "N/A"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-bold text-slate-900 bg-slate-100/50 px-1.5 py-0.5 rounded w-fit">
                      {txn.txnCurrency} {txn.txnAmount}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-600 leading-none">
                        {txn.txnDate}
                      </span>
                      <span className={`text-[9px] italic font-medium ${Number(txn.retryCount) > 0 ? "text-orange-500" : "text-slate-400"}`}>
                        Retries: {txn.retryCount}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}