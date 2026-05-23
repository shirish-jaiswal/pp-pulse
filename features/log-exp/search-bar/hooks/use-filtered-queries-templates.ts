import { queriesTemplateKeys } from "@/lib/excel-engine/excel-db-keys/kibana/queries-template";
import { getAllQueriesTemplate, QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/queries/get-all";
import { useQuery } from "@tanstack/react-query";

const CACHE_KEY = "queries_template_cache";
const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;

interface CachedData {
  data: QUERIES_TEMPLATE_TYPE[];
  timestamp: number;
}

export function useFilteredQueriesTemplates(gameName?: string) {
  return useQuery<QUERIES_TEMPLATE_TYPE[], Error>({
    queryKey: [...queriesTemplateKeys.list(), gameName],

    queryFn: async () => {
      let allTemplates: QUERIES_TEMPLATE_TYPE[] = [];

      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed: CachedData = JSON.parse(cached);
            const isExpired = Date.now() - parsed.timestamp > TWELVE_HOURS_IN_MS;
            if (!isExpired) {
              allTemplates = parsed.data;
            }
          } catch (e) {
            console.error("Error parsing cached queries template", e);
          }
        }
      }

      if (allTemplates.length === 0) {
        allTemplates = await getAllQueriesTemplate();

        if (typeof window !== "undefined" && allTemplates.length > 0) {
          const cachePayload: CachedData = {
            data: allTemplates,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        }
      }

      if (!gameName) {
        return allTemplates;
      }

      return allTemplates.filter((template: any) =>
        String(template.game || template.gameName || "")
          .trim()
          .toLowerCase() === gameName.trim().toLowerCase()
      );
    },
    placeholderData: (previousData) => previousData,
    staleTime: TWELVE_HOURS_IN_MS,
  });
}