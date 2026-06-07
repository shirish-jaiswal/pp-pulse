// @/features/round-details/components/round-audit/tab-content/log-monitor/hooks/useLogState.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { useIsolatedLogs } from "./use-transactionlogs";
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
  default: ["message"],
};

export function useLogState() {
  const {
    roundDetails,
    setAccumulatedLogs,
    accumulatedLogs,
  } = useRoundDetails();

  const roundId = roundDetails?.tptInfo?.[0]?.round_id || "";
  const timeStamp = roundDetails?.tptInfo?.[0]?.trans_date || "";

  const transactionParams = useMemo(() => {
    return {
      roundId,
      timeStamp,
      game_id: roundDetails?.tptInfo?.at(0)?.game_id as string,
      user_id: roundDetails?.tptInfo?.at(0)?.user_id as string,
      game_type: roundDetails?.gameDetails?.at(0)?.game_type as string,
    };
  }, [roundId, timeStamp, roundDetails?.tptInfo, roundDetails?.gameDetails]);

  const { txnQuery, gameQuery } = useIsolatedLogs(transactionParams);

  const [activeTab, setActiveTab] = useState<string | null>("platformLogs");
  const [query, setQuery] = useState("");
  const [tabColumnState, setTabColumnState] = useState<Record<string, string[]>>({});

  const availableTabs = useMemo(() => ["platformLogs", "lcTransactionLogs", "gameLogs"], []);

  useEffect(() => {
    if (availableTabs.length && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  /**
   * Helper function to strictly validate that a log line belongs to the current roundId
   */
  const filterLogsByRoundId = (logsArray: any[], targetedRound: string) => {
    if (!logsArray || !Array.isArray(logsArray)) return [];
    if (!targetedRound) return logsArray;

    return logsArray.filter((log: any) => {
      if (!log) return false;

      const logRoundId = log.roundId ||
        log.round_id ||
        log.raw?.roundId ||
        log.raw?.round_id ||
        log.raw?.contextMap?.roundId ||
        log.raw?.contextMap?.round_id ||
        log.app?.roundId ||
        log.app?.round_id;

      if (logRoundId) {
        return String(logRoundId).trim() === String(targetedRound).trim();
      }

      return true;
    });
  };

  // Filter out overlapping fast solo rounds BEFORE updating platform/transaction cache state
  useEffect(() => {
    if (txnQuery.data && roundId) {
      const cleanPlatformLogs = filterLogsByRoundId(txnQuery.data.platformLogs, roundId);
      const cleanLcTxnLogs = filterLogsByRoundId(txnQuery.data.lcTransactionLogs, roundId);

      setAccumulatedLogs((prev) => {
        const currentRoundCache = prev[roundId] || {};
        return {
          ...prev,
          [roundId]: {
            ...currentRoundCache,
            lcTransactionLogs: cleanLcTxnLogs,
            platformLogs: cleanPlatformLogs,
            isTxnError: txnQuery.data.isTxnError ?? false,
          },
        };
      });
    }
  }, [txnQuery.data, roundId, setAccumulatedLogs]);

  // Filter out overlapping fast solo rounds BEFORE updating game log cache state
  useEffect(() => {
    if (gameQuery.data && roundId) {
      const cleanGameLogs = filterLogsByRoundId(gameQuery.data.gameLogs, roundId);

      setAccumulatedLogs((prev) => {
        const currentRoundCache = prev[roundId] || {};
        return {
          ...prev,
          [roundId]: {
            ...currentRoundCache,
            gameLogs: cleanGameLogs,
            isGameError: gameQuery.data.isGameError ?? false,
          },
        };
      });
    }
  }, [gameQuery.data, roundId, setAccumulatedLogs]);

  // Read data instantly from active queries or fallback to state cache safely
  const logs = useMemo(() => {
    if (!activeTab || !roundId) return [];

    const showTxnQueryInstantData = txnQuery.data && !txnQuery.isFetching;
    const showGameQueryInstantData = gameQuery.data && !gameQuery.isFetching;

    if (activeTab === "gameLogs") {
      if (showGameQueryInstantData && gameQuery.data?.gameLogs) {
        return filterLogsByRoundId(gameQuery.data.gameLogs, roundId);
      }
      return accumulatedLogs[roundId]?.gameLogs || [];
    }

    if (activeTab === "platformLogs") {
      if (showTxnQueryInstantData && txnQuery.data?.platformLogs) {
        return filterLogsByRoundId(txnQuery.data.platformLogs, roundId);
      }
      return accumulatedLogs[roundId]?.platformLogs || [];
    }

    if (activeTab === "lcTransactionLogs") {
      if (showTxnQueryInstantData && txnQuery.data?.lcTransactionLogs) {
        return filterLogsByRoundId(txnQuery.data.lcTransactionLogs, roundId);
      }
      return accumulatedLogs[roundId]?.lcTransactionLogs || [];
    }

    return [];
  }, [activeTab, txnQuery.data, txnQuery.isFetching, gameQuery.data, gameQuery.isFetching, accumulatedLogs, roundId]);

  // Determine error layout parameters per stream safely
  const hasTxnError = !!(txnQuery.data?.isTxnError || accumulatedLogs[roundId]?.isTxnError || txnQuery.isError);
  const hasGameError = !!(gameQuery.data?.isGameError || accumulatedLogs[roundId]?.isGameError || gameQuery.isError);

  // Isolate processing indicators for granular tab UI reflection
  const txnIsLoading = txnQuery.isLoading || txnQuery.isFetching || txnQuery.isRefetching;
  const gameIsLoading = gameQuery.isLoading || gameQuery.isFetching || gameQuery.isRefetching;

  const txnIsSuccess = txnQuery.isSuccess && !hasTxnError && !txnIsLoading;
  const gameIsSuccess = gameQuery.isSuccess && !hasGameError && !gameIsLoading;

  const tabStatus = useMemo(() => {
    const isGameTab = activeTab === "gameLogs";
    const targetQuery = isGameTab ? gameQuery : txnQuery;
    const currentTabError = isGameTab ? hasGameError : hasTxnError;

    return {
      isLoading: isGameTab ? gameIsLoading : txnIsLoading,
      isError: currentTabError,
      refetch: targetQuery.refetch,
    };
  }, [activeTab, txnQuery, gameQuery, hasTxnError, hasGameError, txnIsLoading, gameIsLoading]);

  const refetchRoundLogs = async (): Promise<void> => {
    await tabStatus.refetch();
  };

  const sidebarKeys = useMemo(() => {
    const keySet = new Set<string>();
    logs.forEach((log: any) => {
      if (log.message) keySet.add("message");
      if (log.raw) {
        getDeepKeys(log.raw).forEach((k) => {
          if (!k.includes("@timestamp")) keySet.add(`raw.${k}`);
        });
      }
      if (log.app) {
        getDeepKeys(log.app).forEach((k) => keySet.add(`app.${k}`));
      }
    });
    return Array.from(keySet).sort();
  }, [logs]);

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
      setTabColumnState((prev) => ({ ...prev, [activeTab]: next }));
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
    data: logs,
    allAccumulatedLogs: accumulatedLogs,
    isLoading: tabStatus.isLoading,
    isTabError: tabStatus.isError,
    hasTxnError,
    hasGameError,
    txnIsLoading,
    gameIsLoading,
    txnIsSuccess,
    gameIsSuccess,
    refetchRoundLogs,
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