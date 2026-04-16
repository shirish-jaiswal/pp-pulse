import { c_getTransactionLogs, TransactionLogsProps } from "@/lib/api/round-details/transaction-logs";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useTransactionLogs(
  params: TransactionLogsProps
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => c_getTransactionLogs(params),
    enabled: params != null,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}