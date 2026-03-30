import { LogRequestParams } from '@/lib/server/kibana/search';
import { EsDslNode, EsResponse, MatchPhraseQuery } from '@/types/kibana';
import axios from 'axios';
import { es } from 'date-fns/locale';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookie = searchParams.get('cookie') || '';
    const KIBANA_DOMAIN = process.env.KIBANA_LIVE_URL;

    const rawBody: LogRequestParams = await request.json();

    const kibanaPayload = convertToPayloadNew(rawBody);

    const headers = {
      "Cookie": cookie,
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "User-Agent": "Mozilla/5.0",
      "kbn-xsrf": "true",
      "elastic-api-version": "1"
    };

    console.log("KIBANA PAYLOAD :: ", JSON.stringify(kibanaPayload));
    const response = await axios.post(
      `${KIBANA_DOMAIN}`,
      kibanaPayload,
      { headers }
    );

    const esData = response.data.rawResponse;
    const hits = esData.hits.hits;
    const hasMore = hits.length === (rawBody.size || 500);
    const esResponse: EsResponse = {
      took: esData.took,
      timed_out: esData.timed_out,
      logs: esData.hits.hits,
      total: esData.hits.total,
      loaded: esData.hits.hits.length,
      nextSearchAfter: hasMore ? getNextPageToken(esData) : null
    }
    return NextResponse.json({
      message: "Success", data: esResponse
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Internal Server Error" },
      { status: error.response?.status || 500 }
    );
  }
}

function parseToDsl(query: string): EsDslNode {
  if (!query || query.trim() === "*" || query.trim() === "") {
    return { match_all: {} };
  }

  const tokens = query.match(/\(|\)|AND|OR|NOT|[^\s()]+/gi) || [];
  let cursor = 0;

  function walk(): EsDslNode {
    let left: EsDslNode | null = null;

    while (cursor < tokens.length) {
      const token = tokens[cursor++];

      if (token === "(") {
        const node = walk();
        left = left ? { bool: { filter: [left, node] } } : node;
      } else if (token === ")") {
        break;
      } else if (token.toUpperCase() === "OR") {
        const right = walk(); // ✅ recurse for right side
        return { bool: { should: [left!, right], minimum_should_match: 1 } };
      } else if (token.toUpperCase() === "AND") {
        continue; // ✅ AND is default, just keep walking
      } else if (token.toUpperCase() === "NOT") {
        const next = walk();
        const notNode = { bool: { must_not: [next] } };
        left = left ? { bool: { filter: [left, notNode] } } : notNode;
      } else {
        const node: EsDslNode = { multi_match: { query: token, lenient: true } };
        left = left ? { bool: { filter: [left, node] } } : node;
      }
    }

    return left ?? { match_all: {} };
  }

  return walk();
}

export const convertToPayloadNew = (params: LogRequestParams) => {
  const dslLogic = parseToDsl(params.query);

  const positiveFilters: EsDslNode[] = [];
  const negativeFilters: EsDslNode[] = [];

  (params.matchPhrase || []).forEach(p => {
    if (p.isDisabled) return;

    const phrase: MatchPhraseQuery = {
      match_phrase: { [p.key]: p.value }
    };

    if (p.isPositive) {
      positiveFilters.push({
        bool: {
          must: [],
          filter: [phrase],
          should: [],
          must_not: []
        }
      });
    } else {
      negativeFilters.push(phrase);
    }
  });

  const shouldBlock =
    positiveFilters.length > 0
      ? {
        bool: {
          should: positiveFilters,
          minimum_should_match: 1
        }
      }
      : null;

  return {
    params: {
      index: params.index,
      body: {
        size: params.size ?? 10000,
        track_total_hits: params.trackTotalHits ?? true,
        search_after: params.searchAfter,
        query: {
          bool: {
            filter: [
              {
                range: {
                  "@timestamp": {
                    gte: params.startDate,
                    lte: params.endDate,
                    format: "strict_date_optional_time"
                  }
                }
              },
              ...(shouldBlock ? [shouldBlock] : []),
              ...(dslLogic ? [dslLogic] : [])
            ],
            must_not: negativeFilters
          }
        },
        sort: [
          { "@timestamp": { order: params.sort, unmapped_type: "boolean" } },
          { _doc: { order: "asc" } }
        ],
        _source: params.fields || ["message", "@timestamp", "log.level"],
        highlight: {
          pre_tags: ["<mark>"],
          post_tags: ["</mark>"],
          fields: { "*": {} },
          fragment_size: 2147483647
        }
      }
    }
  };
};

export const getNextPageToken = (esResponse: any): (string | number)[] | null => {
  const hits = esResponse?.hits?.hits;
  if (!hits || hits.length === 0) return null;
  return hits[hits.length - 1].sort;
};