"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
} from "react";

import {
  searchLogs,
  searchHistogram,
} from "@/features/log-exp/hook/use-search-logs";

import { useKibanaFormStore } from "@/features/log-exp/context/kibana-form-context";
import { extractUniqueFields } from "@/features/log-exp/display-logs/utils/field-parser";

interface KibanaResponseContextType {
  isLoading: boolean;
  isPaginationLoading: boolean;
  searchError: string | null;
  searchResults: any;
  documents: any[];
  hasMore: boolean;
  histogramData: any;
  availableFields: string[];
  selectedFields: string[];
  fetchLogs: (initialLoad?: boolean) => Promise<void>;
  fetchMoreLogs: () => Promise<void>;
  toggleFieldSelection: (fieldName: string) => void;
  setSelectedFields: (fields: string[]) => void;
  clearResults: () => void;
}

const KibanaResponseContext = createContext<KibanaResponseContextType | undefined>(undefined);

/**
 * Format date strings to comply with Kibana's expected timezones
 */
const formatTZDate = (date?: Date) => {
  if (!date) return "";

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate()
  ).padStart(2, "0")}T${String(date.getUTCHours()).padStart(2, "0")}:${String(
    date.getUTCMinutes()
  ).padStart(2, "0")}:${String(date.getUTCSeconds()).padStart(2, "0")}.${String(
    date.getUTCMilliseconds()
  ).padStart(3, "0")}+00:00`;
};

/**
 * Validates Lucene syntax structures like balancing pairs of quotes or brackets
 */
const validateKibanaSyntax = (searchString: string): { isValid: boolean; error: string | null } => {
  if (!searchString) return { isValid: true, error: null };

  // 1. Check for unclosed double quotes
  const quoteCount = (searchString.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    return { isValid: false, error: "Syntax Error: Found an unclosed double quote (\")." };
  }

  // 2. Check for balanced parentheses
  let openParentheses = 0;
  for (let i = 0; i < searchString.length; i++) {
    if (searchString[i] === '(') openParentheses++;
    if (searchString[i] === ')') openParentheses--;
    if (openParentheses < 0) {
      return { isValid: false, error: "Syntax Error: Unmatched closing parenthesis ')' without a matching '('." };
    }
  }
  if (openParentheses > 0) {
    return { isValid: false, error: "Syntax Error: Unclosed parenthesis '(' remaining." };
  }

  return { isValid: true, error: null };
};

/**
 * Capitalizes Lucene operators (and, or, not, to) ONLY if they sit outside double quotes
 */
const normalizeKibanaOperators = (searchString: string): string => {
  if (!searchString) return "";

  // Captures: group 1 (quoted strings), group 2 (unquoted single terms), group 3 (whitespace)
  const tokenRegex = /("[^"\\]*(?:\\.[^"\\]*)*")|([^\s"]+)|(\s+)/g;
  let match;
  let processedString = "";

  const operatorMap: Record<string, string> = {
    and: "AND",
    or: "OR",
    not: "NOT",
    to: "TO" // Maps ranges like [100 to 200] -> [100 TO 200]
  };

  while ((match = tokenRegex.exec(searchString)) !== null) {
    const [_, quotedToken, unquotedToken, whitespaceToken] = match;

    if (quotedToken) {
      // Keep everything inside double quotes perfectly preserved
      processedString += quotedToken;
    } else if (unquotedToken) {
      // Check if the current unquoted word is a lowercased operator
      const lowerToken = unquotedToken.toLowerCase();
      if (operatorMap[lowerToken]) {
        processedString += operatorMap[lowerToken];
      } else {
        processedString += unquotedToken;
      }
    } else if (whitespaceToken) {
      processedString += whitespaceToken;
    }
  }

  return processedString;
};

export function KibanaResponseProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [lastSortValues, setLastSortValues] = useState<any[] | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [histogramData, setHistogramData] = useState<any>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  /**
   * Prevent stale requests
   */
  const activeRequestIdRef = useRef(0);

  /**
   * Form store values
   */
  const { searchValue, selectedDataView, compiledDslQuery, timeRange, sortOrder } =
    useKibanaFormStore();

  /**
   * MANUAL FETCH ONLY
   * No automatic fetching
   */
  const fetchLogs = async (initialLoad = false) => {
    const requestId = ++activeRequestIdRef.current;

    try {
      setIsLoading(true);
      setSearchError(null);

      const rawSearchString = initialLoad ? "" : searchValue;

      // Validate Lucene structural rules before attempting network operations
      const syntaxCheck = validateKibanaSyntax(rawSearchString);
      if (!syntaxCheck.isValid) {
        setSearchError(syntaxCheck.error);
        setIsLoading(false);
        return;
      }

      // Automatically fix and normalize case configurations outside quotes
      const cleanSearchString = normalizeKibanaOperators(rawSearchString);

      /**
       * Clear old query results
       */
      setDocuments([]);
      setSearchResults(null);
      setHistogramData(null);
      setAvailableFields([]);
      setLastSortValues(undefined);
      setHasMore(false);

      const formattedTimeRange = {
        from: formatTZDate(timeRange?.from) || "",
        to: formatTZDate(timeRange?.to) || "",
        label: timeRange?.label || "",
      };

      const queryParams = {
        dataView: selectedDataView,
        searchString: cleanSearchString,
        query: initialLoad ? undefined : compiledDslQuery,
        timeRange: formattedTimeRange,
        sortOrder,
      };

      const [logsResponse, histogramResponse] = await Promise.all([
        searchLogs(queryParams),
        searchHistogram(queryParams),
      ]);


      console.log(logsResponse)
      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      setSearchResults(logsResponse);
      setHistogramData(histogramResponse?.aggregations?.log_distribution?.buckets || []);

      const hitRecords = logsResponse?.hits?.hits || [];
      setDocuments(hitRecords);

      if (hitRecords.length > 0) {
        setLastSortValues(hitRecords[hitRecords.length - 1].sort);
        setHasMore(hitRecords.length === 200);
      } else {
        setHasMore(false);
      }

      const discoveredFields = extractUniqueFields(hitRecords);
      const cleanedFields = discoveredFields.filter(
        (field: string) => !["_source", "_index", "_id", "_score"].includes(field)
      );

      setAvailableFields(cleanedFields);
    } catch (error: any) {
      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      setSearchError(error?.message || "Failed to fetch logs");
      setDocuments([]);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  /**
   * Pagination
   */
  const fetchMoreLogs = async () => {
    if (isPaginationLoading || !lastSortValues || !hasMore) {
      return;
    }

    const requestId = activeRequestIdRef.current;

    try {
      setIsPaginationLoading(true);
      setSearchError(null);

      // Validate Lucene syntax for paginated fetches
      const syntaxCheck = validateKibanaSyntax(searchValue);
      if (!syntaxCheck.isValid) {
        setSearchError(syntaxCheck.error);
        setHasMore(false); // Stop further loading attempts on validation error
        setIsPaginationLoading(false);
        return;
      }

      const cleanSearchString = normalizeKibanaOperators(searchValue);

      const formattedTimeRange = {
        from: formatTZDate(timeRange?.from) || "",
        to: formatTZDate(timeRange?.to) || "",
        label: timeRange?.label || "",
      };

      const queryParams = {
        dataView: selectedDataView,
        searchString: cleanSearchString,
        query: compiledDslQuery,
        timeRange: formattedTimeRange,
        sortOrder,
        searchAfter: lastSortValues,
      };

      const logsResponse = await searchLogs(queryParams);

      /**
       * Ignore stale pagination
       */
      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      const nextHitRecords = logsResponse?.hits?.hits || [];

      if (nextHitRecords.length > 0) {
        setDocuments((prevDocs) => [...prevDocs, ...nextHitRecords]);
        setLastSortValues(nextHitRecords[nextHitRecords.length - 1].sort);
        setHasMore(nextHitRecords.length === 200);

        const freshDiscoveredFields = extractUniqueFields(nextHitRecords);

        setAvailableFields((prevFields) => {
          const unionSet = new Set([...prevFields, ...freshDiscoveredFields]);
          return Array.from(unionSet).filter(
            (field) => !["_source", "_index", "_id", "_score"].includes(field)
          );
        });
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      if (requestId !== activeRequestIdRef.current) {
        return;
      }
      setSearchError(error?.message || "Failed to load more logs");
      setHasMore(false); // Stop loading more logs if a network/server error hits
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsPaginationLoading(false);
      }
    }
  };

  /**
   * Sidebar field selection
   */
  const toggleFieldSelection = (fieldName: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName) ? prev.filter((f) => f !== fieldName) : [...prev, fieldName]
    );
  };

  /**
   * Clear all results
   */
  const clearResults = () => {
    activeRequestIdRef.current++;
    setSearchResults(null);
    setDocuments([]);
    setHistogramData(null);
    setSearchError(null);
    setAvailableFields([]);
    setSelectedFields([]);
    setLastSortValues(undefined);
    setHasMore(false);
  };

  return (
    <KibanaResponseContext.Provider
      value={{
        isLoading,
        isPaginationLoading,
        searchError,
        searchResults,
        documents,
        hasMore,
        histogramData,
        availableFields,
        selectedFields,
        fetchLogs,
        fetchMoreLogs,
        toggleFieldSelection,
        setSelectedFields,
        clearResults,
      }}
    >
      {children}
    </KibanaResponseContext.Provider>
  );
}

export function useKibanaResponseStore() {
  const context = useContext(KibanaResponseContext);

  if (!context) {
    throw new Error("useKibanaResponseStore must be used within a KibanaResponseProvider");
  }

  return context;
}