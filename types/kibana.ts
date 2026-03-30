/**
 * Generic Elasticsearch Search Response
 */
export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: 'eq' | 'gte';
    } | number;
    max_score: number | null;
    hits: SearchHit<T>[];
  };
}

/**
 * Single Search Hit
 */
export interface SearchHit<T> {
  _index: string;
  _id: string;
  _score: number | null;
  _source: T;
  sort?: (string | number)[];
}

export type EsSortValue = string | number | boolean;

// Elasticsearch query structures
export interface MultiMatchQuery {
  multi_match: {
    query: string;
    lenient: boolean;
  };
}

export interface MatchPhraseQuery {
  match_phrase: {
    [key: string]: string;
  };
}

export interface RangeQuery {
  range: {
    [field: string]: {
      gte: string;
      lte: string;
      format?: string;
    };
  };
}

export interface BoolQuery {
  bool: {
    must?: EsDslNode[];
    filter?: EsDslNode[];
    should?: EsDslNode[];
    must_not?: EsDslNode[];
    minimum_should_match?: number;
  };
}

export type EsDslNode = BoolQuery | MultiMatchQuery | MatchPhraseQuery | RangeQuery | { match_all: {} };

// Elasticsearch Response structure
export interface EsHit {
  _index: string;
  _id: string;
  _source: Record<string, unknown>;
  sort: (string | number)[];
  highlight?: Record<string, string[]>;
}

export interface EsResponse {
  took: number;
  timed_out: boolean;
  logs: EsHit[]; 
  total: string;
  loaded: number;
  nextSearchAfter: (string | number)[] | null;
};