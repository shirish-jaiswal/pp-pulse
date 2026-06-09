import { useQuery } from "@tanstack/react-query";
import { fetchTransactionLogs, fetchGameLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { transactionLogsKeys } from "@/lib/query-key/transaction-logs";

export function useIsolatedLogs(params: TransactionLogsProps) {
  const isDataAvailable = Boolean(params?.roundId && params?.timeStamp);

  const txnQuery = useQuery({
    queryKey: [...transactionLogsKeys.list(params), "transaction-platform-segment"],
    queryFn: () => fetchTransactionLogs(params),
    enabled: isDataAvailable,
    staleTime: Infinity, 
    gcTime: Infinity,   
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 4,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
  });

  const gameQuery = useQuery({
    queryKey: [...transactionLogsKeys.list(params), "game-segment"],
    queryFn: () => fetchGameLogs(params),
    enabled: isDataAvailable,
    staleTime: Infinity, 
    gcTime: Infinity,   
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 4,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return { txnQuery, gameQuery };
}