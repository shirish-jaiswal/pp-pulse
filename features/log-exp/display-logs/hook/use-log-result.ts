"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useKibanaResponseStore } from "../../context/kibana-response-context";
import { useKibanaFormStore } from "../../context/kibana-form-context";
import { getFieldValue } from "../utils/kibana-helpers";

export function useLogResults() {
  const {
    searchResults,
    documents,
    isPaginationLoading,
    hasMore,
    fetchMoreLogs,
    selectedFields,
    setSelectedFields,
    histogramData
  } = useKibanaResponseStore();

  const { sortOrder, setSortOrder } = useKibanaFormStore();

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [showHistogramViewer, setShowHistogramViewer] = useState(false);
  const [localQuery, setLocalQuery] = useState("");

  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Handle infinite scroll intersections
  useEffect(() => {
    const targetElement = observerTargetRef.current;
    if (!targetElement || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const sentinelRow = entries[0];
        if (sentinelRow.isIntersecting && !isPaginationLoading) {
          fetchMoreLogs();
        }
      },
      {
        root: null,
        rootMargin: "150px",
        threshold: 0.0,
      }
    );

    observer.observe(targetElement);

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [hasMore, isPaginationLoading, fetchMoreLogs]);

  /**
   * Flattens the document object properties into a space-separated
   * indexing string optimized for fuzzy-token lookup searches.
   */
  const buildSearchableText = useCallback((hit: any) => {
    const parts: string[] = [];
    const message = getFieldValue(hit, "message");

    if (message && message !== "-") parts.push(String(message));
    if (hit._index) parts.push(hit._index);
    if (hit._id) parts.push(hit._id);

    const flatten = (obj: any, prefix = "") => {
      if (!obj || typeof obj !== "object") return;
      Object.entries(obj).forEach(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object") {
          flatten(value, path);
        } else if (value !== null && value !== undefined) {
          parts.push(`${path}=${value}`);
          parts.push(`${key}=${value}`);
          parts.push(`${value}`);
        }
      });
    };

    if (hit._source) flatten(hit._source);
    return parts.join(" ").toLowerCase();
  }, []);

  /**
   * Pipeline filtering records client-side using tokenized logical query strings
   */
  const filteredDocuments = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return documents;

    return documents.filter((hit: any) => {
      const fullText = buildSearchableText(hit);
      try {
        const tokens = q.match(/"[^"]+"|\(|\)|\band\b|\bor\b|[^\s()]+/gi) || [];
        let currentOp: "AND" | "OR" = "AND";
        let result: boolean | null = null;

        const evaluateToken = (token: string) => {
          const clean = token.replace(/^"|"$/g, "").toLowerCase().trim();
          if (!clean) return true;
          if (fullText.includes(clean)) return true;
          if (fullText.includes(`${clean}=`)) return true;

          const words = fullText.split(/\s+/);
          return words.some((word) => {
            if (word.includes(clean)) return true;
            let i = 0, j = 0, mismatches = 0;
            while (i < word.length && j < clean.length) {
              if (word[i] === clean[j]) {
                i++; j++;
              } else {
                mismatches++; i++;
              }
              if (mismatches > 2) return false;
            }
            return j === clean.length;
          });
        };

        for (const rawToken of tokens) {
          const token = rawToken.toLowerCase();
          if (token === "and") { currentOp = "AND"; continue; }
          if (token === "or") { currentOp = "OR"; continue; }
          if (token === "(" || token === ")") continue;

          const tokenResult = evaluateToken(token);
          if (result === null) {
            result = tokenResult;
          } else if (currentOp === "AND") {
            result = result && tokenResult;
          } else {
            result = result || tokenResult;
          }
        }
        return result ?? true;
      } catch {
        return fullText.includes(q.replace(/"/g, ""));
      }
    });
  }, [documents, localQuery, buildSearchableText]);

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleRemoveColumn = useCallback((fieldToRemove: string) => {
    if (setSelectedFields) {
      setSelectedFields(selectedFields.filter((field) => field !== fieldToRemove));
    }
  }, [selectedFields, setSelectedFields]);

  // UI layout measurements
  const totalHits = searchResults?.hits?.total?.value ?? 0;
  const hasTimestamp = selectedFields.includes("@timestamp");
  const otherFieldsCount = hasTimestamp ? selectedFields.length - 1 : selectedFields.length;
  const standardColumnWidth = otherFieldsCount > 0 ? `${90 / otherFieldsCount}%` : "auto";

  return {
    searchResults,
    documents,
    filteredDocuments,
    isPaginationLoading,
    hasMore,
    selectedFields,
    histogramData,
    sortOrder,
    setSortOrder,
    expandedRows,
    toggleRow,
    showHistogramViewer,
    setShowHistogramViewer,
    localQuery,
    setLocalQuery,
    handleRemoveColumn,
    observerTargetRef,
    totalHits,
    standardColumnWidth
  };
}