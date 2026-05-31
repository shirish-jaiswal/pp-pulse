import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { c_getTransactionLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { transactionLogsKeys } from "@/lib/query-key/transaction-logs";

// --- Fetch Hook ---
export function useTransactionLogs(
  params: TransactionLogsProps
): UseQueryResult<any, Error> {
  const isDataAvailable = Boolean(params?.roundId && params?.timeStamp);

  return useQuery({
    queryKey: transactionLogsKeys.list(params), 
    queryFn: () => c_getTransactionLogs(params),

    enabled: isDataAvailable,
    staleTime: Infinity,  // ✅ Never consider data stale automatically
    gcTime: Infinity,     // ✅ Never garbage collect while app is running
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1
  });
}