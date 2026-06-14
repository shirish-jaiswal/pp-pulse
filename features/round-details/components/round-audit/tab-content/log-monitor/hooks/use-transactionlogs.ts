// @/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-transactionlogs.ts
import { useQuery } from "@tanstack/react-query";
import { fetchTransactionLogs, fetchGameLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";

export function useIsolatedLogs(params: TransactionLogsProps) {
  // 🛑 Extremely strict validation: Do NOT enable queries if properties are missing
  const isDataAvailable = Boolean(
    params?.roundId && 
    params?.timeStamp && 
    params?.game_id && 
    params?.user_id &&
    params?.game_type
  );

  const txnQuery = useQuery({
    // Explicitly use stable primitive values inside the query key array
    queryKey: [
      "transaction-logs", 
      String(params?.roundId), 
      String(params?.timeStamp), 
      "transaction-platform-segment"
    ],
    queryFn: () => fetchTransactionLogs(params),
    enabled: isDataAvailable, // Holds off securely until fully loaded
    staleTime: Infinity, 
    gcTime: Infinity,   
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 4,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
  });

  const gameQuery = useQuery({
    // Explicitly use stable primitive values inside the query key array
    queryKey: [
      "transaction-logs", 
      String(params?.roundId), 
      String(params?.timeStamp), 
      "game-segment"
    ],
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