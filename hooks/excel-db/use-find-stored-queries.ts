import { storedQueryKeys } from "@/lib/excel-engine/excel-db-keys/kibana/queries-template";
import { findStoredQueries } from "@/lib/excel-engine/kibana/stored-queries/find-query";
import { STORED_QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/stored-queries/get-all";
import { useQuery } from "@tanstack/react-query";

interface UseFindStoredQueriesProps {
  keywords: string[];
  enabled?: boolean;
}

export function useFindStoredQueries({ keywords, enabled = true }: UseFindStoredQueriesProps) {
  return useQuery<STORED_QUERIES_TEMPLATE_TYPE[], Error>({
    queryKey: storedQueryKeys.list({ keywords }),
    
    queryFn: async () => {
      const response = await findStoredQueries(keywords);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to find stored queries.");
      }
      
      return response.data;
    },
    
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, 
    enabled: enabled && keywords.length > 0,
  });
}