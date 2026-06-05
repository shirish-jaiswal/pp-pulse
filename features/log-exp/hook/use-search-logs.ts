import { kibanaRequest } from "@/lib/api/kibana-api-request";

export type KibanaSearchResponse = any;

interface MatchPhraseData {
  searchString: string;
  query: any;
  dataView: string;
  timeRange: {
    from: string;
    to: string;
    label?: string;
  };
  sortOrder: "asc" | "desc";
  searchAfter?: any[];
}

const buildTimeRangeFilter = (timeRange: MatchPhraseData["timeRange"]) => {
  return {
    range: {
      "@timestamp": {
        gte: timeRange.from,
        lte: timeRange.to,
      },
    },
  };
};

const buildMustQueries = (data: MatchPhraseData) => {
  const must: any[] = [];

  // 1. Process the lucene/text bar input string
  if (data.searchString) {
    must.push({
      query_string: {
        query: data.searchString,
        analyze_wildcard: true,
      },
    });
  }

  // 2. Safely merge your visual query builder's DSL filter payload
  if (data.query && Object.keys(data.query).length > 0) {
    must.push(data.query);
  }

  return must;
};

const buildQuery = (data: MatchPhraseData) => {
  const timeFilter = buildTimeRangeFilter(data.timeRange);
  const mustQueries = buildMustQueries(data);

  if (mustQueries.length === 0) {
    return {
      bool: {
        filter: [timeFilter],
      },
    };
  }

  return {
    bool: {
      must: mustQueries,
      filter: [timeFilter],
    },
  };
};

const buildRequestPayload = (data: MatchPhraseData) => {
  const payload: any = {
    size: 200,
    track_total_hits: true,
    query: buildQuery(data),
    sort: [
      {
        "@timestamp": {
          order: data.sortOrder,
        },
      },
      {
        _doc: {
          order: "asc",
        },
      },
    ],
  };

  if (data.searchAfter && data.searchAfter.length > 0) {
    payload.search_after = data.searchAfter;
  }

  return payload;
};

const calculateOptimalInterval = (
  fromStr: string,
  toStr: string
): {
  key: "fixed_interval" | "calendar_interval";
  value: string;
} => {
  const fromMs = new Date(fromStr).getTime();
  const toMs = new Date(toStr).getTime();
  const deltaMs = Math.abs(toMs - fromMs);

  const ONE_SECOND = 1000;
  const ONE_MINUTE = 60 * ONE_SECOND;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;

  if (deltaMs <= 5 * ONE_MINUTE) return { key: "fixed_interval", value: "1s" };
  if (deltaMs <= 15 * ONE_MINUTE) return { key: "fixed_interval", value: "10s" };
  if (deltaMs <= ONE_HOUR) return { key: "fixed_interval", value: "1m" };
  if (deltaMs <= 4 * ONE_HOUR) return { key: "fixed_interval", value: "5m" };
  if (deltaMs <= 12 * ONE_HOUR) return { key: "fixed_interval", value: "15m" };
  if (deltaMs <= ONE_DAY) return { key: "fixed_interval", value: "30m" };
  if (deltaMs <= 3 * ONE_DAY) return { key: "fixed_interval", value: "1h" };
  if (deltaMs <= 7 * ONE_DAY) return { key: "fixed_interval", value: "3h" };
  if (deltaMs <= 30 * ONE_DAY) return { key: "fixed_interval", value: "12h" };
  if (deltaMs <= 90 * ONE_DAY) return { key: "calendar_interval", value: "1d" };

  return { key: "calendar_interval", value: "1w" };
};

/**
 * SEARCH LOGS
 */
export const searchLogs = async (data: MatchPhraseData) => {
  const requestPayload = buildRequestPayload(data);

  return kibanaRequest<KibanaSearchResponse>({
    method: "POST",
    endpoint: `${data.dataView}/_search`,
    data: requestPayload,
  });
};

/**
 * SEARCH HISTOGRAM
 */
export const searchHistogram = async (data: MatchPhraseData) => {
  const { key: intervalKey, value: intervalValue } = calculateOptimalInterval(
    data.timeRange.from,
    data.timeRange.to
  );

  const histogramPayload = {
    size: 0,
    track_total_hits: true,
    query: buildQuery(data),
    aggs: {
      log_distribution: {
        date_histogram: {
          field: "@timestamp",
          [intervalKey]: intervalValue,
          min_doc_count: 0,
          extended_bounds: {
            min: data.timeRange.from,
            max: data.timeRange.to,
          },
        },
      },
    },
  };

  
  return kibanaRequest<any>({
    method: "POST",
    endpoint: `${data.dataView}/_search`,
    data: histogramPayload,
  });
};