// @/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-transactionlogs.ts

import { useQuery } from "@tanstack/react-query";
import { fetchTransactionLogs, fetchGameLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { transactionLogsKeys } from "@/lib/query-key/transaction-logs";

export function useIsolatedLogs(params: TransactionLogsProps) {
  const isDataAvailable = Boolean(params?.roundId && params?.timeStamp);

  // Isolated Query Instance for Transaction and Platform logs
  const txnQuery = useQuery({
    queryKey: [...transactionLogsKeys.list(params), "transaction-platform-segment"],
    queryFn: () => fetchTransactionLogs(params),
    enabled: isDataAvailable,
    staleTime: Infinity, 
    gcTime: Infinity,   
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1
  });

  // Isolated Query Instance for Game Logs
  const gameQuery = useQuery({
    queryKey: [...transactionLogsKeys.list(params), "game-segment"],
    queryFn: () => fetchGameLogs(params),
    enabled: isDataAvailable,
    staleTime: Infinity, 
    gcTime: Infinity,   
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1
  });

  return {
    txnQuery,
    gameQuery,
  };
}