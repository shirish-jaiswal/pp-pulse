import { kibanaRequest } from "@/lib/api/kibana-api-request";

export type KibanaSearchResponse = any;

export const searchLogs = async (query: string, filterQuery?: string) => {
  return kibanaRequest<KibanaSearchResponse>({
    method: "POST",
    endpoint: "filebeat-*/_search",
    data: {
      size: 2000,
      track_total_hits: true,
      query: {
        bool: {
          must: [
            {
              query_string: {
                query,
                analyze_wildcard: true,
              },
            },
          ],
          filter: [
            {
              range: {
                "@timestamp": {
                  gte: "now-1d/d",
                  lte: "now",
                },
              },
            },
          ],
        },
      },
      sort: [
        {
          "@timestamp": {
            order: "desc",
          },
        },
      ],
    },
  });
};