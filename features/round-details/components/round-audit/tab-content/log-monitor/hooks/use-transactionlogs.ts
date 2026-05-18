import { c_getTransactionLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useTransactionLogs(
  params: TransactionLogsProps
): UseQueryResult<any, Error> {

  // Check if the required parameters exist before fetching
  // Adjust this condition based on what makes your params "valid" (e.g., params?.roundId)
  const isDataAvailable = Boolean(params && Object.keys(params).length > 0);

  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => c_getTransactionLogs(params),

    // The query will not execute as long as this evaluates to false
    enabled: isDataAvailable,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1
  });
}