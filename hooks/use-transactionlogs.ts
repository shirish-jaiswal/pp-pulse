import { c_getTransactionLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useTransactionLogs(
  params: TransactionLogsProps
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => c_getTransactionLogs(params),
    /** * How long the data remains "fresh" (doesn't need refetching).
     * Set to 5 minutes (5 * 60 * 1000) or adjust as needed.
     */
    staleTime: 1000 * 60 * 5,
    /** * How long unused data stays in memory before being garbage collected.
     * Default is 5 minutes; setting to 0 was deleting your cache instantly.
     */
    gcTime: 1000 * 60 * 10,
    /**
     * Prevents refetching every time the component re-mounts
     * if the data is still "fresh".
     */
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1
  });
}