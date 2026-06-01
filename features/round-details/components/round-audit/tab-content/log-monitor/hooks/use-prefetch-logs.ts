// @/features/round-details/components/round-audit/tab-content/log-monitor/hooks/usePrefetchTransactionLogs.ts

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchTransactionLogs, fetchGameLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { transactionLogsKeys } from "@/lib/query-key/transaction-logs";

export function usePrefetchTransactionLogs(params: TransactionLogsProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!params?.roundId || !params?.timeStamp) return;

    const baseKey = transactionLogsKeys.list(params);

    // Prefetch Transaction and Platform logs segment cache
    queryClient.prefetchQuery({
      queryKey: [...baseKey, "transaction-platform-segment"], 
      queryFn: () => fetchTransactionLogs(params),
      staleTime: Infinity,
    });

    // Prefetch Game logs segment cache
    queryClient.prefetchQuery({
      queryKey: [...baseKey, "game-segment"], 
      queryFn: () => fetchGameLogs(params),
      staleTime: Infinity,
    });
  }, [params, queryClient]);
}