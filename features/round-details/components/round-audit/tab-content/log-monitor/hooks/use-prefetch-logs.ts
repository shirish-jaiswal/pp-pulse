// @/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-transactionlogs.ts

import { useEffect } from "react";
import { useQueryClient, useQuery, UseQueryResult } from "@tanstack/react-query";
import { c_getTransactionLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { transactionLogsKeys } from "@/lib/query-key/transaction-logs";

// --- Prefetch Hook ---
export function usePrefetchTransactionLogs(params: TransactionLogsProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!params?.roundId || !params?.timeStamp) return;

    queryClient.prefetchQuery({
      queryKey: transactionLogsKeys.list(params), 
      queryFn: () => c_getTransactionLogs(params),
      staleTime: Infinity, // ✅ Treat prefetched data as fresh indefinitely
    });
  }, [params, queryClient]);
}
