// context/kibana-response-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { searchLogs, searchHistogram } from "../use-search-logs";
import { useKibanaFormStore } from "./kibana-form-context";
import { extractUniqueFields } from "../display-logs/utils/field-parser";

interface KibanaResponseContextType {
  isLoading: boolean;
  isPaginationLoading: boolean;
  searchError: string | null;
  searchResults: any;
  documents: any[];
  hasMore: boolean;

  // State access bindings for visual timeline consumers
  histogramData: any;

  // Kibana Sidebar Field States
  availableFields: string[];
  selectedFields: string[];

  // Management actions
  fetchLogs: (initialLoad?: boolean) => Promise<void>;
  fetchMoreLogs: () => Promise<void>;
  toggleFieldSelection: (fieldName: string) => void;
  setSelectedFields: (fields: string[]) => void;
  clearResults: () => void;
}

const KibanaResponseContext = createContext<KibanaResponseContextType | undefined>(undefined);

const formatTZDate = (date?: Date) => {
  if (!date) return "";
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}T${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}:${String(date.getUTCSeconds()).padStart(2, "0")}.${String(date.getUTCMilliseconds()).padStart(3, "0")}+00:00`;
};

export function KibanaResponseProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [lastSortValues, setLastSortValues] = useState<any[] | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  // Add local histogram bucket hook
  const [histogramData, setHistogramData] = useState<any>(null);

  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Extracted core parameters from the form store
  const { searchValue, selectedDataView, compiledDslQuery, timeRange, sortOrder } = useKibanaFormStore();

  // Keep track of the initial mount state to prevent double fetches on page spin-up
  const isInitialMount = useRef(true);

  /**
   * Fresh Search Query Request Engine
   */
  const fetchLogs = async (initialLoad = false) => {
    try {
      setIsLoading(true);
      setSearchError(null);
      setLastSortValues(undefined);
      setHasMore(false);

      const formattedTimeRange = {
        from: formatTZDate(timeRange?.from) || "",
        to: formatTZDate(timeRange?.to) || "",
        label: timeRange?.label || "",
      };

      const queryParams = {
        dataView: selectedDataView,
        searchString: initialLoad ? "" : searchValue,
        query: initialLoad ? undefined : compiledDslQuery,
        timeRange: formattedTimeRange,
        sortOrder: sortOrder,
      };

      const [logsResponse, histogramResponse] = await Promise.all([
        searchLogs(queryParams),
        searchHistogram(queryParams)
      ]);

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
      setSearchError(error?.message || "Failed to fetch logs");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * AUTOMATIC REACTIVITY LAYER
   * Fallback values guarantee that the structure of this dependency array
   * remains identically sized across all mount stages.
   */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedDataView && timeRange?.from && timeRange?.to) {
      fetchLogs(false);
    }
  }, [
    sortOrder,
    timeRange?.from ? timeRange.from.getTime() : 0, // Fallback provides a stable numeric structural slot
    timeRange?.to ? timeRange.to.getTime() : 0     // Fallback provides a stable numeric structural slot
  ]);

  /**
   * Paginated Log Incrementor Execution Loop
   */
  const fetchMoreLogs = async () => {
    if (isPaginationLoading || !lastSortValues || !hasMore) return;

    try {
      setIsPaginationLoading(true);
      setSearchError(null);

      const formattedTimeRange = {
        from: formatTZDate(timeRange?.from) || "",
        to: formatTZDate(timeRange?.to) || "",
        label: timeRange?.label || "",
      };

      const queryParams = {
        dataView: selectedDataView,
        searchString: searchValue,
        query: compiledDslQuery,
        timeRange: formattedTimeRange,
        sortOrder: sortOrder,
        searchAfter: lastSortValues,
      };

      const logsResponse = await searchLogs(queryParams);
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
      setSearchError(error?.message || "Failed to load more logs");
    } finally {
      setIsPaginationLoading(false);
    }
  };

  const toggleFieldSelection = (fieldName: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName) ? prev.filter((f) => f !== fieldName) : [...prev, fieldName]
    );
  };

  const clearResults = () => {
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