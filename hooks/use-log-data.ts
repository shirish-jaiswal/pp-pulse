import { c_getKibanaLogs, LogRequestParams } from "@/lib/server/kibana/search";
import { EsResponse } from "@/types/kibana";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useLogData(
  params: LogRequestParams
): UseQueryResult<EsResponse, Error> {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => c_getKibanaLogs(params),
    enabled: params != null,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}