"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionLogs } from "@/features/round-details/components/round-audit/tab-content/log-monitor/hooks/use-transactionlogs";
import { getDeepKeys } from "@/features/round-details/components/round-audit/tab-content/log-monitor/utils/log-utils";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";

const DEFAULT_COLUMNS_BY_TAB: Record<string, string[]> = {
  platformLogs: [
    "raw.app.serviceMethod",
    "raw.app.url",
    "raw.app.requestLog.log",
    "raw.app.responseLog.log",
  ],
  lcTransactionLogs: ["message", "raw.contextMap"],
  default: ["message", "raw.host"],
};

export function useLogState() {
  const {
    roundDetails,
    accumulatedLogs,
    setAccumulatedLogs,
    selectedRoundLogs,
  } = useRoundDetails();

  const roundId = roundDetails?.tptInfo?.[0]?.round_id || "";
  const timeStamp = roundDetails?.tptInfo?.[0]?.trans_date || "";

  // 1. Fetch data for current single round layout view
  const { data, isLoading, isError } = useTransactionLogs({
    roundId,
    timeStamp,
    game_id: roundDetails?.tptInfo?.at(0)?.game_id as string,
    user_id: roundDetails?.tptInfo?.at(0)?.user_id as string,
    game_type: roundDetails?.gameDetails?.at(0)?.game_type as string,
  });

  // 2. Sync network response payload to background cache map when loaded
  useEffect(() => {
    if (data && !isLoading && !isError && roundId) {
      setAccumulatedLogs((prev) => {
        if (prev[roundId]) return prev;
        return { ...prev, [roundId]: data };
      });
    }
  }, [data, isLoading, isError, roundId, setAccumulatedLogs]);

  // 3. Extract active single view log map layer cleanly without cyclic side-effects
  const currentRoundLogsData = useMemo(() => {
    if (!roundId) return null;
    return selectedRoundLogs[roundId] || null;
  }, [selectedRoundLogs, roundId]);

  const [activeTab, setActiveTab] = useState<string | null>("");
  const [query, setQuery] = useState("");
  const [tabColumnState, setTabColumnState] = useState<Record<string, string[]>>({});

  // 4. Extract tabs available across ALL currently selected active items
  const availableTabs = useMemo(() => {
    const tabsSet = new Set<string>();
    Object.values(selectedRoundLogs || {}).forEach((roundData: any) => {
      if (!roundData) return;
      Object.keys(roundData).forEach((k) => {
        if (Array.isArray(roundData[k])) {
          tabsSet.add(k);
        }
      });
    });
    return Array.from(tabsSet);
  }, [selectedRoundLogs]);

  useEffect(() => {
    if (availableTabs.length && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const buildSearchableText = (h: any) => {
    const parts: string[] = [];
    if (h?.message) parts.push(h.message);
    if (h?._index) parts.push(h._index);

    const flatten = (obj: any, prefix = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object") {
          flatten(value, path);
        } else {
          parts.push(`${path}=${value}`);
          parts.push(`${key}=${value}`);
          parts.push(`${value}`);
        }
      });
    };

    if (h?.raw && typeof h.raw === "object") flatten(h.raw, "raw");
    if (h?.app && typeof h.app === "object") flatten(h.app, "app");

    return parts.join(" ").toLowerCase();
  };

  const { logs, sidebarKeys } = useMemo(() => {
    if (!currentRoundLogsData || !activeTab) return { logs: [], sidebarKeys: [] };

    const tabLogs = currentRoundLogsData[activeTab] || [];
    const keySet = new Set<string>();

    tabLogs.forEach((log: any) => {
      if (log.message) keySet.add("message");
      if (log.raw) {
        getDeepKeys(log.raw).forEach((k) => {
          if (!k.includes("@timestamp")) keySet.add(`raw.${k}`);
        });
      }
      if (log.app) {
        getDeepKeys(log.app).forEach((k) => {
          keySet.add(`app.${k}`);
        });
      }
    });

    return {
      logs: tabLogs,
      sidebarKeys: Array.from(keySet).sort(),
    };
  }, [currentRoundLogsData, activeTab]);

  const computedDefaultColumns = useMemo(() => {
    if (!activeTab || !sidebarKeys.length) return [];
    const defaults = DEFAULT_COLUMNS_BY_TAB[activeTab] || DEFAULT_COLUMNS_BY_TAB.default;
    return defaults.filter((c) => sidebarKeys.some((k) => k === c || k.startsWith(c + ".")));
  }, [activeTab, sidebarKeys]);

  const visibleColumns = useMemo(() => {
    if (!activeTab) return [];
    const saved = tabColumnState[activeTab];
    if (saved?.length) return saved;
    if (computedDefaultColumns.length) return computedDefaultColumns;
    return ["message"];
  }, [activeTab, tabColumnState, computedDefaultColumns]);

  const setVisibleColumns = (updater: any) => {
    const next = typeof updater === "function" ? updater(visibleColumns) : updater;
    if (activeTab) {
      setTabColumnState((prev) => ({
        ...prev,
        [activeTab]: next,
      }));
    }
  };

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (logs || [])
      .filter((h: any) => {
        if (!q) return true;
        const fullText = buildSearchableText(h);
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
      })
      .sort((a: any, b: any) =>
        new Date(a?.raw?.["@timestamp"] || 0).getTime() - new Date(b?.raw?.["@timestamp"] || 0).getTime()
      );
  }, [logs, query]);

  const resetToDefault = () => {
    if (!activeTab) return;
    setTabColumnState((prev) => {
      const updated = { ...prev };
      delete updated[activeTab];
      return updated;
    });
  };

  return {
    data: currentRoundLogsData,
    allAccumulatedLogs: selectedRoundLogs, // Exposes only active checkbox round logs cleanly to toolbar plugin
    isLoading,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    visibleColumns,
    setVisibleColumns,
    availableTabs,
    sidebarKeys,
    filteredLogs,
    logs,
    roundId,
    resetToDefault,
  };
}