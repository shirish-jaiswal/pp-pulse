"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionLogs } from "@/hooks/use-transactionlogs";
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

export function useLogState(roundId: string, timeStamp: any) {
  const { roundDetails } = useRoundDetails();

  const { data, isLoading } = useTransactionLogs({
    roundId,
    timeStamp,
    game_id: roundDetails?.tptInfo?.at(0)?.game_id as string,
    user_id: roundDetails?.tptInfo?.at(0)?.user_id as string,
    game_type: roundDetails?.gameDetails?.at(0)?.game_type as string,
  });

  const [activeTab, setActiveTab] = useState<string | null>("");
  const [query, setQuery] = useState("");

  const [tabColumnState, setTabColumnState] = useState<
    Record<string, string[]>
  >({});

  // =========================
  // Tabs
  // =========================
  const availableTabs = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).filter((k) => Array.isArray(data[k]));
  }, [data]);

  useEffect(() => {
    if (availableTabs.length && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  // =========================
  // Flatten logs for search
  // =========================
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

    if (h?.raw && typeof h.raw === "object") {
      flatten(h.raw, "raw");
    }

    if (h?.app && typeof h.app === "object") {
      flatten(h.app, "app");
    }

    return parts.join(" ").toLowerCase();
  };

  // =========================
  // Logs + Sidebar keys
  // =========================
  const { logs, sidebarKeys } = useMemo(() => {
    if (!data || !activeTab) return { logs: [], sidebarKeys: [] };

    const tabLogs = data[activeTab] || [];
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
  }, [data, activeTab]);

  // =========================
  // Default columns
  // =========================
  const computedDefaultColumns = useMemo(() => {
    if (!activeTab || !sidebarKeys.length) return [];

    const defaults =
      DEFAULT_COLUMNS_BY_TAB[activeTab] ||
      DEFAULT_COLUMNS_BY_TAB.default;

    return defaults.filter((c) =>
      sidebarKeys.some((k) => k === c || k.startsWith(c + "."))
    );
  }, [activeTab, sidebarKeys]);

  const visibleColumns = useMemo(() => {
    if (!activeTab) return [];

    const saved = tabColumnState[activeTab];

    if (saved?.length) return saved;
    if (computedDefaultColumns.length) return computedDefaultColumns;

    return ["message"];
  }, [activeTab, tabColumnState, computedDefaultColumns]);

  const setVisibleColumns = (updater: any) => {
    const next =
      typeof updater === "function"
        ? updater(visibleColumns)
        : updater;

    if (activeTab) {
      setTabColumnState((prev) => ({
        ...prev,
        [activeTab]: next,
      }));
    }
  };

  // =========================
  // 🔥 FIXED FILTER LOGIC
  // =========================
  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (logs || [])
      .filter((h: any) => {
        if (!q) return true;

        const fullText = buildSearchableText(h);

        try {
          const tokens =
            q.match(/"[^"]+"|\(|\)|\band\b|\bor\b|[^\s()]+/gi) || [];

          let currentOp: "AND" | "OR" = "AND";
          let result: boolean | null = null;

          const evaluateToken = (token: string) => {
            const clean = token.replace(/^"|"$/g, "").toLowerCase().trim();
            if (!clean) return true;

            // direct match
            if (fullText.includes(clean)) return true;

            // key=value support (seat="3")
            if (fullText.includes(`${clean}=`)) return true;

            // fuzzy match
            const words = fullText.split(/\s+/);

            return words.some((word) => {
              if (word.includes(clean)) return true;

              let i = 0,
                j = 0,
                mismatches = 0;

              while (i < word.length && j < clean.length) {
                if (word[i] === clean[j]) {
                  i++;
                  j++;
                } else {
                  mismatches++;
                  i++;
                }
                if (mismatches > 2) return false;
              }

              return j === clean.length;
            });
          };

          for (const rawToken of tokens) {
            const token = rawToken.toLowerCase();

            if (token === "and") {
              currentOp = "AND";
              continue;
            }

            if (token === "or") {
              currentOp = "OR";
              continue;
            }

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
      .sort(
        (a: any, b: any) =>
          new Date(a?.raw?.["@timestamp"] || 0).getTime() -
          new Date(b?.raw?.["@timestamp"] || 0).getTime()
      );
  }, [logs, query]);

  // =========================
  // Reset
  // =========================
  const resetToDefault = () => {
    if (!activeTab) return;

    setTabColumnState((prev) => {
      const updated = { ...prev };
      delete updated[activeTab];
      return updated;
    });
  };

  return {
    data,
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