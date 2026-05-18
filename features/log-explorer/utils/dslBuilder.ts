export interface QueryParams {
  searchQuery: string;
  timeRange: {
    gte: string;
    lte: string;
  };
  size?: number;
  from?: number;
}

export function buildElasticsearchDSL({ searchQuery, timeRange, size = 2000, from = 0 }: QueryParams) {
  // Gracefully fall back to match_all if user clears the search bar
  const queryClause = searchQuery.trim()
    ? {
        query_string: {
          query: searchQuery,
          analyze_wildcard: true,
        },
      }
    : {
        match_all: {},
      };

  return {
    size,
    from,
    track_total_hits: true,
    query: {
      bool: {
        must: [queryClause],
        filter: [
          {
            range: {
              "@timestamp": {
                gte: timeRange.gte,
                lte: timeRange.lte,
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
  };
}