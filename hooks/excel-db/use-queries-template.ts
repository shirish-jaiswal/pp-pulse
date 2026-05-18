import { queriesTemplateKeys } from "@/lib/excel-engine/excel-db-keys/kibana/queries-template";
import { getAllQueriesTemplate, QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/queries/get-all";
import { useQuery } from "@tanstack/react-query";

export function useQueriesTemplate() {
  return useQuery<QUERIES_TEMPLATE_TYPE[], Error>({
    queryKey: queriesTemplateKeys.list(),
    queryFn: () => getAllQueriesTemplate(),
    placeholderData: (previousData) => previousData,
    staleTime: 10000 * 60 * 60 * 24,
  });
}