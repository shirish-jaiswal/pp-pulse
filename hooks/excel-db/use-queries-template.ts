import { storedQueryKeys } from "@/lib/excel-engine/excel-db-keys/kibana/queries-template";
import { getAllStoredQueries, STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all"; // Updated path/imports
import { useQuery } from "@tanstack/react-query";

export function useAllStoredQueries() {
  return useQuery<STORED_QUERIES_TEMPLATE_TYPE[], Error>({
    queryKey: storedQueryKeys.list(),
    queryFn: () => getAllStoredQueries(),
    placeholderData: (previousData) => previousData,
    staleTime: 10000 * 60 * 60 * 24, 
  });
}