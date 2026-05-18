import { queriesTemplateKeys } from "@/lib/excel-engine/excel-db-keys/kibana/queries-template";
import { getAllQueriesTemplate, QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/queries/get-all";
import { useQuery } from "@tanstack/react-query";

const CACHE_KEY = "queries_template_cache";
const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;

interface CachedData {
  data: QUERIES_TEMPLATE_TYPE[];
  timestamp: number;
}

// Pass the dynamic game name into the hook
export function useQueriesTemplate(gameName?: string) {
  return useQuery<QUERIES_TEMPLATE_TYPE[], Error>({
    // 1. Add gameName to the queryKey so React Query tracks it as a dependency
    queryKey: [...queriesTemplateKeys.list(), gameName],

    queryFn: async () => {
      let allTemplates: QUERIES_TEMPLATE_TYPE[] = [];

      // 2. Attempt to pull the master list from localStorage first
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

      // 3. Fetch fresh templates from the server if cache is empty/expired
      if (allTemplates.length === 0) {
        allTemplates = await getAllQueriesTemplate();

        // Save the raw, complete database response to localStorage
        if (typeof window !== "undefined" && allTemplates.length > 0) {
          const cachePayload: CachedData = {
            data: allTemplates,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        }
      }

      // 4. Return all data if no specific game filter is requested
      if (!gameName) {
        return allTemplates;
      }

      // 5. Filter the templates where your game identity criteria matches
      // Adjust 'template.game' or 'template.game_name' to match your actual data model structure
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